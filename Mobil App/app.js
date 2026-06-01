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
let activeCourse = null; // 'ml' or 'gai'
let allQuestions = [];
let allCardsQuestions = [];
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
let userStats = { correct: 0, wrong: 0 };
let studyNotes = [];

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    backToLanding();
});

// Subject / Course Selection Screen Router
function selectCourse(courseId) {
    activeCourse = courseId;
    
    // Load localstorage data based on selected course
    wrongQuestionIds = JSON.parse(localStorage.getItem(`${activeCourse}_wrong_questions`)) || [];
    userStats = JSON.parse(localStorage.getItem(`${activeCourse}_stats`)) || { correct: 0, wrong: 0 };
    
    // Apply subject theme classes and contents
    if (activeCourse === 'ml') {
        document.body.classList.remove('theme-gai');
        document.getElementById('app-logo-title').innerText = 'Makine Öğrenmesi';
        document.getElementById('app-logo-icon').className = 'fa-solid fa-brain-circuit brain-icon';
        document.getElementById('dashboard-welcome-title').innerText = 'Selam Geleceğin ML Uzmanı! 👋';
        studyNotes = studyNotesML;
        
        loadQuestions('ml/questions.json');
        loadCards('ml/cards.json');
    } else if (activeCourse === 'gai') {
        document.body.classList.add('theme-gai');
        document.getElementById('app-logo-title').innerText = 'Üretken Yapay Zeka';
        document.getElementById('app-logo-icon').className = 'fa-solid fa-wand-magic-sparkles brain-icon';
        document.getElementById('dashboard-welcome-title').innerText = 'Selam Geleceğin Yapay Zeka Uzmanı! 👋';
        studyNotes = studyNotesGAI;
        
        loadQuestions('gai/questions.json');
        loadCards('gai/cards.json');
    }
    
    // Reveal Navigation and header features
    document.querySelector('.app-nav').classList.remove('hidden');
    document.getElementById('header-progress-text').style.display = 'block';
    document.getElementById('change-course-btn').style.display = 'flex';
    
    switchTab('dashboard');
}

// Return to selection screen landing
function backToLanding() {
    // Reset state variables
    activeCourse = null;
    allQuestions = [];
    allCardsQuestions = [];
    wrongQuestionIds = [];
    userStats = { correct: 0, wrong: 0 };
    studyNotes = [];
    
    // Reset Header and Theme
    document.body.classList.remove('theme-gai');
    document.getElementById('app-logo-title').innerText = 'Mobil App';
    document.getElementById('app-logo-icon').className = 'fa-solid fa-brain-circuit brain-icon';
    document.getElementById('header-progress-text').style.display = 'none';
    document.getElementById('change-course-btn').style.display = 'none';
    
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

            renderStudyNotes();
            updateDashboardStats();
            updateWrongCountBadge();
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

// Navigation / Screen Switching
function switchTab(tabId) {
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
    } else if (tabId === 'wrong') {
        renderWrongQuestions();
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
    
    updateWrongCountBadge();
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

// Quiz Engine functions
function startQuiz(count) {
    if (allQuestions.length === 0) return;

    activeQuiz.isInfinite = (count === Infinity);

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

function updateQuizTimer() {
    const min = String(Math.floor(activeQuiz.seconds / 60)).padStart(2, '0');
    const sec = String(activeQuiz.seconds % 60).padStart(2, '0');
    document.getElementById('quiz-timer').innerHTML = `<i class="fa-solid fa-clock"></i> ${min}:${sec}`;
}

function exitQuiz() {
    clearInterval(activeQuiz.timer);
    document.getElementById('quiz-init-view').classList.add('active');
    document.getElementById('quiz-active-view').classList.remove('active');
    document.getElementById('quiz-results-view').classList.remove('active');
    switchTab('dashboard');
}

function getRandomQuestions(count) {
    // Shuffle copy of questions array
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    if (count === Infinity) {
        return shuffled;
    }
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

function showQuestion() {
    const question = activeQuiz.questions[activeQuiz.currentIndex];
    
    // Header Info & Progress
    const totalCount = activeQuiz.questions.length;
    let indexText = "";
    if (activeQuiz.isInfinite) {
        indexText = `Soru ${activeQuiz.currentIndex + 1} (Sonsuz Döngü)`;
        document.getElementById('quiz-progress-fill').style.width = `100%`;
    } else {
        indexText = `Soru ${activeQuiz.currentIndex + 1} / ${totalCount}`;
        const progressPercent = ((activeQuiz.currentIndex) / totalCount) * 100;
        document.getElementById('quiz-progress-fill').style.width = `${progressPercent}%`;
    }
    document.getElementById('quiz-question-number').innerText = indexText;
    document.getElementById('header-progress-text').innerText = indexText;

    // Question Text
    document.getElementById('quiz-question-text').innerText = `${question.id}. ${question.question}`;

    // Options list
    const optionsContainer = document.getElementById('quiz-options-list');
    optionsContainer.innerHTML = '';
    
    // Hide feedback card, reset next button and hint
    document.getElementById('quiz-feedback-card').style.display = 'none';
    document.getElementById('quiz-hint-text-box').style.display = 'none';
    
    const hintBtn = document.getElementById('quiz-hint-btn');
    hintBtn.disabled = false;
    hintBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> İpucu';

    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.disabled = true;
    nextBtn.innerText = "Devam Et";

    // Shuffle options dynamically for this presentation
    const correctPrefix = question.answer.trim();
    const correctOptionObj = question.options.find(opt => opt.trim().startsWith(correctPrefix));
    const correctOptionText = correctOptionObj ? correctOptionObj.replace(/^[A-D]\s*[\)\.-]?\s*/i, '').trim() : '';

    const cleanedOptions = question.options.map(opt => opt.replace(/^[A-D]\s*[\)\.-]?\s*/i, '').trim());
    const shuffledCleaned = [...cleanedOptions].sort(() => Math.random() - 0.5);
    
    const newCorrectIdx = shuffledCleaned.indexOf(correctOptionText);
    const newCorrectLetter = String.fromCharCode(65 + newCorrectIdx);
    
    question._shuffledOptions = shuffledCleaned.map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`);
    question._shuffledAnswer = newCorrectLetter;

    question._shuffledOptions.forEach((option) => {
        const optKey = option.trim().charAt(0); // gets A, B, C, D
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerText = option;
        button.onclick = () => selectOption(button, optKey);
        optionsContainer.appendChild(button);
    });
}

function selectOption(selectedButton, chosenKey) {
    const question = activeQuiz.questions[activeQuiz.currentIndex];
    const correctKey = (question._shuffledAnswer || question.answer).trim();

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
    if (isCorrect) {
        userStats.correct++;
    } else {
        userStats.wrong++;
        // Add to wrong questions list if not already there
        if (!wrongQuestionIds.includes(question.id)) {
            wrongQuestionIds.push(question.id);
            localStorage.setItem(`${activeCourse}_wrong_questions`, JSON.stringify(wrongQuestionIds));
        }
    }
    localStorage.setItem(`${activeCourse}_stats`, JSON.stringify(userStats));

    // Show Feedback Card
    const feedbackCard = document.getElementById('quiz-feedback-card');
    const feedbackTitle = document.getElementById('quiz-feedback-title');
    const feedbackText = document.getElementById('quiz-feedback-text');

    feedbackCard.className = 'feedback-card ' + (isCorrect ? 'correct-feedback' : 'wrong-feedback');
    feedbackTitle.innerHTML = isCorrect ? 
        '<i class="fa-solid fa-circle-check"></i> Doğru Cevap!' : 
        '<i class="fa-solid fa-circle-xmark"></i> Yanlış Cevap!';
    feedbackText.innerText = question.explanation || "Bu soru için ek açıklama bulunmamaktadır.";
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
    if (!activeQuiz.isInfinite && activeQuiz.currentIndex === activeQuiz.questions.length - 1) {
        nextBtn.innerHTML = 'Sonuçları Gör <i class="fa-solid fa-square-poll-vertical"></i>';
    } else {
        nextBtn.innerHTML = 'Devam Et <i class="fa-solid fa-arrow-right"></i>';
    }
}

function nextQuestion() {
    activeQuiz.currentIndex++;
    if (activeQuiz.currentIndex < activeQuiz.questions.length) {
        showQuestion();
    } else {
        if (activeQuiz.isInfinite) {
            const newBatch = getRandomQuestions(Infinity);
            activeQuiz.questions = activeQuiz.questions.concat(newBatch);
            showQuestion();
        } else {
            showResults();
        }
    }
}

function showResults() {
    clearInterval(activeQuiz.timer);
    
    // Switch views
    document.getElementById('quiz-active-view').classList.remove('active');
    document.getElementById('quiz-results-view').classList.add('active');

    // Calculate score
    const total = activeQuiz.questions.length;
    const correctCount = activeQuiz.answers.filter(a => a.isCorrect).length;
    const wrongCount = total - correctCount;

    document.getElementById('res-total').innerText = total;
    document.getElementById('res-correct').innerText = correctCount;
    document.getElementById('res-wrong').innerText = wrongCount;

    // Customize results card details
    const ratio = Math.round((correctCount / total) * 100);
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
    
    document.getElementById('header-progress-text').innerText = "Sonuçlar";
    updateWrongCountBadge();
}

// Wrong Questions Screen Logic
function renderWrongQuestions() {
    const wrongListContainer = document.getElementById('wrong-list');
    const wrongSummary = document.getElementById('wrong-questions-summary');
    wrongListContainer.innerHTML = '';

    const wrongCount = wrongQuestionIds.length;
    wrongSummary.innerText = `Kayıtlı ${wrongCount} yanlış sorunuz var.`;

    if (wrongCount === 0) {
        wrongListContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-face-smile-beam empty-icon"></i>
                <h3>Harika! Hiç yanlış sorunuz yok.</h3>
                <p>Test çözdükçe yanlış cevaplarınız burada listelenecektir.</p>
            </div>
        `;
        return;
    }

    wrongQuestionIds.forEach(id => {
        const question = allQuestions.find(q => q.id === id);
        if (!question) return;

        const card = document.createElement('div');
        card.className = 'wrong-item-card';
        card.innerHTML = `
            <div class="wrong-item-header">
                <span>ID: ${question.id}</span>
                <span class="wrong-badge">Hatalı</span>
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
                <button class="wrong-action-btn delete-btn" onclick="removeWrongQuestion(${question.id})">
                    <i class="fa-solid fa-trash"></i> Sil
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
    
    // Header Info & Progress
    const totalCount = activeCardsQuiz.questions.length;
    const indexText = `Terim ${activeCardsQuiz.currentIndex + 1} / ${totalCount}`;
    document.getElementById('cards-question-number').innerText = indexText;
    document.getElementById('header-progress-text').innerText = indexText;
    
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

    question.options.forEach((option) => {
        const optKey = option.trim().charAt(0); // gets A, B, C, D
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerText = option;
        button.onclick = () => selectCardsOption(button, optKey);
        optionsContainer.appendChild(button);
    });
}

function selectCardsOption(selectedButton, chosenKey) {
    const question = activeCardsQuiz.questions[activeCardsQuiz.currentIndex];
    const correctKey = question.answer.trim();

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
    
    document.getElementById('header-progress-text').innerText = "Sonuçlar";
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
    const correctKey = (question._shuffledAnswer || question.answer).trim();
    const correctOpt = (question._shuffledOptions || question.options).find(opt => opt.trim().startsWith(correctKey));
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
    const correctKey = question.answer.trim();
    const correctOpt = question.options.find(opt => opt.trim().startsWith(correctKey));
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
