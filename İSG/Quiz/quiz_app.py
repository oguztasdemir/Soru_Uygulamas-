import tkinter as tk
from tkinter import ttk, messagebox
import json
import random
import os

class ISGQuizApp:
    def __init__(self, root):
        self.root = root
        self.root.title("İSG Final Sınavı Çalışma ve Test Kitapçığı")
        self.root.geometry("1120x700")
        self.root.configure(bg="#1e1e2e") # Deep Dark Slate
        
        # Load questions from JSON
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        json_path = os.path.join(self.script_dir, "questions.json")
        self.saved_answers_path = os.path.join(self.script_dir, "user_answers.json")
        
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                self.master_questions = json.load(f)
        except Exception as e:
            messagebox.showerror("Hata", f"questions.json yüklenemedi: {e}")
            self.root.destroy()
            return
        
        # Keyboard Navigation bindings
        self.root.bind("<Right>", lambda e: self.next_question())
        self.root.bind("<d>", lambda e: self.next_question())
        self.root.bind("<D>", lambda e: self.next_question())
        self.root.bind("<Left>", lambda e: self.prev_question())
        self.root.bind("<a>", lambda e: self.prev_question())
        self.root.bind("<A>", lambda e: self.prev_question())
        
        # Design Styles & Colors
        self.style = ttk.Style()
        self.style.theme_use('clam')
        
        # Top Header Frame
        header_frame = tk.Frame(root, bg="#252538", height=70)
        header_frame.pack(fill="x")
        
        header_label = tk.Label(header_frame, text="İSG FİNAL SINAVI - BENZERSİZ TEST ÇALIŞMA KİTAPÇIĞI", 
                                font=("Helvetica", 14, "bold"), fg="#89b4fa", bg="#252538")
        header_label.pack(pady=20)

        # Dropdown Filter UI Setup
        filter_frame = tk.Frame(root, bg="#1e1e2e")
        filter_frame.pack(fill="x", padx=30, pady=10)
        
        filter_lbl = tk.Label(filter_frame, text="Konu / Ünite Seçimi:", font=("Helvetica", 10, "bold"), fg="#cba6f7", bg="#1e1e2e")
        filter_lbl.pack(side="left", padx=5)
        
        self.categories = {
            "Tüm Konular (Karma Havuz)": "all",
            "Ünite 1: Giriş ve Temel Kavramlar (1.pdf)": "1.pdf",
            "Ünite 2: Risk Değerlendirme Metodolojileri (4-5.pdf)": "4-5.pdf",
            "Ünite 3: İSG Kurulları ve İş Kazaları (6-7.pdf)": "6-7.pdf",
            "Ünite 4: Çalışmaktan Kaçınma & Formüller (8.pdf)": "8.pdf",
            "Ünite 5: Risk Yönetimi & Kritik Tablolar (9A.pdf)": "9A.pdf",
            "Ünite 6: İş Hukuku ve Fesih Süreleri (11.pdf)": "11.pdf",
            "Yavuz Hoca'nın Özel İSG Notu": "Yavuz Hoca Notu",
            "❌ Sadece Yanlış Yapılan Sorular": "wrong_only",
            "📝 Deneme Sınavı (25 Soru - Karma)": "mock_exam"
        }
        
        self.filter_combobox = ttk.Combobox(filter_frame, values=list(self.categories.keys()), state="readonly", width=35, font=("Helvetica", 10))
        self.filter_combobox.set("Tüm Konular (Karma Havuz)")
        self.filter_combobox.pack(side="left", padx=10)
        self.filter_combobox.bind("<<ComboboxSelected>>", self.filter_category)

        search_lbl = tk.Label(filter_frame, text="Soru Ara:", font=("Helvetica", 10, "bold"), fg="#89b4fa", bg="#1e1e2e")
        search_lbl.pack(side="left", padx=(15, 5))
        
        self.search_var = tk.StringVar()
        self.search_var.trace_add("write", lambda *args: self.filter_category())
        self.search_entry = tk.Entry(filter_frame, textvariable=self.search_var, width=20, font=("Helvetica", 10))
        self.search_entry.pack(side="left", padx=5)

        self.btn_reset = tk.Button(filter_frame, text="🔄 Sıfırla", font=("Helvetica", 10, "bold"), 
                                   fg="#11111b", bg="#f38ba8", activebackground="#f5e0dc",
                                   padx=10, command=self.reset_all_answers)
        self.btn_reset.pack(side="left", padx=10)

        self.btn_toggle_sidebar = tk.Button(filter_frame, text="📊 Soru Listesi (Aç/Kapa)", font=("Helvetica", 10, "bold"), 
                                            fg="#11111b", bg="#89b4fa", activebackground="#b4befe",
                                            padx=10, command=self.toggle_sidebar)
        self.btn_toggle_sidebar.pack(side="left", padx=10)
        
        # Main body frame to hold left and right panels
        body_frame = tk.Frame(root, bg="#1e1e2e")
        body_frame.pack(fill="both", expand=True, padx=30, pady=10)
        
        # Left Panel: Quiz card and controls
        left_panel = tk.Frame(body_frame, bg="#1e1e2e")
        left_panel.pack(side="left", fill="both", expand=True)
        
        # Right Panel: Question navigation sidebar
        self.right_panel = tk.Frame(body_frame, bg="#2e3047", bd=2, relief="groove", width=260)
        self.right_panel.pack(side="right", fill="y", padx=(15, 0))
        self.right_panel.pack_propagate(False)
        self.sidebar_visible = True
        
        # Sidebar Header
        sidebar_header = tk.Label(self.right_panel, text="SORU LİSTESİ", font=("Helvetica", 10, "bold"), fg="#ffffff", bg="#252538", pady=8)
        sidebar_header.pack(fill="x")
        
        # Canvas and Scrollbar for scrollability
        self.canvas = tk.Canvas(self.right_panel, bg="#2e3047", highlightthickness=0)
        scrollbar = ttk.Scrollbar(self.right_panel, orient="vertical", command=self.canvas.yview)
        
        # Inner frame to hold buttons
        self.grid_frame = tk.Frame(self.canvas, bg="#2e3047")
        self.grid_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all"))
        )
        
        self.canvas.create_window((0, 0), window=self.grid_frame, anchor="nw", width=230)
        self.canvas.configure(yscrollcommand=scrollbar.set)
        
        scrollbar.pack(side="right", fill="y")
        self.canvas.pack(side="left", fill="both", expand=True, padx=5, pady=5)
        
        # Enable mouse wheel scrolling on canvas
        def on_mousewheel(event):
            self.canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")
        self.canvas.bind_all("<MouseWheel>", on_mousewheel)
        
        # Main Dashboard / Content Card Frame
        self.card = tk.Frame(left_panel, bg="#2e3047", bd=2, relief="groove")
        self.card.pack(fill="both", expand=True, pady=(0, 10))
        
        # Progress / Score Status Frame
        status_frame = tk.Frame(self.card, bg="#2e3047")
        status_frame.pack(fill="x", padx=20, pady=10)
        
        self.progress_lbl = tk.Label(status_frame, text="", 
                                     font=("Helvetica", 11, "bold"), fg="#cdd6f4", bg="#2e3047")
        self.progress_lbl.pack(side="left")
        
        self.score_lbl = tk.Label(status_frame, text="Skor: 0", 
                                  font=("Helvetica", 11, "bold"), fg="#a6e3a1", bg="#2e3047")
        self.score_lbl.pack(side="right")
        
        # Question Display Label (Wraps text dynamically)
        self.q_lbl = tk.Label(self.card, text="", font=("Helvetica", 12, "bold"), fg="#ffffff", bg="#2e3047",
                              wraplength=700, justify="left", anchor="w")
        self.q_lbl.pack(fill="x", padx=20, pady=15)
        
        # Choices Buttons List
        self.choice_btns = []
        for idx in range(4):
            btn = tk.Button(self.card, text="", font=("Helvetica", 11), fg="#cdd6f4", bg="#3c3f58",
                            activebackground="#4c4f69", activeforeground="#ffffff",
                            bd=1, relief="raised", padx=10, pady=8, justify="left", anchor="w",
                            command=lambda i=idx: self.select_and_check(i))
            btn.pack(fill="x", padx=20, pady=6)
            
            # Hover animations
            btn.bind("<Enter>", lambda e, b=btn: self.on_hover(b))
            btn.bind("<Leave>", lambda e, b=btn: self.on_leave(b))
            self.choice_btns.append(btn)
            
        # Explanations Box (Appears after answer)
        self.exp_frame = tk.Frame(self.card, bg="#1e1e2e", bd=1, relief="solid")
        self.exp_lbl = tk.Label(self.exp_frame, text="", font=("Helvetica", 10, "italic"), fg="#f9e2af", bg="#1e1e2e",
                                wraplength=700, justify="left")
        self.exp_lbl.pack(padx=10, pady=10)
        
        # Navigation Control Bottom Panel
        self.ctrl_frame = tk.Frame(left_panel, bg="#1e1e2e")
        self.ctrl_frame.pack(fill="x", side="bottom", pady=10)
        
        self.btn_prev = tk.Button(self.ctrl_frame, text="◀ Önceki Soru (A)", font=("Helvetica", 11, "bold"), 
                                  fg="#11111b", bg="#f5e0dc", activebackground="#f2cdcd",
                                  padx=15, pady=8, command=self.prev_question)
        self.btn_prev.pack(side="left", padx=40)
        
        self.btn_next = tk.Button(self.ctrl_frame, text="Sonraki Soru (D) ▶", font=("Helvetica", 11, "bold"), 
                                  fg="#11111b", bg="#89b4fa", activebackground="#b4befe",
                                  padx=15, pady=8, command=self.next_question)
        self.btn_next.pack(side="right", padx=40)
        
        # Initial Category Filtering & Load
        self.filter_category()
        
    def load_answers(self):
        if os.path.exists(self.saved_answers_path):
            try:
                with open(self.saved_answers_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return {}
        return {}

    def save_answer(self, question_text, selected_idx):
        answers = self.load_answers()
        answers[question_text] = selected_idx
        try:
            with open(self.saved_answers_path, "w", encoding="utf-8") as f:
                json.dump(answers, f, ensure_ascii=False, indent=4)
        except Exception as e:
            print(f"Error saving answer: {e}")

    def reset_all_answers(self):
        if messagebox.askyesno("Sıfırla", "Tüm soru cevaplarınızı sıfırlamak istediğinize emin misiniz?"):
            if os.path.exists(self.saved_answers_path):
                try:
                    os.remove(self.saved_answers_path)
                except Exception as e:
                    messagebox.showerror("Hata", f"Cevaplar sıfırlanamadı: {e}")
            
            # Reset selections
            self.user_selections = [None] * len(self.questions)
            self.load_question()
            self.render_question_grid()

    def toggle_sidebar(self):
        if self.sidebar_visible:
            self.right_panel.pack_forget()
            self.sidebar_visible = False
        else:
            self.right_panel.pack(side="right", fill="y", padx=(15, 0))
            self.sidebar_visible = True

    def filter_category(self, event=None):
        selected_text = self.filter_combobox.get()
        category_val = self.categories.get(selected_text, "all")
        search_val = self.search_var.get().lower().strip()
        answers = self.load_answers()
        
        filtered = []
        if category_val == "all":
            filtered = list(self.master_questions)
        elif category_val == "wrong_only":
            filtered = [
                q for q in self.master_questions
                if q["question"] in answers and answers[q["question"]] is not None and answers[q["question"]] != q["answer"]
            ]
        elif category_val == "mock_exam":
            filtered = list(self.master_questions)
        else:
            filtered = [q for q in self.master_questions if q.get("pdf") == category_val]
            
        # Apply keyword search
        if search_val:
            filtered = [q for q in filtered if search_val in q["question"].lower()]
            
        random.shuffle(filtered)
        
        # Apply mock exam limit
        if category_val == "mock_exam":
            filtered = filtered[:25]
            
        self.questions = filtered
        self.current_idx = 0
        self.score = 0
        self.answered = False
        
        # Load user selections
        self.user_selections = []
        for q in self.questions:
            q_text = q["question"]
            saved_val = answers.get(q_text, None)
            self.user_selections.append(saved_val)
        
        if len(self.questions) == 0:
            self.q_lbl.config(text="Arama kriterlerine uygun soru bulunamadı.")
            for btn in self.choice_btns:
                btn.config(state="disabled", text="")
            self.btn_next.config(state="disabled")
            self.btn_prev.config(state="disabled")
            self.progress_lbl.config(text="Soru: 0 / 0")
        else:
            self.render_question_grid()
            self.load_question()
        
    def render_question_grid(self):
        for widget in self.grid_frame.winfo_children():
            widget.destroy()
            
        self.grid_buttons = []
        cols = 5
        for idx, q in enumerate(self.questions):
            r = idx // cols
            c = idx % cols
            
            selection = self.user_selections[idx]
            if selection is not None:
                if selection == q["answer"]:
                    bg_col = "#a6e3a1"
                    fg_col = "#11111b"
                else:
                    bg_col = "#f38ba8"
                    fg_col = "#11111b"
            else:
                bg_col = "#000000"
                fg_col = "#ffffff"
                
            is_active = (idx == self.current_idx)
            relief_val = "sunken" if is_active else "raised"
            bd_val = 2 if is_active else 1
            active_fg = "#89b4fa" if is_active else fg_col
            
            btn = tk.Button(
                self.grid_frame, 
                text=str(idx + 1), 
                font=("Helvetica", 9, "bold"),
                bg=bg_col, 
                fg=active_fg,
                relief=relief_val, 
                bd=bd_val,
                width=4,
                height=2,
                command=lambda i=idx: self.jump_to_question(i)
            )
            btn.grid(row=r, column=c, padx=3, pady=3)
            self.grid_buttons.append(btn)

    def jump_to_question(self, idx):
        self.current_idx = idx
        self.load_question()

    def on_hover(self, btn):
        if not self.answered:
            btn.configure(bg="#45475a", fg="#ffffff")
            
    def on_leave(self, btn):
        if not self.answered:
            btn.configure(bg="#3c3f58", fg="#cdd6f4")
                
    def select_and_check(self, idx):
        if self.answered:
            return
        
        self.answered = True
        self.user_selections[self.current_idx] = idx
        
        q_data = self.questions[self.current_idx]
        correct_idx = q_data["answer"]
        
        # Save selection
        self.save_answer(q_data["question"], idx)
        
        # Update specific button color in grid
        if hasattr(self, 'grid_buttons') and self.current_idx < len(self.grid_buttons):
            btn = self.grid_buttons[self.current_idx]
            if idx == correct_idx:
                btn.configure(bg="#a6e3a1", fg="#11111b")
            else:
                btn.configure(bg="#f38ba8", fg="#11111b")
        
        # Update scoreboard
        if idx == correct_idx:
            self.score += 1
            
        self.render_graded_state(idx, correct_idx, q_data["explanation"])
        self.update_score_lbl()
        
    def render_graded_state(self, selected_idx, correct_idx, explanation):
        # Disable option selection
        for btn in self.choice_btns:
            btn.config(state="disabled")
            
        # Color code choices
        if selected_idx == correct_idx:
            self.choice_btns[selected_idx].configure(bg="#a6e3a1", fg="#11111b") # Green for correct
        else:
            self.choice_btns[selected_idx].configure(bg="#f38ba8", fg="#11111b") # Red for incorrect
            self.choice_btns[correct_idx].configure(bg="#a6e3a1", fg="#11111b") # Show correct in Green
            
        # Show Explanation
        self.exp_lbl.config(text="💡 AÇIKLAMA / BİLGİ:\n" + explanation)
        self.exp_frame.pack(fill="x", padx=20, pady=10)
        
    def load_question(self):
        # Reset state & hide explanation
        self.exp_frame.pack_forget()
        
        q_data = self.questions[self.current_idx]
        correct_idx = q_data["answer"]
        
        # Update progress label
        self.progress_lbl.config(text=f"Soru: {self.current_idx+1} / {len(self.questions)}")
        self.update_score_lbl()
        
        # Enable/Disable Prev button
        if self.current_idx == 0:
            self.btn_prev.config(state="disabled")
        else:
            self.btn_prev.config(state="normal")
            
        # Set question text
        self.q_lbl.config(text=q_data["question"])
        
        # Load choices text
        for idx, choice in enumerate(q_data["choices"]):
            self.choice_btns[idx].config(text=choice, bg="#3c3f58", fg="#cdd6f4", state="normal")
            
        # Check if this question was already answered previously
        prev_selection = self.user_selections[self.current_idx]
        if prev_selection is not None:
            self.answered = True
            self.render_graded_state(prev_selection, correct_idx, q_data["explanation"])
        else:
            self.answered = False
            
        # Highlight active button in the grid
        if hasattr(self, 'grid_buttons') and len(self.grid_buttons) > 0:
            for idx, btn in enumerate(self.grid_buttons):
                is_active = (idx == self.current_idx)
                relief_val = "sunken" if is_active else "raised"
                bd_val = 2 if is_active else 1
                
                # Determine default text colors
                selection = self.user_selections[idx]
                if selection is not None:
                    if selection == self.questions[idx]["answer"]:
                        bg_col = "#a6e3a1"
                        fg_col = "#11111b"
                    else:
                        bg_col = "#f38ba8"
                        fg_col = "#11111b"
                else:
                    bg_col = "#000000"
                    fg_col = "#ffffff"
                    
                active_fg = "#89b4fa" if is_active else fg_col
                btn.configure(relief=relief_val, bd=bd_val, fg=active_fg, bg=bg_col)
                
                if is_active:
                    row = idx // 5
                    total_rows = (len(self.questions) + 4) // 5
                    if total_rows > 0:
                        fraction = row / total_rows
                        self.canvas.yview_moveto(max(0.0, fraction - 0.2))
            
    def update_score_lbl(self):
        # Calculate score dynamically based on all answered questions
        total_correct = 0
        total_answered = 0
        for i, sel in enumerate(self.user_selections):
            if sel is not None:
                total_answered += 1
                if sel == self.questions[i]["answer"]:
                    total_correct += 1
        self.score_lbl.config(text=f"Doğru: {total_correct} / {total_answered}")
        
    def next_question(self):
        if self.current_idx < len(self.questions) - 1:
            self.current_idx += 1
            self.load_question()
        else:
            # End of test reached
            total_answered = sum(1 for s in self.user_selections if s is not None)
            total_correct = sum(1 for i, s in enumerate(self.user_selections) if s is not None and s == self.questions[i]["answer"])
            messagebox.showinfo("Sınav Tamamlandı!", f"Tüm soruları tamamladınız.\n\nSkorunuz: {total_correct} / {total_answered}")
            
    def prev_question(self):
        if self.current_idx > 0:
            self.current_idx -= 1
            self.load_question()

if __name__ == "__main__":
    root = tk.Tk()
    app = ISGQuizApp(root)
    root.mainloop()
