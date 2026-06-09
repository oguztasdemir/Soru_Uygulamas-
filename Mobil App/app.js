// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered.'))
            .catch(err => console.log('Service Worker registration failed: ', err));
    });
}

// PWA Install Prompt Logic
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

function openInstallGuide() {
    const modal = document.getElementById('install-guide-modal');
    if (modal) modal.style.display = 'flex';
}

function closeInstallGuide() {
    const modal = document.getElementById('install-guide-modal');
    if (modal) modal.style.display = 'none';
}

function switchInstallTab(platform) {
    const iosBtn = document.getElementById('tab-ios-btn');
    const androidBtn = document.getElementById('tab-android-btn');
    const iosContent = document.getElementById('guide-ios');
    const androidContent = document.getElementById('guide-android');
    
    if (platform === 'ios') {
        iosBtn.classList.add('active');
        androidBtn.classList.remove('active');
        iosContent.style.display = 'block';
        androidContent.style.display = 'none';
    } else {
        androidBtn.classList.add('active');
        iosBtn.classList.remove('active');
        androidContent.style.display = 'block';
        iosContent.style.display = 'none';
        
        // Automatically trigger native prompt if available
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the PWA install prompt');
                }
                deferredPrompt = null;
            });
        }
    }
}

// Global App State
let activeCourse = null; // 'ml', 'gai', 'ds', or 'isg'
let allQuestions = [];
let allCardsQuestions = [];
let allTipsQuestions = [];
let activeQuiz = {
    questions: [],
    currentIndex: 0,
    answers: [], // Stores { questionId, chosenAnswer, isCorrect }
    timer: null,
    seconds: 0
};
let activeCardsQuiz = {
    questions: [],
    currentIndex: 0,
    answers: [], // Stores { questionId, chosenAnswer, isCorrect }
    timer: null,
    seconds: 0
};
let wrongQuestionIds = [];
let starredQuestionIds = [];
let activeWrongTab = 'wrong'; // 'wrong' or 'starred'
let questionStats = {}; // { qId: { correct: X, wrong: Y } }
let userStats = { correct: 0, wrong: 0 };
let studyNotes = [];
let answerOverrides = {};
let allQuestionsSort = { col: 'id', desc: false };

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Load theme
    const savedTheme = localStorage.getItem('app_theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        const themeIcon = document.querySelector('#theme-toggle-btn i');
        if (themeIcon) {
            themeIcon.className = 'fa-solid fa-sun';
        }
    }
    backToLanding();
});

const ISG_CHECKLIST_DATA = [
    { id: "c1", text: "Konu 1: Sayfa 17-23 (Ramazzini, Pott, Sanayi Devrimi) ve Sayfa 29 (Tehlike/Risk farkı)" },
    { id: "c2", text: "Konu 4/5: KKD özellikleri (ek risk oluşturmama, ücretsiz temin, hiyerarşide son çare)" },
    { id: "c3", text: "Konu 6/7: Kurul şartları (50+ çalışan, 6+ ay) ve periyotları (Çok tehlikeli: her ay, tehlikeli: 2 ay, az tehlikeli: 3 ay)" },
    { id: "c4", text: "Konu 6/7: 5510 md 13 iş kazası halleri (mola, süt izni, servis) ve 3 iş günü bildirim süresi" },
    { id: "c5", text: "Konu 8: Çalışmaktan kaçınma hakkı şartları, kurul başvurusu ve ücret hakkı" },
    { id: "c6", text: "Konu 8: Kaza Sıklık Hızı (KSH) ve Kaza Ağırlık Hızı (KAH) formülleri (ölümde +6000 gün)" },
    { id: "c7", text: "Konu 9: Risk değerlendirmesi 5 adımı, proaktif/reaktif farkları ve yenilenme süreleri (2-4-6 yıl)" },
    { id: "c8", text: "Konu 9: Sayfa 139'daki risk puanı değerlendirmesi ve eylemler (15-25: Kabul Edilemez, 8-12: Dikkate Değer)" },
    { id: "c9", text: "Konu 9B: Sayfa Z4, 114 ve 115'teki tabloların hatalı olduğu, 9A sayfa 137 ve 139'un doğru olduğu bilgisi" },
    { id: "c10", text: "Konu 11: Haftalık 45 saat, fazla mesai 270 saat, günlük 11 saat ve gece 7.5 saat limitleri" },
    { id: "c11", text: "Konu 11: Kıdeme göre ihbar süreleri (2-4-6-8 hafta) ve işe iade davası şartları/tazminatları" },
    { id: "c12", text: "Yavuz Hoca: Gürültü sınırları (85/87 dBA) ve zorunlu ilkyardımcı oranları (10/15/20 çalışanda 1)" }
];

function renderISGChecklist() {
    const container = document.getElementById('isg-checklist-items');
    if (!container) return;
    container.innerHTML = '';
    
    const checkedItems = JSON.parse(localStorage.getItem('isg_hoca_tips_checklist')) || [];
    
    ISG_CHECKLIST_DATA.forEach(item => {
        const isChecked = checkedItems.includes(item.id);
        const row = document.createElement('label');
        row.style.display = 'flex';
        row.style.alignItems = 'flex-start';
        row.style.gap = '10px';
        row.style.padding = '8px 10px';
        row.style.backgroundColor = 'rgba(255,255,255,0.02)';
        row.style.border = '1px solid var(--border-color)';
        row.style.borderRadius = '8px';
        row.style.cursor = 'pointer';
        row.style.fontSize = '0.8rem';
        row.style.lineHeight = '1.3';
        row.style.transition = 'background-color 0.2s';
        
        row.innerHTML = `
            <input type="checkbox" id="chk-${item.id}" ${isChecked ? 'checked' : ''} onchange="toggleISGChecklistItem('${item.id}')" style="margin-top: 2px; cursor: pointer;">
            <span style="color: ${isChecked ? 'var(--text-secondary)' : 'var(--text-main)'}; text-decoration: ${isChecked ? 'line-through' : 'none'};">${item.text}</span>
        `;
        container.appendChild(row);
    });
}

function toggleISGChecklistItem(itemId) {
    let checkedItems = JSON.parse(localStorage.getItem('isg_hoca_tips_checklist')) || [];
    if (checkedItems.includes(itemId)) {
        checkedItems = checkedItems.filter(id => id !== itemId);
    } else {
        checkedItems.push(itemId);
    }
    localStorage.setItem('isg_hoca_tips_checklist', JSON.stringify(checkedItems));
    renderISGChecklist();
}

// Subject / Course Selection Screen Router
function selectCourse(courseId) {
    activeCourse = courseId;
    
    // Load localstorage data based on selected course
    wrongQuestionIds = JSON.parse(localStorage.getItem(`${activeCourse}_wrong_questions`)) || [];
    starredQuestionIds = JSON.parse(localStorage.getItem(`${activeCourse}_starred_questions`)) || [];
    questionStats = JSON.parse(localStorage.getItem(`${activeCourse}_question_stats`)) || {};
    userStats = JSON.parse(localStorage.getItem(`${activeCourse}_stats`)) || { correct: 0, wrong: 0 };
    answerOverrides = JSON.parse(localStorage.getItem(`${activeCourse}_answer_overrides`)) || {};
    
    // Restore active quiz session if it exists
    const savedQuiz = localStorage.getItem(`${activeCourse}_active_quiz`);
    if (savedQuiz) {
        const parsed = JSON.parse(savedQuiz);
        activeQuiz.questions = parsed.questions || [];
        activeQuiz.currentIndex = parsed.currentIndex || 0;
        activeQuiz.answers = parsed.answers || [];
        activeQuiz.seconds = parsed.seconds || 0;
    } else {
        activeQuiz.questions = [];
        activeQuiz.currentIndex = 0;
        activeQuiz.answers = [];
        activeQuiz.seconds = 0;
    }
    
    activeWrongTab = 'wrong';
    
    // Set settings UI checkbox
    const smartQuizEnabled = localStorage.getItem(`${activeCourse}_smart_quiz`) !== 'false';
    const smartQuizCheckbox = document.getElementById('setting-smart-quiz');
    if (smartQuizCheckbox) {
        smartQuizCheckbox.checked = smartQuizEnabled;
        updateSmartQuizStatusUI();
    }
    
    // Apply subject theme classes and contents
    if (activeCourse === 'ml') {
        document.body.classList.remove('theme-gai', 'theme-ds', 'theme-isg');
        document.documentElement.style.setProperty('--theme-color', '#4299E1');
        document.documentElement.style.setProperty('--theme-color-rgb', '66, 153, 225');
        document.getElementById('app-logo-title').innerText = 'Makine Öğrenmesi';
        document.getElementById('app-logo-icon').className = 'fa-solid fa-brain-circuit brain-icon';
        document.getElementById('dashboard-welcome-title').innerText = 'Selam Geleceğin ML Uzmanı! 👋';
        studyNotes = studyNotesML;
        
        loadQuestions('ml/questions.json');
        loadCards('ml/cards.json');
    } else if (activeCourse === 'gai') {
        document.body.classList.remove('theme-ds', 'theme-isg');
        document.body.classList.add('theme-gai');
        document.documentElement.style.setProperty('--theme-color', '#A855F7');
        document.documentElement.style.setProperty('--theme-color-rgb', '168, 85, 247');
        document.getElementById('app-logo-title').innerText = 'Üretken Yapay Zeka';
        document.getElementById('app-logo-icon').className = 'fa-solid fa-wand-magic-sparkles brain-icon';
        document.getElementById('dashboard-welcome-title').innerText = 'Selam Geleceğin Yapay Zeka Uzmanı! 👋';
        studyNotes = studyNotesGAI;
        
        loadQuestions('gai/questions.json');
        loadCards('gai/cards.json');
    } else if (activeCourse === 'ds') {
        document.body.classList.remove('theme-gai', 'theme-isg');
        document.body.classList.add('theme-ds');
        document.documentElement.style.setProperty('--theme-color', '#10B981');
        document.documentElement.style.setProperty('--theme-color-rgb', '16, 185, 129');
        document.getElementById('app-logo-title').innerText = 'Dijital Sürdürülebilirlik';
        document.getElementById('app-logo-icon').className = 'fa-solid fa-leaf brain-icon';
        document.getElementById('dashboard-welcome-title').innerText = 'Selam Sürdürülebilirlik Elçisi! 🌿';
        studyNotes = studyNotesDS;
        
        loadQuestions('ds/questions.json');
        loadCards('ds/cards.json');
    } else if (activeCourse === 'isg') {
        document.body.classList.remove('theme-gai', 'theme-ds');
        document.body.classList.add('theme-isg');
        document.documentElement.style.setProperty('--theme-color', '#F97316');
        document.documentElement.style.setProperty('--theme-color-rgb', '249, 115, 22');
        document.getElementById('app-logo-title').innerText = 'İş Sağlığı ve Güvenliği';
        document.getElementById('app-logo-icon').className = 'fa-solid fa-shield-halved brain-icon';
        document.getElementById('dashboard-welcome-title').innerText = 'Selam İSG Sorumlusu! 🛡️';
        studyNotes = studyNotesISG;
        
        loadQuestions('isg/questions.json');
        loadCards('isg/cards.json');
        loadTipsQuestions('isg/tips_questions.json');
    }
    
    // Show/hide ISG Hoca Tips buttons & Checklist
    const isgTipsCard = document.getElementById('dashboard-isg-tips-card');
    const isgTipsBtn = document.getElementById('btn-isg-tips-quiz');
    const isgChecklistCard = document.getElementById('dashboard-isg-checklist-card');
    if (activeCourse === 'isg') {
        if (isgTipsCard) isgTipsCard.style.display = 'block';
        if (isgTipsBtn) isgTipsBtn.style.display = 'flex';
        if (isgChecklistCard) {
            isgChecklistCard.style.display = 'block';
            renderISGChecklist();
        }
    } else {
        if (isgTipsCard) isgTipsCard.style.display = 'none';
        if (isgTipsBtn) isgTipsBtn.style.display = 'none';
        if (isgChecklistCard) isgChecklistCard.style.display = 'none';
    }
    
    // Reveal Navigation and header features
    document.querySelector('.app-nav').classList.remove('hidden');
    document.getElementById('change-course-btn').style.display = 'flex';
    document.getElementById('settings-toggle-btn').style.display = 'flex';
    
    switchTab('dashboard');
}

// Return to selection screen landing
function backToLanding() {
    // Reset state variables
    activeCourse = null;
    allQuestions = [];
    allCardsQuestions = [];
    allTipsQuestions = [];
    wrongQuestionIds = [];
    starredQuestionIds = [];
    questionStats = {};
    userStats = { correct: 0, wrong: 0 };
    studyNotes = [];
    
    // Reset Header and Theme
    document.body.classList.remove('theme-gai', 'theme-ds', 'theme-isg');
    document.getElementById('app-logo-title').innerText = 'Mobil App';
    document.getElementById('app-logo-icon').className = 'fa-solid fa-brain-circuit brain-icon';
    document.getElementById('change-course-btn').style.display = 'none';
    document.getElementById('settings-toggle-btn').style.display = 'none';
    
    // Hide ISG Hoca Tips buttons & Checklist
    const isgTipsCard = document.getElementById('dashboard-isg-tips-card');
    const isgTipsBtn = document.getElementById('btn-isg-tips-quiz');
    const isgChecklistCard = document.getElementById('dashboard-isg-checklist-card');
    if (isgTipsCard) isgTipsCard.style.display = 'none';
    if (isgTipsBtn) isgTipsBtn.style.display = 'none';
    if (isgChecklistCard) isgChecklistCard.style.display = 'none';
    
    // Hide nav and show landing
    document.querySelector('.app-nav').classList.add('hidden');
    
    // De-activate all screens and activate landing
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('screen-landing').classList.add('active');
}

// Fetch questions from JSON file and set up UI
function loadQuestions(jsonFileName) {
    fetch(jsonFileName)
        .then(response => response.json())
        .then(data => {
            allQuestions = data;
            
            // Apply answer overrides
            allQuestions.forEach(q => {
                if (answerOverrides[q.id]) {
                    q.answer = answerOverrides[q.id];
                }
            });
            
            // Dynamically update the main test button text to show the correct total count
            const fullDenemeBtn = document.querySelector('button[onclick^="startQuiz("]:nth-child(3)');
            if (fullDenemeBtn) {
                fullDenemeBtn.setAttribute('onclick', `startQuiz(${allQuestions.length})`);
                fullDenemeBtn.querySelector('h4').innerText = `Tam Deneme (${allQuestions.length} Soru)`;
                fullDenemeBtn.querySelector('p').innerText = `Sınav bankasındaki ${allQuestions.length} sorunun tamamını çöz.`;
            }
            
            // Dynamically update action card question count text
            const actionCardText = document.querySelector('.action-card[onclick="switchTab(\'quiz\')"] p');
            if (actionCardText) {
                actionCardText.innerText = `${allQuestions.length} soruluk sınav soru havuzundan hemen çalışmaya başla.`;
            }

            // Check if categories exist and toggle category quiz button
            const hasCategories = allQuestions.some(q => q.category);
            const categoryQuizBtn = document.getElementById('btn-category-quiz');
            if (categoryQuizBtn) {
                if (hasCategories) {
                    categoryQuizBtn.style.display = 'flex';
                } else {
                    categoryQuizBtn.style.display = 'none';
                }
            }

            // Populate all-questions-category-filter
            const catFilter = document.getElementById('all-questions-category-filter');
            if (catFilter) {
                catFilter.innerHTML = '<option value="">Tüm Konular</option>';
                const categories = [];
                allQuestions.forEach(q => {
                    if (q.category && !categories.includes(q.category.trim())) {
                        categories.push(q.category.trim());
                    }
                });
                categories.sort().forEach(cat => {
                    const opt = document.createElement('option');
                    opt.value = cat;
                    opt.innerText = cat;
                    catFilter.appendChild(opt);
                });
            }

            // Starred Quiz button visibility
            const btnStarredQuiz = document.getElementById('btn-starred-quiz');
            if (btnStarredQuiz) {
                if (starredQuestionIds.length > 0) {
                    btnStarredQuiz.style.display = 'flex';
                    document.getElementById('btn-starred-quiz-desc').innerText = `Yıldızla işaretlediğiniz ${starredQuestionIds.length} soruyu test olarak çözün.`;
                } else {
                    btnStarredQuiz.style.display = 'none';
                }
            }

            renderStudyNotes();
            updateDashboardStats();
            updateWrongCountBadge();
            renderPerformanceChart();
        })
        .catch(err => {
            console.error("Questions could not be loaded:", err);
        });
}

// Fetch terminology cards from JSON file
function loadCards(jsonFileName) {
    fetch(jsonFileName)
        .then(response => response.json())
        .then(data => {
            allCardsQuestions = data;
            
            // Dynamically update the terminology quiz buttons
            const fullCardsBtn = document.getElementById('cards-full-btn');
            if (fullCardsBtn) {
                fullCardsBtn.setAttribute('onclick', `startCardsQuiz(${allCardsQuestions.length})`);
                fullCardsBtn.querySelector('h4').innerText = `Tam Terim Sınavı (${allCardsQuestions.length} Terim)`;
                fullCardsBtn.querySelector('p').innerText = `Sistemdeki ${allCardsQuestions.length} terimin tamamını çöz.`;
            }
        })
        .catch(err => {
            console.error("Terminology cards could not be loaded:", err);
        });
}

// Fetch Hoca tips questions from JSON file
function loadTipsQuestions(jsonFileName) {
    fetch(jsonFileName)
        .then(response => response.json())
        .then(data => {
            allTipsQuestions = data;
            
            // Dynamically update the Hoca tips quiz button text to show the correct total count
            const tipsBtn = document.getElementById('btn-isg-tips-quiz');
            if (tipsBtn) {
                const descText = tipsBtn.querySelector('p');
                if (descText) descText.innerText = `Yavuz Hoca'nın sınav ipuçları ve özel ders notlarına dayalı ${allTipsQuestions.length} soru.`;
            }
        })
        .catch(err => {
            console.error("Hoca tips questions could not be loaded:", err);
        });
}

// Navigation / Screen Switching
function switchTab(tabId) {
    // Pause running timers when navigating away from the active screen
    if (tabId !== 'quiz' && activeQuiz.timer) {
        clearInterval(activeQuiz.timer);
        activeQuiz.timer = null;
    }
    if (tabId !== 'cards' && activeCardsQuiz.timer) {
        clearInterval(activeCardsQuiz.timer);
        activeCardsQuiz.timer = null;
    }

    // Update nav items active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const targetNav = document.getElementById(`nav-${tabId}`);
    if (targetNav) targetNav.classList.add('active');

    // Update screen views
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const targetScreen = document.getElementById(`screen-${tabId}`);
    if (targetScreen) targetScreen.classList.add('active');

    // Render screen specific data
    if (tabId === 'dashboard') {
        updateDashboardStats();
    } else if (tabId === 'quiz') {
        // Reset quiz subviews
        document.getElementById('quiz-init-view').classList.add('active');
        const categoryView = document.getElementById('quiz-category-view');
        if (categoryView) {
            categoryView.style.display = 'none';
            categoryView.classList.remove('active');
        }
        document.getElementById('quiz-active-view').classList.remove('active');
        document.getElementById('quiz-results-view').classList.remove('active');
        
        // Show/hide wrong questions quiz button based on stats
        const btnWrongQuiz = document.getElementById('btn-wrong-quiz');
        if (btnWrongQuiz) {
            if (wrongQuestionIds.length > 0) {
                btnWrongQuiz.style.display = 'flex';
                const descText = document.getElementById('btn-wrong-quiz-desc');
                if (descText) descText.innerText = `Kayıtlı ${wrongQuestionIds.length} yanlış sorunu çözerek hatalarını düzelt.`;
            } else {
                btnWrongQuiz.style.display = 'none';
            }
        }
        
        // Update visibility of the starred quiz button
        const btnStarredQuiz = document.getElementById('btn-starred-quiz');
        if (btnStarredQuiz) {
            if (starredQuestionIds.length > 0) {
                btnStarredQuiz.style.display = 'flex';
                document.getElementById('btn-starred-quiz-desc').innerText = `Yıldızla işaretlediğiniz ${starredQuestionIds.length} soruyu test olarak çözün.`;
            } else {
                btnStarredQuiz.style.display = 'none';
            }
        }
        
        // Update visibility and state of the resume card
        updateResumeCard();
    } else if (tabId === 'cards') {
        // Reset terminology cards subviews
        document.getElementById('cards-init-view').classList.add('active');
        document.getElementById('cards-active-view').classList.remove('active');
        document.getElementById('cards-results-view').classList.remove('active');

        // Update visibility and state of the terminology resume card
        updateCardsResumeCard();
    } else if (tabId === 'wrong') {
        renderWrongQuestions();
    } else if (tabId === 'all-questions') {
        renderAllQuestionsTable();
    }
}

// Render study notes as accordion cards
function renderStudyNotes() {
    const notesContainer = document.getElementById('notes-list');
    notesContainer.innerHTML = '';

    studyNotes.forEach((note, index) => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `
            <button class="note-header" onclick="toggleAccordion(this)">
                <span>${note.title}</span>
                <i class="fa-solid fa-chevron-down"></i>
            </button>
            <div class="note-body">
                ${note.content}
            </div>
        `;
        notesContainer.appendChild(card);
    });
}

function toggleAccordion(button) {
    const card = button.parentElement;
    const body = card.querySelector('.note-body');
    const isActive = card.classList.contains('active');

    // Close all accordions first
    document.querySelectorAll('.note-card').forEach(c => {
        c.classList.remove('active');
        c.querySelector('.note-body').style.maxHeight = null;
    });

    if (!isActive) {
        card.classList.add('active');
        body.style.maxHeight = body.scrollHeight + "px";
    }
}

// Update dashboard metrics
function updateDashboardStats() {
    document.getElementById('stat-correct').innerText = userStats.correct;
    document.getElementById('stat-wrong').innerText = userStats.wrong;

    const total = userStats.correct + userStats.wrong;
    const ratio = total > 0 ? Math.round((userStats.correct / total) * 100) : 0;

    // Progress Ring style
    const dashboardProgress = document.getElementById('dashboard-progress');
    dashboardProgress.style.background = `conic-gradient(var(--primary-light) ${ratio * 3.6}deg, var(--border-color) 0deg)`;
    document.getElementById('dashboard-progress-val').innerText = `${ratio}%`;

    // Summary Text
    const summaryText = document.getElementById('dashboard-stats-summary');
    if (total === 0) {
        summaryText.innerText = "Henüz test çözmeye başlamadın.";
    } else {
        summaryText.innerText = `Toplam ${total} soru çözdün. Başarı oranınız %${ratio}.`;
    }
    
    // Konu Bazlı Başarı Analizi (Category Breakdown)
    const categoryCard = document.getElementById('dashboard-category-card');
    const categoryBarsContainer = document.getElementById('dashboard-category-bars');
    
    if (categoryCard && categoryBarsContainer) {
        const catStats = {}; // { categoryName: { correct: 0, total: 0 } }
        
        allQuestions.forEach(q => {
            const stat = questionStats[q.id];
            if (stat && (stat.correct > 0 || stat.wrong > 0) && q.category) {
                const cat = q.category.trim();
                if (!catStats[cat]) {
                    catStats[cat] = { correct: 0, total: 0 };
                }
                catStats[cat].correct += stat.correct;
                catStats[cat].total += (stat.correct + stat.wrong);
            }
        });
        
        const catKeys = Object.keys(catStats);
        if (catKeys.length > 0) {
            categoryCard.style.display = 'block';
            categoryBarsContainer.innerHTML = '';
            
            catKeys.sort().forEach(catName => {
                const data = catStats[catName];
                const percent = Math.round((data.correct / data.total) * 100);
                
                // Beautiful status colors
                let barColor = 'var(--wrong-light)';
                if (percent >= 80) {
                    barColor = 'var(--success-light)';
                } else if (percent >= 50) {
                    barColor = 'var(--primary-light)';
                }
                
                const barRow = document.createElement('div');
                barRow.style.display = 'flex';
                barRow.style.flexDirection = 'column';
                barRow.style.gap = '6px';
                barRow.innerHTML = `
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; align-items: center;">
                        <span style="font-weight: 600; color: var(--text-main);">${catName}</span>
                        <span style="color: var(--text-secondary); font-weight: 500;">%${percent} (${data.total} Soru)</span>
                    </div>
                    <div style="width: 100%; height: 6px; background-color: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                        <div style="width: ${percent}%; height: 100%; background-color: ${barColor}; border-radius: 3px; transition: width 0.6s cubic-bezier(0.1, 1, 0.1, 1);"></div>
                    </div>
                `;
                categoryBarsContainer.appendChild(barRow);
            });
        } else {
            categoryCard.style.display = 'none';
        }
    }
    
    updateWrongCountBadge();
    renderPerformanceChart();
}

function updateWrongCountBadge() {
    const badge = document.getElementById('wrong-count-badge');
    const wrongCount = wrongQuestionIds.length;
    if (wrongCount > 0) {
        badge.innerText = wrongCount;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

function openCategorySelection() {
    const listContainer = document.getElementById('quiz-categories-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    // Group questions by category
    const categoryMap = {};
    allQuestions.forEach(q => {
        if (q.category) {
            const cat = q.category.trim();
            categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        }
    });

    // Render each category as a menu-item
    Object.keys(categoryMap).sort().forEach(category => {
        const count = categoryMap[category];
        const button = document.createElement('button');
        button.className = 'menu-item';
        button.onclick = () => startCategoryQuiz(category);
        button.innerHTML = `
            <div class="menu-icon"><i class="fa-solid fa-tags"></i></div>
            <div class="menu-text">
                <h4>${category}</h4>
                <p>Bu konuya ait ${count} adet soru bulunmaktadır.</p>
            </div>
            <i class="fa-solid fa-chevron-right arrow-icon" style="margin-left: auto;"></i>
        `;
        listContainer.appendChild(button);
    });

    document.getElementById('quiz-init-view').classList.remove('active');
    document.getElementById('quiz-category-view').style.display = 'block';
    document.getElementById('quiz-category-view').classList.add('active');
}

function backToQuizInit() {
    document.getElementById('quiz-category-view').style.display = 'none';
    document.getElementById('quiz-category-view').classList.remove('active');
    document.getElementById('quiz-init-view').classList.add('active');
}

function startCategoryQuiz(categoryName) {
    // Filter questions
    const categoryQuestions = allQuestions.filter(q => q.category && q.category.trim() === categoryName.trim());
    if (categoryQuestions.length === 0) return;

    // Shuffle questions
    activeQuiz.questions = [...categoryQuestions].sort(() => 0.5 - Math.random());
    activeQuiz.currentIndex = 0;
    activeQuiz.answers = [];
    activeQuiz.seconds = 0;

    // Start Timer
    clearInterval(activeQuiz.timer);
    activeQuiz.timer = setInterval(() => {
        activeQuiz.seconds++;
        updateQuizTimer();
    }, 1000);

    // Switch Quiz views
    document.getElementById('quiz-category-view').style.display = 'none';
    document.getElementById('quiz-category-view').classList.remove('active');
    document.getElementById('quiz-active-view').classList.add('active');
    document.getElementById('quiz-results-view').classList.remove('active');

    // Show first question
    showQuestion();
}

// Quiz Engine functions
function startQuiz(count) {
    if (allQuestions.length === 0) return;

    // Reset Active Quiz State
    activeQuiz.questions = getRandomQuestions(count);
    activeQuiz.currentIndex = 0;
    activeQuiz.answers = [];
    activeQuiz.seconds = 0;

    // Start Timer
    clearInterval(activeQuiz.timer);
    activeQuiz.timer = setInterval(() => {
        activeQuiz.seconds++;
        updateQuizTimer();
    }, 1000);

    // Switch Quiz views
    document.getElementById('quiz-init-view').classList.remove('active');
    document.getElementById('quiz-active-view').classList.add('active');
    document.getElementById('quiz-results-view').classList.remove('active');

    // Show first question
    showQuestion();
}

function startTipsQuiz() {
    if (allTipsQuestions.length === 0) return;

    // Set up quiz state
    activeQuiz.questions = [...allTipsQuestions].sort(() => 0.5 - Math.random());
    activeQuiz.currentIndex = 0;
    activeQuiz.answers = [];
    activeQuiz.seconds = 0;

    // Start Timer
    clearInterval(activeQuiz.timer);
    activeQuiz.timer = setInterval(() => {
        activeQuiz.seconds++;
        updateQuizTimer();
    }, 1000);

    // Switch Quiz views
    document.getElementById('quiz-init-view').classList.remove('active');
    document.getElementById('quiz-active-view').classList.add('active');
    document.getElementById('quiz-results-view').classList.remove('active');

    // Show first question
    showQuestion();
}

function startTipsQuizFromDashboard() {
    switchTab('quiz');
    startTipsQuiz();
}

function updateQuizTimer() {
    const min = String(Math.floor(activeQuiz.seconds / 60)).padStart(2, '0');
    const sec = String(activeQuiz.seconds % 60).padStart(2, '0');
    document.getElementById('quiz-timer').innerHTML = `<i class="fa-solid fa-clock"></i> ${min}:${sec}`;
    saveQuizSession();
}

function exitQuiz() {
    clearInterval(activeQuiz.timer);
    clearQuizSession();
    document.getElementById('quiz-init-view').classList.add('active');
    const categoryView = document.getElementById('quiz-category-view');
    if (categoryView) {
        categoryView.style.display = 'none';
        categoryView.classList.remove('active');
    }
    document.getElementById('quiz-active-view').classList.remove('active');
    document.getElementById('quiz-results-view').classList.remove('active');
    switchTab('dashboard');
}

function getRandomQuestions(count) {
    const isSmartEnabled = localStorage.getItem(`${activeCourse}_smart_quiz`) !== 'false';
    if (!isSmartEnabled) {
        // Standard random shuffle
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }
    
    // Weighted smart distribution logic
    // Build list of questions with calculated weights
    const pool = [];
    allQuestions.forEach(q => {
        const stat = questionStats[q.id] || { correct: 0, wrong: 0 };
        let weight = 3; // Base weight for never attempted
        if (stat.correct > 0 || stat.wrong > 0) {
            // Priority: more wrong answers -> higher weight
            // Correctly answered -> lower weight
            weight = 1 + (2 * stat.wrong);
        }
        pool.push({ question: q, weight: weight });
    });
    
    // Choose count questions using weighted sampling without replacement
    const selected = [];
    const poolCopy = [...pool];
    
    for (let i = 0; i < Math.min(count, allQuestions.length); i++) {
        // Calculate total weight of remaining questions
        const totalWeight = poolCopy.reduce((sum, item) => sum + item.weight, 0);
        if (totalWeight <= 0) break;
        
        let randomVal = Math.random() * totalWeight;
        let cumulativeWeight = 0;
        let chosenIndex = -1;
        
        for (let j = 0; j < poolCopy.length; j++) {
            cumulativeWeight += poolCopy[j].weight;
            if (randomVal <= cumulativeWeight) {
                chosenIndex = j;
                break;
            }
        }
        
        if (chosenIndex !== -1) {
            selected.push(poolCopy[chosenIndex].question);
            poolCopy.splice(chosenIndex, 1);
        }
    }
    return selected;
}

function showQuestion() {
    const question = activeQuiz.questions[activeQuiz.currentIndex];
    
    // Shuffle options dynamically and store on the question object if not already done
    if (!question.shuffledOptions) {
        const prefixLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        const cleanOptionText = (opt) => opt.replace(/^[A-Za-z]\s*[\)\.-]?\s*/, '').trim();
        const originalCorrectLetter = question.answer.trim();
        const correctIndex = question.options.findIndex(opt => opt.trim().startsWith(originalCorrectLetter));
        
        if (correctIndex !== -1) {
            const originalCorrectText = cleanOptionText(question.options[correctIndex]);
            const cleanedOptions = question.options.map(opt => cleanOptionText(opt));
            
            // Random shuffle using modern sort
            const shuffledCleaned = [...cleanedOptions].sort(() => Math.random() - 0.5);
            
            question.shuffledOptions = shuffledCleaned.map((text, idx) => `${prefixLetters[idx]}) ${text}`);
            const newCorrectIndex = shuffledCleaned.indexOf(originalCorrectText);
            question.shuffledAnswer = prefixLetters[newCorrectIndex] || originalCorrectLetter;
        } else {
            question.shuffledOptions = question.options;
            question.shuffledAnswer = question.answer;
        }
    }

    const currentOptions = question.shuffledOptions || question.options;
    const currentAnswer = question.shuffledAnswer || question.answer;

    // Header Info & Progress
    const totalCount = activeQuiz.questions.length;
    const currentCorrectCount = activeQuiz.answers.filter(a => a.isCorrect).length;
    const currentWrongCount = activeQuiz.answers.filter(a => !a.isCorrect).length;
    const indexHTML = `<span style="color: var(--text-main); font-weight: 600;">Soru ${activeQuiz.currentIndex + 1} / ${totalCount}</span> 
                       <span style="color: var(--success-light); font-weight: 700; margin-left: 10px;"><i class="fa-solid fa-circle-check"></i> D: ${currentCorrectCount}</span> 
                       <span style="color: var(--wrong-light); font-weight: 700; margin-left: 10px;"><i class="fa-solid fa-circle-xmark"></i> Y: ${currentWrongCount}</span>`;
    document.getElementById('quiz-question-number').innerHTML = indexHTML;
    
    const progressPercent = ((activeQuiz.currentIndex) / totalCount) * 100;
    document.getElementById('quiz-progress-fill').style.width = `${progressPercent}%`;

    // Question Text
    document.getElementById('quiz-question-text').innerHTML = `${question.id}. ${question.question}`;

    // Options list
    const optionsContainer = document.getElementById('quiz-options-list');
    optionsContainer.innerHTML = '';
    
    // Update star button UI
    const starBtn = document.getElementById('quiz-star-btn');
    if (starBtn) {
        const isStarred = starredQuestionIds.includes(question.id);
        if (isStarred) {
            starBtn.classList.add('active');
            starBtn.innerHTML = '<i class="fa-solid fa-star"></i> Yıldızlı';
        } else {
            starBtn.classList.remove('active');
            starBtn.innerHTML = '<i class="fa-regular fa-star"></i> Yıldızla';
        }
    }

    // Hide feedback card, reset next button and hint
    document.getElementById('quiz-feedback-card').style.display = 'none';
    document.getElementById('quiz-hint-text-box').style.display = 'none';
    
    const hintBtn = document.getElementById('quiz-hint-btn');
    hintBtn.disabled = false;
    hintBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> İpucu';

    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.disabled = true;
    nextBtn.innerText = "Devam Et";

    const existingAnswer = activeQuiz.answers.find(ans => ans.questionId === question.id);

    if (existingAnswer) {
        // Render already answered question state
        hintBtn.disabled = true;
        nextBtn.disabled = false;
        if (activeQuiz.currentIndex === activeQuiz.questions.length - 1) {
            nextBtn.innerHTML = 'Sonuçları Gör <i class="fa-solid fa-square-poll-vertical"></i>';
        }

        currentOptions.forEach((option) => {
            const optKey = option.trim().charAt(0);
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.innerText = option;
            button.disabled = true;

            const correctKey = currentAnswer.trim();
            if (optKey === correctKey) {
                button.classList.add('correct');
            } else if (optKey === existingAnswer.chosenAnswer && !existingAnswer.isCorrect) {
                button.classList.add('wrong');
            }
            optionsContainer.appendChild(button);
        });

        // Show Feedback Card
        const feedbackCard = document.getElementById('quiz-feedback-card');
        const feedbackTitle = document.getElementById('quiz-feedback-title');
        const feedbackText = document.getElementById('quiz-feedback-text');

        feedbackCard.className = 'feedback-card ' + (existingAnswer.isCorrect ? 'correct-feedback' : 'wrong-feedback');
        feedbackTitle.innerHTML = existingAnswer.isCorrect ? 
            '<i class="fa-solid fa-circle-check"></i> Doğru Cevap!' : 
            '<i class="fa-solid fa-circle-xmark"></i> Yanlış Cevap!';
        feedbackText.innerHTML = question.explanation || "Bu soru için ek açıklama bulunmamaktadır.";
        feedbackCard.style.display = 'block';
    } else {
        // Normal unanswered question flow
        currentOptions.forEach((option) => {
            const optKey = option.trim().charAt(0); // gets A, B, C, D
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.innerText = option;
            button.onclick = () => selectOption(button, optKey);
            optionsContainer.appendChild(button);
        });
    }
}

function selectOption(selectedButton, chosenKey) {
    const question = activeQuiz.questions[activeQuiz.currentIndex];
    const correctKey = (question.shuffledAnswer || question.answer).trim();

    // Disable all option buttons and hint button
    const optionsContainer = document.getElementById('quiz-options-list');
    optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
    });
    document.getElementById('quiz-hint-btn').disabled = true;

    const isCorrect = (chosenKey === correctKey);

    // Apply color logic to buttons
    optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
        const key = btn.innerText.trim().charAt(0);
        if (key === correctKey) {
            btn.classList.add('correct');
        } else if (key === chosenKey && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    // Save statistics & local storage with namespace
    if (!questionStats[question.id]) {
        questionStats[question.id] = { correct: 0, wrong: 0 };
    }

    if (isCorrect) {
        questionStats[question.id].correct++;
        userStats.correct++;
    } else {
        questionStats[question.id].wrong++;
        userStats.wrong++;
        // Add to wrong questions list if not already there
        if (!wrongQuestionIds.includes(question.id)) {
            wrongQuestionIds.push(question.id);
            localStorage.setItem(`${activeCourse}_wrong_questions`, JSON.stringify(wrongQuestionIds));
        }
    }
    localStorage.setItem(`${activeCourse}_question_stats`, JSON.stringify(questionStats));
    localStorage.setItem(`${activeCourse}_stats`, JSON.stringify(userStats));

    // Show Feedback Card
    const feedbackCard = document.getElementById('quiz-feedback-card');
    const feedbackTitle = document.getElementById('quiz-feedback-title');
    const feedbackText = document.getElementById('quiz-feedback-text');

    feedbackCard.className = 'feedback-card ' + (isCorrect ? 'correct-feedback' : 'wrong-feedback');
    feedbackTitle.innerHTML = isCorrect ? 
        '<i class="fa-solid fa-circle-check"></i> Doğru Cevap!' : 
        '<i class="fa-solid fa-circle-xmark"></i> Yanlış Cevap!';
    feedbackText.innerHTML = question.explanation || "Bu soru için ek açıklama bulunmamaktadır.";
    feedbackCard.style.display = 'block';

    // Save Quiz answers state
    activeQuiz.answers.push({
        questionId: question.id,
        chosenAnswer: chosenKey,
        isCorrect: isCorrect
    });

    // Enable next button
    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.disabled = false;
    if (activeQuiz.currentIndex === activeQuiz.questions.length - 1) {
        nextBtn.innerHTML = 'Sonuçları Gör <i class="fa-solid fa-square-poll-vertical"></i>';
    }
    saveQuizSession();
}

function nextQuestion() {
    activeQuiz.currentIndex++;
    saveQuizSession();
    if (activeQuiz.currentIndex < activeQuiz.questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    clearInterval(activeQuiz.timer);
    clearQuizSession();
    
    // Switch views
    document.getElementById('quiz-active-view').classList.remove('active');
    document.getElementById('quiz-results-view').classList.add('active');

    // Calculate score
    const total = activeQuiz.questions.length;
    const correctCount = activeQuiz.answers.filter(a => a.isCorrect).length;
    const wrongCount = total - correctCount;
    const ratio = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // Save test result to history
    let testHistory = JSON.parse(localStorage.getItem(`${activeCourse}_test_history`)) || [];
    testHistory.push({
        date: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
        correct: correctCount,
        total: total,
        ratio: ratio
    });
    if (testHistory.length > 5) {
        testHistory.shift();
    }
    localStorage.setItem(`${activeCourse}_test_history`, JSON.stringify(testHistory));

    document.getElementById('res-total').innerText = total;
    document.getElementById('res-correct').innerText = correctCount;
    document.getElementById('res-wrong').innerText = wrongCount;

    // Customize results card details
    ratio = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const emojiContainer = document.getElementById('result-emoji-container');
    const titleContainer = document.getElementById('result-title');
    const textContainer = document.getElementById('result-text');

    if (ratio >= 80) {
        emojiContainer.innerText = '🏆';
        titleContainer.innerText = 'Harika Skor!';
        textContainer.innerText = `Sınava tamamen hazırsın! Başarı oranınız %${ratio}.`;
    } else if (ratio >= 50) {
        emojiContainer.innerText = '👍';
        titleContainer.innerText = 'Güzel Deneme!';
        textContainer.innerText = `Biraz daha pratikle daha iyi olabilirsin. Başarı oranınız %${ratio}.`;
    } else {
        emojiContainer.innerText = '📚';
        titleContainer.innerText = 'Çalılmaya Devam!';
        textContainer.innerText = `Yanlışlarını inceleyerek tekrar dene. Başarı oranınız %${ratio}.`;
    }
    
    updateWrongCountBadge();

    // Trigger confetti for celebration
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });
    }
}

// Wrong Questions Screen Logic
function renderWrongQuestions() {
    const wrongListContainer = document.getElementById('wrong-list');
    const wrongSummary = document.getElementById('wrong-questions-summary');
    wrongListContainer.innerHTML = '';

    const listIds = (activeWrongTab === 'wrong') ? wrongQuestionIds : starredQuestionIds;
    const count = listIds.length;
    
    if (activeWrongTab === 'wrong') {
        wrongSummary.innerText = `Kayıtlı ${count} yanlış sorunuz var.`;
    } else {
        wrongSummary.innerText = `Kayıtlı ${count} yıldızlı sorunuz var.`;
    }

    if (count === 0) {
        if (activeWrongTab === 'wrong') {
            wrongListContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-face-smile-beam empty-icon"></i>
                    <h3>Harika! Hiç yanlış sorunuz yok.</h3>
                    <p>Test çözdükçe yanlış cevaplarınız burada listelenecektir.</p>
                </div>
            `;
        } else {
            wrongListContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fa-regular fa-star empty-icon" style="color: #ECC94B;"></i>
                    <h3>Yıldızlı sorunuz bulunmuyor.</h3>
                    <p>Çalışırken beğendiğiniz soruları yıldızlayarak buraya ekleyebilirsiniz.</p>
                </div>
            `;
        }
        return;
    }

    listIds.forEach(id => {
        const question = allQuestions.find(q => q.id === id);
        if (!question) return;

        const card = document.createElement('div');
        card.className = 'wrong-item-card';
        card.onclick = (e) => {
            if (e.target.closest('.wrong-action-bar')) {
                return;
            }
            showQuestionDetailModal(question.id);
        };
        card.innerHTML = `
            <div class="wrong-item-header">
                <span>ID: ${question.id}</span>
                <span class="${activeWrongTab === 'wrong' ? 'wrong-badge' : 'star-badge-btn active'}" style="border: none; padding: 2px 8px; border-radius: 20px; font-weight: 600; font-size: 0.75rem; pointer-events: none;">
                    ${activeWrongTab === 'wrong' ? 'Hatalı' : '<i class="fa-solid fa-star"></i> Yıldızlı'}
                </span>
            </div>
            <div class="wrong-item-question">
                ${question.question}
            </div>
            <div class="wrong-item-answer">
                Doğru Cevap: <span class="correct">${question.answer}</span>
            </div>
            <div class="wrong-item-exp">
                <strong>Açıklama:</strong> ${question.explanation || "Açıklama bulunmamaktadır."}
            </div>
            <div class="wrong-action-bar">
                <button class="wrong-action-btn delete-btn" onclick="${activeWrongTab === 'wrong' ? 'removeWrongQuestion' : 'toggleStarQuestionId'}(${question.id})">
                    <i class="fa-solid ${activeWrongTab === 'wrong' ? 'fa-trash' : 'fa-star-slash'}"></i> ${activeWrongTab === 'wrong' ? 'Sil' : 'Yıldızı Kaldır'}
                </button>
                <button class="wrong-action-btn solve-btn" onclick="retryWrongQuestion(${question.id})">
                    <i class="fa-solid fa-rotate-right"></i> Tekrar Çöz
                </button>
            </div>
        `;
        wrongListContainer.appendChild(card);
    });
}

function removeWrongQuestion(id) {
    wrongQuestionIds = wrongQuestionIds.filter(qId => qId !== id);
    localStorage.setItem(`${activeCourse}_wrong_questions`, JSON.stringify(wrongQuestionIds));
    renderWrongQuestions();
    updateWrongCountBadge();
}

function retryWrongQuestion(id) {
    const question = allQuestions.find(q => q.id === id);
    if (!question) return;

    // Start single question quiz
    activeQuiz.questions = [question];
    activeQuiz.currentIndex = 0;
    activeQuiz.answers = [];
    activeQuiz.seconds = 0;

    // Switch Quiz views
    document.getElementById('quiz-init-view').classList.remove('active');
    document.getElementById('quiz-active-view').classList.add('active');
    document.getElementById('quiz-results-view').classList.remove('active');

    clearInterval(activeQuiz.timer);
    updateQuizTimer();

    switchTab('quiz');
    showQuestion();
}

// ==========================================
// TERMINOLOGY CARDS QUIZ ENGINE
// ==========================================
function startCardsQuiz(count) {
    if (allCardsQuestions.length === 0) return;

    // Reset Active Cards Quiz State
    activeCardsQuiz.questions = getRandomCardsQuestions(count);
    activeCardsQuiz.currentIndex = 0;
    activeCardsQuiz.answers = [];
    activeCardsQuiz.seconds = 0;

    // Start Timer
    clearInterval(activeCardsQuiz.timer);
    activeCardsQuiz.timer = setInterval(() => {
        activeCardsQuiz.seconds++;
        updateCardsQuizTimer();
    }, 1000);

    // Switch Cards Quiz views
    document.getElementById('cards-init-view').classList.remove('active');
    document.getElementById('cards-active-view').classList.add('active');
    document.getElementById('cards-results-view').classList.remove('active');

    // Show first question
    showCardsQuestion();
}

function updateCardsQuizTimer() {
    const min = String(Math.floor(activeCardsQuiz.seconds / 60)).padStart(2, '0');
    const sec = String(activeCardsQuiz.seconds % 60).padStart(2, '0');
    document.getElementById('cards-timer').innerHTML = `<i class="fa-solid fa-clock"></i> ${min}:${sec}`;
}

function exitCardsQuiz() {
    clearInterval(activeCardsQuiz.timer);
    document.getElementById('cards-init-view').classList.add('active');
    document.getElementById('cards-active-view').classList.remove('active');
    document.getElementById('cards-results-view').classList.remove('active');
    switchTab('dashboard');
}

function getRandomCardsQuestions(count) {
    const shuffled = [...allCardsQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

function showCardsQuestion() {
    const question = activeCardsQuiz.questions[activeCardsQuiz.currentIndex];
    
    // Shuffle options dynamically and store on the question object if not already done
    if (!question.shuffledOptions) {
        const prefixLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        const cleanOptionText = (opt) => opt.replace(/^[A-Za-z]\s*[\)\.-]?\s*/, '').trim();
        const originalCorrectLetter = question.answer.trim();
        const correctIndex = question.options.findIndex(opt => opt.trim().startsWith(originalCorrectLetter));
        
        if (correctIndex !== -1) {
            const originalCorrectText = cleanOptionText(question.options[correctIndex]);
            const cleanedOptions = question.options.map(opt => cleanOptionText(opt));
            
            // Random shuffle using modern sort
            const shuffledCleaned = [...cleanedOptions].sort(() => Math.random() - 0.5);
            
            question.shuffledOptions = shuffledCleaned.map((text, idx) => `${prefixLetters[idx]}) ${text}`);
            const newCorrectIndex = shuffledCleaned.indexOf(originalCorrectText);
            question.shuffledAnswer = prefixLetters[newCorrectIndex] || originalCorrectLetter;
        } else {
            question.shuffledOptions = question.options;
            question.shuffledAnswer = question.answer;
        }
    }

    const currentOptions = question.shuffledOptions || question.options;
    const currentAnswer = question.shuffledAnswer || question.answer;

    // Header Info & Progress
    const totalCount = activeCardsQuiz.questions.length;
    const indexText = `Terim ${activeCardsQuiz.currentIndex + 1} / ${totalCount}`;
    document.getElementById('cards-question-number').innerText = indexText;
    
    const progressPercent = ((activeCardsQuiz.currentIndex) / totalCount) * 100;
    document.getElementById('cards-progress-fill').style.width = `${progressPercent}%`;

    // Question Text
    document.getElementById('cards-question-text').innerText = `${question.question}`;

    // Options list
    const optionsContainer = document.getElementById('cards-options-list');
    optionsContainer.innerHTML = '';
    
    // Hide feedback card, reset next button and hint
    document.getElementById('cards-feedback-card').style.display = 'none';
    document.getElementById('cards-hint-text-box').style.display = 'none';
    
    const hintBtn = document.getElementById('cards-hint-btn');
    hintBtn.disabled = false;
    hintBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> İpucu';

    const nextBtn = document.getElementById('cards-next-btn');
    nextBtn.disabled = true;
    nextBtn.innerText = "Devam Et";

    const existingAnswer = activeCardsQuiz.answers.find(ans => ans.questionId === question.id);

    if (existingAnswer) {
        // Render already answered terminology question state
        hintBtn.disabled = true;
        nextBtn.disabled = false;
        if (activeCardsQuiz.currentIndex === activeCardsQuiz.questions.length - 1) {
            nextBtn.innerHTML = 'Sonuçları Gör <i class="fa-solid fa-square-poll-vertical"></i>';
        }

        currentOptions.forEach((option) => {
            const optKey = option.trim().charAt(0);
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.innerText = option;
            button.disabled = true;

            const correctKey = currentAnswer.trim();
            if (optKey === correctKey) {
                button.classList.add('correct');
            } else if (optKey === existingAnswer.chosenAnswer && !existingAnswer.isCorrect) {
                button.classList.add('wrong');
            }
            optionsContainer.appendChild(button);
        });

        // Show Feedback Card
        const feedbackCard = document.getElementById('cards-feedback-card');
        const feedbackTitle = document.getElementById('cards-feedback-title');
        const feedbackText = document.getElementById('cards-feedback-text');

        feedbackCard.className = 'feedback-card ' + (existingAnswer.isCorrect ? 'correct-feedback' : 'wrong-feedback');
        feedbackTitle.innerHTML = existingAnswer.isCorrect ? 
            '<i class="fa-solid fa-circle-check"></i> Doğru Cevap!' : 
            '<i class="fa-solid fa-circle-xmark"></i> Yanlış Cevap!';
        feedbackText.innerText = question.explanation || "Bu terim için ek açıklama bulunmamaktadır.";
        feedbackCard.style.display = 'block';
    } else {
        // Normal unanswered terminology question flow
        currentOptions.forEach((option) => {
            const optKey = option.trim().charAt(0); // gets A, B, C, D
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.innerText = option;
            button.onclick = () => selectCardsOption(button, optKey);
            optionsContainer.appendChild(button);
        });
    }
}

function selectCardsOption(selectedButton, chosenKey) {
    const question = activeCardsQuiz.questions[activeCardsQuiz.currentIndex];
    const correctKey = (question.shuffledAnswer || question.answer).trim();

    // Disable all option buttons and hint button
    const optionsContainer = document.getElementById('cards-options-list');
    optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
    });
    document.getElementById('cards-hint-btn').disabled = true;

    const isCorrect = (chosenKey === correctKey);

    // Apply color logic to buttons
    optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
        const key = btn.innerText.trim().charAt(0);
        if (key === correctKey) {
            btn.classList.add('correct');
        } else if (key === chosenKey && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    // Show Feedback Card
    const feedbackCard = document.getElementById('cards-feedback-card');
    const feedbackTitle = document.getElementById('cards-feedback-title');
    const feedbackText = document.getElementById('cards-feedback-text');

    feedbackCard.className = 'feedback-card ' + (isCorrect ? 'correct-feedback' : 'wrong-feedback');
    feedbackTitle.innerHTML = isCorrect ? 
        '<i class="fa-solid fa-circle-check"></i> Doğru Cevap!' : 
        '<i class="fa-solid fa-circle-xmark"></i> Yanlış Cevap!';
    feedbackText.innerText = question.explanation || "Bu terim için ek açıklama bulunmamaktadır.";
    feedbackCard.style.display = 'block';

    // Save Quiz answers state
    activeCardsQuiz.answers.push({
        questionId: question.id,
        chosenAnswer: chosenKey,
        isCorrect: isCorrect
    });

    // Enable next button
    const nextBtn = document.getElementById('cards-next-btn');
    nextBtn.disabled = false;
    if (activeCardsQuiz.currentIndex === activeCardsQuiz.questions.length - 1) {
        nextBtn.innerHTML = 'Sonuçları Gör <i class="fa-solid fa-square-poll-vertical"></i>';
    }
}

function nextCardsQuestion() {
    activeCardsQuiz.currentIndex++;
    if (activeCardsQuiz.currentIndex < activeCardsQuiz.questions.length) {
        showCardsQuestion();
    } else {
        showCardsResults();
    }
}

function showCardsResults() {
    clearInterval(activeCardsQuiz.timer);
    
    // Switch views
    document.getElementById('cards-active-view').classList.remove('active');
    document.getElementById('cards-results-view').classList.add('active');

    // Calculate score
    const total = activeCardsQuiz.questions.length;
    const correctCount = activeCardsQuiz.answers.filter(a => a.isCorrect).length;
    const wrongCount = total - correctCount;

    document.getElementById('cards-res-total').innerText = total;
    document.getElementById('cards-res-correct').innerText = correctCount;
    document.getElementById('cards-res-wrong').innerText = wrongCount;

    // Customize results card details
    const ratio = Math.round((correctCount / total) * 100);
    const emojiContainer = document.getElementById('cards-result-emoji-container');
    const titleContainer = document.getElementById('cards-result-title');
    const textContainer = document.getElementById('cards-result-text');

    if (ratio >= 80) {
        emojiContainer.innerText = '🏆';
        titleContainer.innerText = 'Harika Terim Bilgisi!';
        textContainer.innerText = `Terimlere tamamen hakimsin! Başarı oranınız %${ratio}.`;
    } else if (ratio >= 50) {
        emojiContainer.innerText = '👍';
        titleContainer.innerText = 'Güzel Deneme!';
        textContainer.innerText = `Terimleri biraz daha gözden geçirmelisin. Başarı oranınız %${ratio}.`;
    } else {
        emojiContainer.innerText = '📚';
        titleContainer.innerText = 'Tekrar Zamanı!';
        textContainer.innerText = `Ders notlarını ve kartları çalışarak tekrar dene. Başarı oranınız %${ratio}.`;
    }
    
    // Trigger confetti for celebration

    // Trigger confetti for celebration
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });
    }
}

// Hint System Actions
function showQuizHint() {
    const question = activeQuiz.questions[activeQuiz.currentIndex];
    if (!question) return;

    // Disable hint button
    const hintBtn = document.getElementById('quiz-hint-btn');
    hintBtn.disabled = true;
    hintBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> İpucu Alındı';

    // Show Hint Text Container
    const hintTextBox = document.getElementById('quiz-hint-text-box');
    const hintText = document.getElementById('quiz-hint-text');

    let hintStr = question.explanation || "Açıklama veya formüllere Notlar sekmesinden göz atabilirsiniz!";
    
    // Mask correct answer word inside explanation to prevent spoilers
    const correctKey = (question.shuffledAnswer || question.answer).trim();
    const currentOptions = question.shuffledOptions || question.options;
    const correctOpt = currentOptions.find(opt => opt.trim().startsWith(correctKey));
    if (correctOpt) {
        let cleanOptText = correctOpt.replace(/^[A-D]\s*[\)\.-]?\s*/i, '').trim();
        if (cleanOptText.length > 2) {
            let escapedText = cleanOptText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            let regex = new RegExp(escapedText, 'gi');
            hintStr = hintStr.replace(regex, '[...]');
        }
    }

    hintText.innerText = hintStr;
    hintTextBox.style.display = 'block';

    // 50/50: Eliminate one incorrect option
    const optionsContainer = document.getElementById('quiz-options-list');
    const optionBtns = Array.from(optionsContainer.querySelectorAll('.option-btn'));
    
    const wrongBtns = optionBtns.filter(btn => {
        const key = btn.innerText.trim().charAt(0);
        return key !== correctKey && !btn.classList.contains('eliminated') && !btn.disabled;
    });

    if (wrongBtns.length > 0) {
        const randomWrongBtn = wrongBtns[Math.floor(Math.random() * wrongBtns.length)];
        randomWrongBtn.classList.add('eliminated');
        randomWrongBtn.disabled = true;
    }
}

function showCardsHint() {
    const question = activeCardsQuiz.questions[activeCardsQuiz.currentIndex];
    if (!question) return;

    // Disable hint button
    const hintBtn = document.getElementById('cards-hint-btn');
    hintBtn.disabled = true;
    hintBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> İpucu Alındı';

    // Show Hint Text Container
    const hintTextBox = document.getElementById('cards-hint-text-box');
    const hintText = document.getElementById('cards-hint-text');

    let hintStr = question.explanation || "Açıklama veya formüllere Notlar sekmesinden göz atabilirsiniz!";
    
    // Mask correct answer word inside explanation to prevent spoilers
    const correctKey = (question.shuffledAnswer || question.answer).trim();
    const currentOptions = question.shuffledOptions || question.options;
    const correctOpt = currentOptions.find(opt => opt.trim().startsWith(correctKey));
    if (correctOpt) {
        let cleanOptText = correctOpt.replace(/^[A-D]\s*[\)\.-]?\s*/i, '').trim();
        if (cleanOptText.length > 2) {
            let escapedText = cleanOptText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            let regex = new RegExp(escapedText, 'gi');
            hintStr = hintStr.replace(regex, '[...]');
        }
    }

    hintText.innerText = hintStr;
    hintTextBox.style.display = 'block';

    // 50/50: Eliminate one incorrect option
    const optionsContainer = document.getElementById('cards-options-list');
    const optionBtns = Array.from(optionsContainer.querySelectorAll('.option-btn'));
    
    const wrongBtns = optionBtns.filter(btn => {
        const key = btn.innerText.trim().charAt(0);
        return key !== correctKey && !btn.classList.contains('eliminated') && !btn.disabled;
    });

    if (wrongBtns.length > 0) {
        const randomWrongBtn = wrongBtns[Math.floor(Math.random() * wrongBtns.length)];
        randomWrongBtn.classList.add('eliminated');
        randomWrongBtn.disabled = true;
    }
}

// Edit Answer Modal Functions
function openEditAnswer() {
    const question = activeQuiz.questions[activeQuiz.currentIndex];
    if (!question) return;

    document.getElementById('edit-question-id').innerText = question.id;
    
    const radios = document.getElementsByName('new-correct-ans');
    radios.forEach(radio => {
        radio.checked = (radio.value === question.answer.trim());
    });

    document.getElementById('edit-answer-modal').style.display = 'flex';
}

function closeEditAnswer() {
    document.getElementById('edit-answer-modal').style.display = 'none';
}

function saveAnswerOverride() {
    const question = activeQuiz.questions[activeQuiz.currentIndex];
    if (!question) return;

    const radios = document.getElementsByName('new-correct-ans');
    let selectedValue = null;
    radios.forEach(radio => {
        if (radio.checked) {
            selectedValue = radio.value;
        }
    });

    if (!selectedValue) {
        alert("Lütfen bir şık seçin.");
        return;
    }

    // Save in active quiz question
    question.answer = selectedValue;
    delete question.shuffledOptions;
    delete question.shuffledAnswer;
    
    // Save in master list allQuestions
    const masterQuestion = allQuestions.find(q => q.id === question.id);
    if (masterQuestion) {
        masterQuestion.answer = selectedValue;
        delete masterQuestion.shuffledOptions;
        delete masterQuestion.shuffledAnswer;
    }

    // Save to localStorage
    answerOverrides[question.id] = selectedValue;
    localStorage.setItem(`${activeCourse}_answer_overrides`, JSON.stringify(answerOverrides));

    // Close modal
    closeEditAnswer();

    // Re-show question to apply new answer key rules
    showQuestion();
}

// ==========================================
// THEME, SETTINGS & BOOKMARKS ENGINE
// ==========================================

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('app_theme', isLight ? 'light' : 'dark');
    
    const themeIcon = document.querySelector('#theme-toggle-btn i');
    if (themeIcon) {
        themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
}

function openSettings() {
    if (!activeCourse) return;
    const modal = document.getElementById('settings-modal');
    if (modal) modal.style.display = 'flex';
}

function closeSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.style.display = 'none';
}

function toggleSmartQuizSetting() {
    if (!activeCourse) return;
    const checkbox = document.getElementById('setting-smart-quiz');
    if (checkbox) {
        localStorage.setItem(`${activeCourse}_smart_quiz`, checkbox.checked ? 'true' : 'false');
        updateSmartQuizStatusUI();
    }
}

function updateSmartQuizStatusUI() {
    const checkbox = document.getElementById('setting-smart-quiz');
    const statusText = document.getElementById('smart-quiz-status-text');
    if (checkbox && statusText) {
        if (checkbox.checked) {
            statusText.innerText = "AÇIK";
            statusText.style.color = "#48BB78"; // beautiful bright success green
        } else {
            statusText.innerText = "KAPALI";
            statusText.style.color = "var(--text-secondary)";
        }
    }
}

function toggleStarActiveQuestion() {
    const question = activeQuiz.questions[activeQuiz.currentIndex];
    if (!question) return;
    
    const index = starredQuestionIds.indexOf(question.id);
    if (index === -1) {
        starredQuestionIds.push(question.id);
    } else {
        starredQuestionIds.splice(index, 1);
    }
    
    localStorage.setItem(`${activeCourse}_starred_questions`, JSON.stringify(starredQuestionIds));
    
    // Update star button UI dynamically
    const starBtn = document.getElementById('quiz-star-btn');
    if (starBtn) {
        const isStarred = starredQuestionIds.includes(question.id);
        if (isStarred) {
            starBtn.classList.add('active');
            starBtn.innerHTML = '<i class="fa-solid fa-star"></i> Yıldızlı';
        } else {
            starBtn.classList.remove('active');
            starBtn.innerHTML = '<i class="fa-regular fa-star"></i> Yıldızla';
        }
    }
}

function toggleStarQuestionId(id) {
    const index = starredQuestionIds.indexOf(id);
    if (index !== -1) {
        starredQuestionIds.splice(index, 1);
        localStorage.setItem(`${activeCourse}_starred_questions`, JSON.stringify(starredQuestionIds));
    }
    renderWrongQuestions();
}

function switchWrongTab(tabType) {
    activeWrongTab = tabType;
    
    // Toggle active classes on sub-tab buttons
    const wrongBtn = document.getElementById('subtab-wrong');
    const starredBtn = document.getElementById('subtab-starred');
    
    if (tabType === 'wrong') {
        if (wrongBtn) wrongBtn.classList.add('active');
        if (starredBtn) starredBtn.classList.remove('active');
    } else {
        if (wrongBtn) wrongBtn.classList.remove('active');
        if (starredBtn) starredBtn.classList.add('active');
    }
    
    renderWrongQuestions();
}

// ==========================================
// RESUME & TIMER PAUSE HELPER FUNCTIONS
// ==========================================

function updateResumeCard() {
    const resumeCard = document.getElementById('quiz-resume-card');
    if (!resumeCard) return;

    // A quiz is in progress if there are questions and we haven't answered them all
    const inProgress = activeQuiz.questions.length > 0 && activeQuiz.answers.length < activeQuiz.questions.length;
    if (inProgress) {
        resumeCard.style.display = 'flex';
        const current = activeQuiz.currentIndex + 1;
        const total = activeQuiz.questions.length;
        const min = String(Math.floor(activeQuiz.seconds / 60)).padStart(2, '0');
        const sec = String(activeQuiz.seconds % 60).padStart(2, '0');
        document.getElementById('quiz-resume-status').innerText = `Soru ${current} / ${total} - Geçen Süre: ${min}:${sec}`;
    } else {
        resumeCard.style.display = 'none';
    }
}

function updateCardsResumeCard() {
    const resumeCard = document.getElementById('cards-resume-card');
    if (!resumeCard) return;

    // A terminology quiz is in progress if there are questions and we haven't answered them all
    const inProgress = activeCardsQuiz.questions.length > 0 && activeCardsQuiz.answers.length < activeCardsQuiz.questions.length;
    if (inProgress) {
        resumeCard.style.display = 'flex';
        const current = activeCardsQuiz.currentIndex + 1;
        const total = activeCardsQuiz.questions.length;
        const min = String(Math.floor(activeCardsQuiz.seconds / 60)).padStart(2, '0');
        const sec = String(activeCardsQuiz.seconds % 60).padStart(2, '0');
        document.getElementById('cards-resume-status').innerText = `Terim ${current} / ${total} - Geçen Süre: ${min}:${sec}`;
    } else {
        resumeCard.style.display = 'none';
    }
}

function resumeQuiz() {
    if (activeQuiz.questions.length === 0) return;
    
    // Restart timer if it was paused
    if (!activeQuiz.timer) {
        activeQuiz.timer = setInterval(() => {
            activeQuiz.seconds++;
            updateQuizTimer();
        }, 1000);
    }
    
    // Switch views to the active quiz layout
    document.getElementById('quiz-init-view').classList.remove('active');
    document.getElementById('quiz-active-view').classList.add('active');
    document.getElementById('quiz-results-view').classList.remove('active');
    
    // Show the current active question
    showQuestion();
}

function resumeCardsQuiz() {
    if (activeCardsQuiz.questions.length === 0) return;
    
    // Restart timer if it was paused
    if (!activeCardsQuiz.timer) {
        activeCardsQuiz.timer = setInterval(() => {
            activeCardsQuiz.seconds++;
            updateCardsQuizTimer();
        }, 1000);
    }
    
    // Switch views to the active terminology card layout
    document.getElementById('cards-init-view').classList.remove('active');
    document.getElementById('cards-active-view').classList.add('active');
    document.getElementById('cards-results-view').classList.remove('active');
    
    // Show the current active terminology question
    showCardsQuestion();
}

function resetCourseData() {
    if (!activeCourse) return;
    
    // Attempt to show custom premium confirmation modal
    const modal = document.getElementById('confirm-modal');
    if (!modal) {
        // Fallback to standard confirm if modal element is not found
        if (confirm("Bu derse ait tüm ilerlemeyi, doğru/yanlış istatistiklerini, hatalı ve yıldızlı soruları tamamen sıfırlamak istediğinize emin misiniz?")) {
            executeReset();
        }
        return;
    }
    
    modal.style.display = 'flex';
    
    // Configure buttons in the modal
    const cancelBtn = document.getElementById('confirm-modal-cancel-btn');
    const okBtn = document.getElementById('confirm-modal-ok-btn');
    
    cancelBtn.onclick = () => {
        modal.style.display = 'none';
    };
    
    okBtn.onclick = () => {
        modal.style.display = 'none';
        executeReset();
    };
}

function executeReset() {
    // Clear LocalStorage values
    localStorage.removeItem(`${activeCourse}_stats`);
    localStorage.removeItem(`${activeCourse}_wrong_questions`);
    localStorage.removeItem(`${activeCourse}_starred_questions`);
    localStorage.removeItem(`${activeCourse}_question_stats`);
    localStorage.removeItem(`${activeCourse}_answer_overrides`);
    localStorage.removeItem(`${activeCourse}_test_history`);
    clearQuizSession();
    
    // Reset local memory state
    userStats = { correct: 0, wrong: 0 };
    wrongQuestionIds = [];
    starredQuestionIds = [];
    questionStats = {};
    answerOverrides = {};
    activeQuiz = {
        questions: [],
        currentIndex: 0,
        answers: [],
        timer: null,
        seconds: 0
    };

    // Update UI
    updateDashboardStats();
    updateWrongCountBadge();
    
    // Close settings modal
    closeSettings();
    
    alert("Bu dersin tüm verileri başarıyla sıfırlandı!");
}

function startWrongQuestionsQuiz() {
    if (wrongQuestionIds.length === 0) return;
    
    // Get all master questions corresponding to wrong IDs
    const questionsPool = allQuestions.filter(q => wrongQuestionIds.includes(q.id));
    if (questionsPool.length === 0) return;
    
    // Shuffle the wrong questions
    activeQuiz.questions = [...questionsPool].sort(() => 0.5 - Math.random());
    activeQuiz.currentIndex = 0;
    activeQuiz.answers = [];
    activeQuiz.seconds = 0;
    
    // Start Timer
    clearInterval(activeQuiz.timer);
    activeQuiz.timer = setInterval(() => {
        activeQuiz.seconds++;
        updateQuizTimer();
    }, 1000);
    
    // Switch Quiz views
    document.getElementById('quiz-init-view').classList.remove('active');
    document.getElementById('quiz-active-view').classList.add('active');
    document.getElementById('quiz-results-view').classList.remove('active');
    
    // Show first question
    showQuestion();
}

function filterStudyNotes() {
    const query = document.getElementById('notes-search-input').value.toLowerCase().trim();
    const noteCards = document.querySelectorAll('.note-card');
    
    noteCards.forEach((card, index) => {
        const note = studyNotes[index];
        if (!note) return;
        
        const titleMatch = note.title.toLowerCase().includes(query);
        const contentMatch = note.content.toLowerCase().includes(query);
        
        if (titleMatch || contentMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Session Persistence Helpers
function saveQuizSession() {
    if (!activeCourse) return;
    const sessionData = {
        questions: activeQuiz.questions,
        currentIndex: activeQuiz.currentIndex,
        answers: activeQuiz.answers,
        seconds: activeQuiz.seconds
    };
    localStorage.setItem(`${activeCourse}_active_quiz`, JSON.stringify(sessionData));
}

function clearQuizSession() {
    if (!activeCourse) return;
    localStorage.removeItem(`${activeCourse}_active_quiz`);
}

// Question Detail Popup
function showQuestionDetailModal(questionId) {
    const question = allQuestions.find(q => q.id === questionId);
    if (!question) return;

    document.getElementById('detail-question-text').innerHTML = `${question.id}. ${question.question}`;
    
    const optionsContainer = document.getElementById('detail-options-list');
    optionsContainer.innerHTML = '';
    
    const correctLetter = question.answer.trim();
    
    question.options.forEach(option => {
        const div = document.createElement('div');
        div.className = 'option-btn';
        div.style.pointerEvents = 'none';
        div.innerText = option;
        
        const optKey = option.trim().charAt(0);
        if (optKey === correctLetter) {
            div.classList.add('correct');
        }
        optionsContainer.appendChild(div);
    });
    
    document.getElementById('detail-correct-answer').innerText = question.answer;
    document.getElementById('detail-explanation-text').innerHTML = question.explanation || "Açıklama bulunmamaktadır.";
    
    document.getElementById('question-detail-modal').style.display = 'flex';
}

function closeQuestionDetail() {
    document.getElementById('question-detail-modal').style.display = 'none';
}

// All Questions Screen Core Logic
function renderAllQuestionsTable() {
    const listContainer = document.getElementById('all-questions-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    const query = document.getElementById('all-questions-search-input').value.toLowerCase().trim();
    const categoryFilter = document.getElementById('all-questions-category-filter').value;

    // Map questions to enrich with stats and star state
    let enriched = allQuestions.map(q => {
        const stats = questionStats[q.id] || { correct: 0, wrong: 0 };
        const correct = stats.correct || 0;
        const wrong = stats.wrong || 0;
        const total = correct + wrong;
        const isStarred = starredQuestionIds.includes(q.id) ? 1 : 0;
        return {
            question: q,
            id: q.id,
            total: total,
            correct: correct,
            wrong: wrong,
            starred: isStarred
        };
    });

    // Filter by search query
    if (query) {
        enriched = enriched.filter(item => {
            const idMatch = String(item.id).includes(query);
            const questionMatch = item.question.question.toLowerCase().includes(query);
            return idMatch || questionMatch;
        });
    }

    // Filter by category dropdown
    if (categoryFilter) {
        enriched = enriched.filter(item => {
            return item.question.category && item.question.category.trim() === categoryFilter.trim();
        });
    }

    // Sort
    const col = allQuestionsSort.col;
    const desc = allQuestionsSort.desc;
    enriched.sort((a, b) => {
        let valA = a[col];
        let valB = b[col];
        if (valA < valB) return desc ? 1 : -1;
        if (valA > valB) return desc ? -1 : 1;
        return 0;
    });

    // Render
    enriched.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'question-row';
        row.onclick = (e) => {
            if (e.target.closest('.star-toggle-btn')) return; // ignore star click
            showQuestionDetailModal(item.id);
        };
        
        const isStarred = item.starred === 1;
        row.innerHTML = `
            <td>
                <button class="star-toggle-btn ${isStarred ? 'starred' : ''}" onclick="toggleStarFromTable(${item.id}, event)">
                    <i class="${isStarred ? 'fa-solid' : 'fa-regular'} fa-star"></i>
                </button>
            </td>
            <td class="col-id">${item.id}</td>
            <td class="col-total">${item.total}</td>
            <td class="col-correct">${item.correct}</td>
            <td class="col-wrong">${item.wrong}</td>
        `;
        listContainer.appendChild(row);
    });
}

function sortAllQuestions(column) {
    if (allQuestionsSort.col === column) {
        allQuestionsSort.desc = !allQuestionsSort.desc;
    } else {
        allQuestionsSort.col = column;
        allQuestionsSort.desc = false;
    }

    // Update headers icons UI
    const cols = ['id', 'total', 'correct', 'wrong', 'starred'];
    cols.forEach(c => {
        const iconEl = document.getElementById(`sort-icon-${c}`);
        // For star column, we might not have a separate sort icon span, but let's handle if exists
        if (iconEl) {
            if (c === column) {
                iconEl.className = 'sort-icon active';
                iconEl.innerHTML = allQuestionsSort.desc ? '<i class="fa-solid fa-sort-down"></i>' : '<i class="fa-solid fa-sort-up"></i>';
            } else {
                iconEl.className = 'sort-icon';
                iconEl.innerHTML = '<i class="fa-solid fa-sort"></i>';
            }
        }
    });

    renderAllQuestionsTable();
}

function filterAllQuestions() {
    renderAllQuestionsTable();
}

function toggleStarFromTable(questionId, event) {
    if (event) event.stopPropagation(); // prevent opening details modal
    
    const index = starredQuestionIds.indexOf(questionId);
    if (index === -1) {
        starredQuestionIds.push(questionId);
    } else {
        starredQuestionIds.splice(index, 1);
    }
    
    localStorage.setItem(`${activeCourse}_starred_questions`, JSON.stringify(starredQuestionIds));
    
    // Refresh table row view
    renderAllQuestionsTable();
    updateWrongCountBadge();
}

// Chart.js success trend renderer
function renderPerformanceChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;

    const history = JSON.parse(localStorage.getItem(`${activeCourse}_test_history`)) || [];
    const parent = canvas.parentElement;

    // Remove existing placeholder if any
    const existingPlaceholder = document.getElementById('chart-placeholder');
    if (existingPlaceholder) existingPlaceholder.remove();

    if (history.length === 0) {
        canvas.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.id = 'chart-placeholder';
        placeholder.style.textAlign = 'center';
        placeholder.style.color = 'var(--text-secondary)';
        placeholder.style.padding = '50px 0';
        placeholder.style.fontSize = '0.85rem';
        placeholder.innerHTML = '<i class="fa-solid fa-chart-line" style="font-size: 1.5rem; margin-bottom: 8px; opacity: 0.5; display: block;"></i>Çözdüğünüz testlerin başarı grafiği burada görünecektir.';
        parent.appendChild(placeholder);
        return;
    }

    canvas.style.display = 'block';

    // Destroy existing chart instance
    if (window.myPerformanceChart) {
        window.myPerformanceChart.destroy();
    }

    const labels = history.map(h => h.date);
    const dataPoints = history.map(h => h.ratio);

    // Dynamic color matches course selection
    let themeColor = '#4299E1';
    if (activeCourse === 'gai') themeColor = '#A855F7';
    if (activeCourse === 'ds') themeColor = '#10B981';
    if (activeCourse === 'isg') themeColor = '#F97316';

    window.myPerformanceChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Başarı (%)',
                data: dataPoints,
                borderColor: themeColor,
                backgroundColor: 'rgba(255, 255, 255, 0.01)',
                tension: 0.35,
                fill: false,
                borderWidth: 2,
                pointBackgroundColor: themeColor,
                pointBorderColor: '#0B0E14',
                pointBorderWidth: 1.5,
                pointRadius: 4.5,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            const h = history[index];
                            return `Başarı: %${context.parsed.y} (${h.correct}/${h.total})`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: { color: 'var(--text-secondary)', font: { size: 9 } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    ticks: { color: 'var(--text-secondary)', font: { size: 8 } },
                    grid: { display: false }
                }
            }
        }
    });
}

// Starred Questions Quiz Engine
function startStarredQuestionsQuiz() {
    if (starredQuestionIds.length === 0) return;

    // Filter questions
    const starredQuestions = allQuestions.filter(q => starredQuestionIds.includes(q.id));
    if (starredQuestions.length === 0) return;

    // Shuffle questions
    activeQuiz.questions = [...starredQuestions].sort(() => 0.5 - Math.random());
    activeQuiz.currentIndex = 0;
    activeQuiz.answers = [];
    activeQuiz.seconds = 0;

    // Start Timer
    clearInterval(activeQuiz.timer);
    activeQuiz.timer = setInterval(() => {
        activeQuiz.seconds++;
        updateQuizTimer();
    }, 1000);

    // Switch Quiz views
    document.getElementById('quiz-init-view').classList.remove('active');
    document.getElementById('quiz-active-view').classList.add('active');
    document.getElementById('quiz-results-view').classList.remove('active');

    // Show first question
    showQuestion();
}

// Progress Backup & Restore (JSON Export/Import)
function exportUserData() {
    if (!activeCourse) return;
    
    // Gather all local storage keys for this specific course
    const prefix = `${activeCourse}_`;
    const dataToExport = {};
    
    // Add active theme
    dataToExport['app_theme'] = localStorage.getItem('app_theme') || 'dark';
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            dataToExport[key] = localStorage.getItem(key);
        }
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchor = document.createElement('a');
    
    // Format date for filename
    const dateStr = new Date().toLocaleDateString('tr-TR').replace(/\./g, '-');
    let courseName = "ders";
    if (activeCourse === 'ml') courseName = "makine-ogrenmesi";
    if (activeCourse === 'gai') courseName = "uretken-yapay-zeka";
    if (activeCourse === 'ds') courseName = "dijital-surdurulebilirlik";
    if (activeCourse === 'isg') courseName = "is-sagligi-guvenligi";
    
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sinav-hazirlik_${courseName}_yedek_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function triggerImportFile() {
    const fileInput = document.getElementById('import-file-input');
    if (fileInput) fileInput.click();
}

function importUserData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate data structure
            let importedCount = 0;
            Object.keys(importedData).forEach(key => {
                // Allow active theme or keys matching the course namespace
                if (key === 'app_theme' || (activeCourse && key.startsWith(`${activeCourse}_`))) {
                    localStorage.setItem(key, importedData[key]);
                    importedCount++;
                }
            });
            
            if (importedCount > 0) {
                alert("Başarılı! İlerleme verileriniz geri yüklendi. Sayfa güncellenecektir.");
                // Reload course selection values
                selectCourse(activeCourse);
                closeSettings();
            } else {
                alert("Hata: Geçersiz yedek dosyası veya bu derse ait veri bulunamadı.");
            }
        } catch (err) {
            console.error(err);
            alert("Hata: Dosya okunamadı. Lütfen geçerli bir JSON yedek dosyası seçtiğinizden emin olun.");
        }
    };
    reader.readAsText(file);
    // Reset file input value
    event.target.value = '';
}



