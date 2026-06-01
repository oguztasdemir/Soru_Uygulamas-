import os
import json
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether, Table, TableStyle
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Set up paths
script_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(script_dir, "questions.json")
pdf_path = os.path.join(script_dir, "ISG_Final_Sınav_Hazırlık_Kitapçıgı.pdf")

# Register Arial fonts for Turkish character support on Windows
arial_path = r"C:\Windows\Fonts\arial.ttf"
arial_bold_path = r"C:\Windows\Fonts\arialbd.ttf"
arial_italic_path = r"C:\Windows\Fonts\ariali.ttf"

if os.path.exists(arial_path):
    pdfmetrics.registerFont(TTFont("Arial", arial_path))
else:
    print("Warning: Arial font not found, using fallback.")
    pdfmetrics.registerFont(TTFont("Arial", "Helvetica"))

if os.path.exists(arial_bold_path):
    pdfmetrics.registerFont(TTFont("Arial-Bold", arial_bold_path))
else:
    pdfmetrics.registerFont(TTFont("Arial-Bold", "Helvetica-Bold"))

if os.path.exists(arial_italic_path):
    pdfmetrics.registerFont(TTFont("Arial-Italic", arial_italic_path))
else:
    pdfmetrics.registerFont(TTFont("Arial-Italic", "Helvetica-Oblique"))

# Load questions from JSON
with open(json_path, "r", encoding="utf-8") as f:
    questions = json.load(f)

# Group questions by unit
unit_mapping = {
    "1.pdf": "Ünite 1: İSG'ye Giriş ve Temel Kavramlar",
    "4-5.pdf": "Ünite 2: Risk Değerlendirme Metodolojileri",
    "6-7.pdf": "Ünite 3: İSG Kurulları ve İş Kazaları",
    "8.pdf": "Ünite 4: Çalışmaktan Kaçınma ve Formüller",
    "9A.pdf": "Ünite 5: Risk Yönetimi ve Kritik Tablolar",
    "11.pdf": "Ünite 6: İş Hukuku ve Fesih Süreleri",
    "Yavuz Hoca Notu": "Yavuz Hoca'nın Özel İSG Notları"
}

grouped_questions = {title: [] for title in unit_mapping.values()}
for q in questions:
    unit_key = q.get("pdf", "1.pdf")
    unit_title = unit_mapping.get(unit_key, unit_mapping["1.pdf"])
    grouped_questions[unit_title].append(q)

# Subclass SimpleDocTemplate to dynamically support Table of Contents
class ISGDocTemplate(SimpleDocTemplate):
    def __init__(self, filename, **kw):
        super().__init__(filename, **kw)
        self.toc = TableOfContents()
        self.toc.levelStyles = [
            ParagraphStyle(
                'TOCLevel0',
                fontName='Arial-Bold',
                fontSize=11,
                leading=15,
                textColor=colors.HexColor("#1e1e2e"),
                spaceAfter=6
            ),
            ParagraphStyle(
                'TOCLevel1',
                fontName='Arial',
                fontSize=9.5,
                leading=14,
                textColor=colors.HexColor("#4c4f69"),
                leftIndent=20,
                spaceAfter=4
            )
        ]

    def afterFlowable(self, flowable):
        if flowable.__class__.__name__ == 'Paragraph':
            text = flowable.getPlainText()
            style = flowable.style.name
            if style == 'TOCSection':
                self.toc.addEntry(0, text, self.page)
            elif style == 'TOCHeading':
                self.toc.addEntry(1, text, self.page)

doc = ISGDocTemplate(
    pdf_path,
    pagesize=A4,
    rightMargin=40,
    leftMargin=40,
    topMargin=50,
    bottomMargin=50
)

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "TitleStyle",
    parent=styles["Heading1"],
    fontName="Arial-Bold",
    fontSize=26,
    leading=32,
    textColor=colors.HexColor("#1e1e2e"),
    alignment=1,
    spaceAfter=15
)

subtitle_style = ParagraphStyle(
    "SubtitleStyle",
    parent=styles["Normal"],
    fontName="Arial",
    fontSize=14,
    leading=18,
    textColor=colors.HexColor("#57587e"),
    alignment=1,
    spaceAfter=40
)

info_style = ParagraphStyle(
    "InfoStyle",
    parent=styles["Normal"],
    fontName="Arial",
    fontSize=11,
    leading=15,
    textColor=colors.HexColor("#333333"),
    alignment=1,
    spaceAfter=10
)

toc_section_style = ParagraphStyle(
    "TOCSection",
    parent=styles["Heading1"],
    fontName="Arial-Bold",
    fontSize=18,
    leading=22,
    textColor=colors.HexColor("#1e1e2e"),
    spaceBefore=25,
    spaceAfter=15,
    keepWithNext=True
)

toc_heading_style = ParagraphStyle(
    "TOCHeading",
    parent=styles["Heading2"],
    fontName="Arial-Bold",
    fontSize=13,
    leading=17,
    textColor=colors.HexColor("#11111b"),
    spaceBefore=18,
    spaceAfter=10,
    keepWithNext=True
)

body_style = ParagraphStyle(
    "BodyStyle",
    parent=styles["Normal"],
    fontName="Arial",
    fontSize=10,
    leading=14.5,
    textColor=colors.HexColor("#2b2c3c"),
    spaceAfter=8
)

q_text_style = ParagraphStyle(
    "QuestionStyle",
    parent=styles["Normal"],
    fontName="Arial-Bold",
    fontSize=10.5,
    leading=14.5,
    textColor=colors.HexColor("#11111b"),
    spaceBefore=12,
    spaceAfter=8,
    keepWithNext=True
)

choice_normal_style = ParagraphStyle(
    "ChoiceNormal",
    parent=styles["Normal"],
    fontName="Arial",
    fontSize=9.5,
    leading=13.5,
    textColor=colors.HexColor("#4c4f69"),
    leftIndent=15,
    spaceAfter=3
)

ans_style = ParagraphStyle(
    "AnswerCorrect",
    parent=styles["Normal"],
    fontName="Arial-Bold",
    fontSize=9.5,
    leading=13.5,
    textColor=colors.HexColor("#40a02b"),
    spaceBefore=4,
    spaceAfter=4
)

exp_style = ParagraphStyle(
    "Explanation",
    parent=styles["Normal"],
    fontName="Arial-Italic",
    fontSize=9,
    leading=13,
    textColor=colors.HexColor("#5c5f77")
)

option_prefixes = ["A) ", "B) ", "C) ", "D) ", "E) "]

def clean_choice_text(text):
    text = text.strip()
    for prefix in ["A)", "B)", "C)", "D)", "E)", "A) ", "B) ", "C) ", "D) ", "E) ", "A -", "B -", "C -", "D -", "E -", "A-", "B-", "C-", "D-", "E-", "A. ", "B. ", "C. ", "D. ", "E. ", "a) ", "b) ", "c) ", "d) ", "e) "]:
        if text.startswith(prefix):
            text = text[len(prefix):].strip()
            break
    return text

def clean_choices(choices):
    cleaned = []
    for choice in choices:
        cleaned.append(clean_choice_text(choice))
    return cleaned

story = []

# --- 1. COVER PAGE ---
story.append(Spacer(1, 100))
story.append(Paragraph("İSG FİNAL SINAVI", title_style))
story.append(Paragraph("Dinamik İçindekiler Panelli & Detaylı Açıklamalı Çalışma Kitabı", subtitle_style))
story.append(Spacer(1, 40))

intro_table_data = [
    [Paragraph("<b>Hazırlık Kapsamı:</b>", ParagraphStyle("H", parent=body_style, fontName="Arial-Bold")), 
     Paragraph("MDB 106 İş Sağlığı ve Güvenliği Final Sınavı", body_style)],
    [Paragraph("<b>Toplam Soru Sayısı:</b>", ParagraphStyle("H", parent=body_style, fontName="Arial-Bold")), 
     Paragraph("315 Soru (Her Biri 5 Şıklı - Konu Bazlı Sıralı)", body_style)],
    [Paragraph("<b>Yöntem Hükmü:</b>", ParagraphStyle("H", parent=body_style, fontName="Arial-Bold")), 
     Paragraph("Konu Anlatımı + Ünite Bazlı Testler (Açıklamalı Cevap Anahtarlı)", body_style)]
]
t = Table(intro_table_data, colWidths=[150, 330])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
    ('PADDING', (0,0), (-1,-1), 10),
    ('GRID', (0,0), (-1,-1), 1, colors.HexColor("#e2e8f0")),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(t)
story.append(Spacer(1, 100))
story.append(Paragraph("<b>Hazırlayan:</b> Oğuz Taşdemir", ParagraphStyle("C", parent=body_style, alignment=1, fontSize=12)))
story.append(PageBreak())

# --- 2. TABLE OF CONTENTS PAGE ---
story.append(Paragraph("İÇİNDEKİLER", ParagraphStyle("TOCMainTitle", parent=title_style, fontSize=20, leading=24, spaceAfter=20)))
story.append(doc.toc)
story.append(PageBreak())

# --- 3. DETAILED STUDY NOTES (KONU ANLATIMI) ---
story.append(Paragraph("BÖLÜM 1: AŞIRI DETAYLI KONU ANLATIMI", toc_section_style))
story.append(Spacer(1, 10))

# Unit 1 Notes
story.append(Paragraph("Ünite 1: İSG'ye Giriş ve Temel Kavramlar", toc_heading_style))
story.append(Paragraph("<b>1. Tarihsel Gelişim Süreci:</b><br/>"
                       "İş Sağlığı ve Güvenliği'nin tarihsel kökenleri antik çağlara kadar uzanmaktadır. Tarihte bilinen ilk İSG yaklaşımları şu şekildedir:<br/>"
                       "• <b>Bernardino Ramazzini:</b> İSG'nin kurucusu/babası olarak kabul edilir. İşçilerin yaptıkları işleri sorgularken onlara 'Ne iş yapıyorsun?' sorusunun sorulması gerektiğini söyleyen ve meslek hastalıkları üzerine ilk kapsamlı kitabı yazan kişidir.<br/>"
                       "• <b>Percivall Pott:</b> Baca temizleyicilerinde görülen skrotum kanserinin mesleki bir hastalık olduğunu kanıtlayarak ilk kanserojen madde-iş ilişkisini kurmuştur.<br/>"
                       "• <b>Sanayi Devrimi:</b> İngiltere'de çocuk ve kadın işçilerin ağır şartlarda çalıştırılmasıyla birlikte yasal düzenlemelerin (Fabrikalar Yasası vb.) önünü açmıştır.", body_style))
story.append(Paragraph("<b>2. Tehlike ve Risk Kavramları (6331 Sayılı Kanun):</b><br/>"
                       "Kanun kapsamında bu iki terim kesin çizgilerle ayrılmıştır:<br/>"
                       "• <b>Tehlike:</b> İşyerinde var olan ya da dışarıdan gelebilecek, çalışanı veya işyerini etkileyebilecek zarar veya hasar verme <b>potansiyelidir</b>. Örneğin, zeminin ıslak olması, elektrik kablosunun açıkta durması, iskelede korkuluk olmaması birer tehlikedir.<br/>"
                       "• <b>Risk:</b> Tehlikeden kaynaklanacak kayıp, yaralanma ya da başka zararlı sonuç meydana gelme <b>olasılığı ile şiddetinin bileşkesidir</b>. Zemin ıslaksa çalışanın kayıp düşmesi, kablo açıktaysa elektrik çarpması birer risktir.", body_style))
story.append(Paragraph("<b>3. Risk Algılama ve Yaklaşımlar:</b><br/>"
                       "Modern İSG felsefesi <b>Proaktif (Önleyici) Yaklaşım</b> üzerine kuruludur:<br/>"
                       "• <b>Proaktif Yaklaşım:</b> Tehlikeleri önceden analiz edip, kazalar gerçekleşmeden önce risk değerlendirmesiyle tedbir alma yaklaşımıdır. Bu yaklaşım iş kazalarını engellemede en yüksek başarıyı sağlar.<br/>"
                       "• <b>Reaktif Yaklaşım:</b> Kazaların gerçekleşmesinden sonra olay yeri incelemesi yapıp tedbir almaya çalışan geleneksel yaklaşımdır. Maliyetleri ve can kayıplarını azaltmada etkisizdir.", body_style))
story.append(Paragraph("<b>4. NACE Kodları ve Tehlike Sınıflarının Belirlenmesi:</b><br/>"
                       "İşyerleri yasal olarak yaptıkları ana faaliyete göre NACE (Avrupa Birliği Ekonomik Faaliyetlerin Sınıflandırılması) kodları alırlar. Bu kodlar doğrultusunda işyerleri 3 tehlike sınıfına ayrılır:<br/>"
                       "• <b>Az Tehlikeli Sınıf:</b> Büro faaliyetleri, bankacılık, perakende mağazacılık, eğitim kurumları.<br/>"
                       "• <b>Tehlikeli Sınıf:</b> Diş hekimliği klinikleri, mobilya imalatı, gıda işleme fabrikaları.<br/>"
                       "• <b>Çok Tehlikeli Sınıf:</b> Maden ocakları, şantiyeler, metal ergitme tesisleri, ağır kimya sanayii.<br/>"
                       "Tehlike sınıfları, görevlendirilecek İş Güvenliği Uzmanlarının sertifika sınıfını (A sınıfı: Çok Tehlikeli, B sınıfı: Tehlikeli, C sınıfı: Az Tehlikeli) belirlemede temel esastır.", body_style))
story.append(PageBreak())

# Unit 2 Notes
story.append(Paragraph("Ünite 2: Risk Değerlendirme Metodolojileri", toc_heading_style))
story.append(Paragraph("Risk analizi metodolojileri, tehlikeleri sayısal veya nitel olarak derecelendirmek için kullanılan sistemlerdir. Sınavda parametreleri ve formülleri doğrudan sorgulanmaktadır.", body_style))
story.append(Paragraph("<b>1. L Tipi Matris (5x5 Matris):</b> Yarı-nicel bir risk analiz metodudur. Küçük ve karmaşık olmayan işletmelerde tercih edilir.<br/>"
                       "• <b>Formül:</b> Risk Puanı = Olasılık (O) × Şiddet (Ş)<br/>"
                       "• Parametreler 1 ile 5 arasında puanlanır. Risk Skoru en fazla 25, en az 1 olabilir. 25 puanlık risk, acil eylem gerektiren 'Kabul Edilemez Risk' kategorisindedir.", body_style))
story.append(Paragraph("<b>2. İnce-Kinney (Fine-Kinney) Metodu:</b> Klasik matristen farklı olarak tehlikeyle karşılaşma sıklığını (Frekans) da denkleme katar.<br/>"
                       "• <b>Formül:</b> Risk Değeri = İhtimal (O) × Frekans (F) × Şiddet (Ş)<br/>"
                       "• Olasılık (0.1 - 10), Frekans (0.5 - 10), Şiddet (1 - 100) arasında değişen puan cetvellerine sahiptir. Şiddet puanında 'Ölüm' 15 veya 40 puanla, 'Birden çok ölüm' ise 100 puanla temsil edilir.", body_style))
story.append(Paragraph("<b>3. FMEA (Hata Türleri ve Etkileri Analizi):</b> Tasarım ve üretim hatalarını sıfıra indirmek için otomotiv ve havacılık sektöründe yaygın kullanılan bir metodolojidir.<br/>"
                       "• <b>Formül:</b> Risk Öncelik Sayısı (RÖS) = Olasılık (O) × Şiddet (Ş) × Saptanabilirlik (D)<br/>"
                       "• Parametreler 1-10 arası puanlanır. RÖS maksimum 1000 olabilir. RÖS değeri 100'ün üzerine çıktığında mutlaka düzeltici aksiyon alınmalıdır.<br/>"
                       "• <i>Saptanabilirlik (D - Detection) Parametresi:</i> Hatanın fark edilme olasılığıdır. Hatanın sistem tarafından fark edilmesi kolaylaştıkça (Saptanabilirlik yüksek) puan düşer. Dolayısıyla RÖS azalır.", body_style))
story.append(Paragraph("<b>4. HAZOP (Tehlike ve İşletilebilirlik Analizi):</b> Kimya ve nükleer tesis gibi karmaşık proses endüstrilerinde akışkan sistemlerdeki sapmaları incelemek için tasarlanmıştır.<br/>"
                       "• Beyin fırtınası temellidir. Borulama şemaları üzerinden gidilir.<br/>"
                       "• Akış parametrelerine (Sıcaklık, Basınç, Debi) <b>kılavuz kelimeler</b> (Fazla, Eksik, Yok, Ters) uygulanarak olası tehlikeli sapmalar tespit edilir.", body_style))
story.append(Paragraph("<b>5. FTA (Hata Ağacı Analizi) ve ETA (Olay Ağacı Analizi):</b><br/>"
                       "• <b>FTA (Fault Tree Analysis):</b> Tepe bir hata olayından (örneğin yangın) yola çıkarak mantıksal VE/VEYA kapılarıyla bu hataya yol açabilecek alt olayları geriye doğru inceler. Kantitatif (nicel) ve dedüktif (tümdengelimli) bir yöntemdir.<br/>"
                       "• <b>ETA (Event Tree Analysis):</b> Başlatıcı bir olaydan (örneğin borunun delinmesi) yola çıkarak güvenlik bariyerlerinin çalışıp çalışmamasına göre olası tüm zincirleme sonuçları tümevarımlı olarak inceler. İleriye doğru çalışır.", body_style))
story.append(PageBreak())

# Unit 3 Notes
story.append(Paragraph("Ünite 3: İSG Kurulları ve İş Kazaları", toc_heading_style))
story.append(Paragraph("<b>1. İSG Kurullarının Yapısı ve Çalışma Kuralları:</b><br/>"
                       "İSG Kurulları, işyerinde iş sağlığı ve güvenliği kararlarını alan en yetkili ortak organdır. Kurulun kurulması için şu iki koşulun bir arada bulunması gerekir:<br/>"
                       "1. İşyerinde fiilen <b>en az 50 çalışan</b> bulunması,<br/>"
                       "2. İşin niteliği gereği <b>6 aydan fazla süren sürekli işlerin</b> yapılması.<br/>"
                       "• <i>Kurul Üyeleri:</i> İşveren veya vekili (Kurul başkanı), İş Güvenliği Uzmanı (Kurul sekreteri), İşyeri Hekimi, İnsan Kaynakları/İdari ve Mali İşler yöneticisi, Sivil Savunma Uzmanı, Baş temsilci/Çalışan temsilcisi ve ustabaşı/formen.<br/>"
                       "• <i>Karar Alma:</i> Kurul üye tam sayısının salt çoğunluğu ile toplanır ve katılanların salt çoğunluğu ile karar alır. Oyların eşitliği halinde başkanın (işverenin) oyu kararı belirler.", body_style))
story.append(Paragraph("<b>2. Kurul Toplantı Sıklığı:</b> Kurul ayda en az bir kez toplanmak zorundadır. Ancak kurul tehlike sınıfına göre bu süreyi uzatabilir:<br/>"
                       "• <b>Az Tehlikeli işyerlerinde:</b> En geç <b>3 ayda bir</b>,<br/>"
                       "• <b>Tehlikeli işyerlerinde:</b> En geç <b>2 ayda bir</b> toplanacak şekilde karar alınabilir.<br/>"
                       "• Çok tehlikeli sınıfta ise bu süre uzatılamaz, her ay toplantı yapılması zorunludur.", body_style))
story.append(Paragraph("<b>3. İş Kazasının Yasal Tanımı (5510 Sayılı Kanun Madde 13):</b><br/>"
                       "Bir kazanın yasal olarak iş kazası sayılabilmesi için sigortalının aşağıdaki durumların birinde bedenen veya ruhen engelli hale gelmesi gerekir:<br/>"
                       "• Sigortalının işyerinde bulunduğu sırada (iş yapıp yapmadığına bakılmaksızın),<br/>"
                       "• İşveren tarafından yürütülmekte olan iş nedeniyle asıl görevi dışında çalışırken,<br/>"
                       "• Sigortalının işveren tarafından görevle başka bir yere gönderilmesi nedeniyle asıl işini yapmaksızın geçen zamanlarda,<br/>"
                       "• Emziren kadın sigortalının çocuğuna süt vermek için ayrılan zamanlarda (süt izninde),<br/>"
                       "• Sigortalıların işverence sağlanan bir taşıtla işin yapıldığı yere gidiş gelişi sırasında (servis kazaları).<br/>"
                       "<i>Bildirim Süresi:</i> İş kazaları, işveren tarafından kazadan sonraki <b>en geç 3 iş günü içinde</b> Sosyal Güvenlik Kurumu'na (SGK) bildirilmek zorundadır.", body_style))
story.append(PageBreak())

# Unit 4 Notes
story.append(Paragraph("Ünite 4: Çalışmaktan Kaçınma ve Formüller", toc_heading_style))
story.append(Paragraph("<b>1. Çalışmaktan Kaçınma Hakkı (6331 md. 13):</b><br/>"
                       "Çalışanlar ciddi ve yakın bir tehlike ile karşı karşıya kaldıklarında kurula, kurulun bulunmadığı yerlerde ise doğrudan işverene başvurarak durumun tespit edilmesini ve gerekli tedbirlerin alınmasını talep ederler. Kurul veya işveren derhal karar verir ve durumu yazılı olarak tutanağa bağlar.<br/>"
                       "• Çalışanlar, gerekli tedbirler alınıncaya kadar **çalışmaktan kaçınabilirler**.<br/>"
                       "• Çalışmaktan kaçındıkları dönemde çalışanların ücretleri ödenmeye devam eder ve yasal hakları kısıtlanamaz.<br/>"
                       "• Tehlikenin önlenemez olduğu durumlarda çalışanlar iş sözleşmelerini haklı nedenle derhal feshedebilirler.", body_style))
story.append(Paragraph("<b>2. Kaza Sıklık Hızı (KSH) Formülü ve Uygulaması:</b><br/>"
                       "İşyerindeki kazaların sıklık derecesini standart bir ölçekle ölçmek için kullanılır. Çarpan olarak 1.000.000 (bir milyon) kullanılmasının sebebi, 500 çalışanın yılda yaklaşık 2000 saat çalışarak toplamda ulaştığı adam-saat değeridir.<br/>"
                       "<b>KSH = (Toplam İş Kazası Sayısı × 1.000.000) / Toplam Fiili Çalışma Saati (Adam-Saat)</b><br/>"
                       "<i>Örnek Soru Senaryosu:</i> 1000 çalışanı olan bir fabrikada yılda 10 iş kazası gerçekleşmiş ve toplam çalışma süresi 2.000.000 adam-saat olmuştur.<br/>"
                       "• KSH = (10 × 1.000.000) / 2.000.000 = <b>5.00</b> (Her 1 milyon çalışma saatinde ortalama 5 kaza meydana gelmektedir).", body_style))
story.append(Paragraph("<b>3. Kaza Ağırlık Hızı (KAH) Formülü ve Uygulaması:</b><br/>"
                       "Kazaların işgücü kaybı açısından ne kadar şiddetli olduğunu ölçer.<br/>"
                       "<b>KAH = (Kayıp İş Günü Sayısı × 1.000) / Toplam Fiili Çalışma Saati (Adam-Saat)</b><br/>"
                       "<i>Önemli Hüküm:</i> Ölümlü iş kazalarında veya çalışanın tamamen malul kaldığı uzuv kayıplarında, kayıp gün sayısına yasal olarak doğrudan <b>6000 gün</b> eklenir. Sınavda KAH hesaplatılırken ölümlü bir kaza belirtilirse kayıp gün sayısına bu değeri eklemeyi unutmamalısınız.<br/>"
                       "<i>Örnek Soru Senaryosu:</i> Toplam 500.000 adam-saat çalışılan bir atölyede kazalar nedeniyle 150 gün iş kaybı yaşanmış ve 1 kaza ölümlü sonuçlanmıştır.<br/>"
                       "• Toplam Kayıp Gün = 150 + 6000 (ölüm) = 6150 gün.<br/>"
                       "• KAH = (6150 × 1000) / 500.000 = <b>12.30</b>.", body_style))
story.append(PageBreak())

# Unit 5 Notes
story.append(Paragraph("Ünite 5: Risk Yönetimi ve Kritik Tablolar", toc_heading_style))
story.append(Paragraph("Risk yönetimi tehlikelerin belirlenmesi, risklerin analiz edilmesi, kontrol tedbirlerinin kararlaştırılması ve sürekli izleme sürecidir. Sınavın en önemli konularındandır.", body_style))
story.append(Paragraph("<b>1. Risk Kontrol Önlemlerinin Hiyerarşisi:</b><br/>"
                       "Riskleri azaltmak için uygulanacak tedbirler sırasıyla şu hiyerarşik düzene göre seçilmelidir:<br/>"
                       "1. **Tehlikenin Ortadan Kaldırılması (Eliminasyon):** Tehlike kaynağının tamamen yok edilmesi (En etkili yöntemdir).<br/>"
                       "2. **Tehlikeli Olanın Daha Az Tehlikeliyle Değiştirilmesi (İkame):** Tehlikeli kimyasal yerine su bazlı kimyasal kullanılması.<br/>"
                       "3. **Mühendislik Önlemleri (Toplu Koruma):** Makine koruyucuları takılması, havalandırma sistemleri kurulması, gürültü kaynağının izole edilmesi.<br/>"
                       "4. **İdari Önlemler / İşaretler:** Vardiyalı çalışma yaptırılarak maruziyet süresinin azaltılması, uyarı levhaları asılması, eğitimler verilmesi.<br/>"
                       "5. **Kişisel Koruyucu Donanımlar (KKD):** Baret, iş ayakkabısı, maske kullanımı (En son çaredir, sadece kişiyi korur).", body_style))
story.append(Paragraph("<b>2. Risk Değerlendirmesinin Yenilenme Süreleri:</b><br/>"
                       "Risk değerlendirmeleri, işyerinin tehlike sınıfına göre düzenli aralıklarla tamamen yenilenmek zorundadır:<br/>"
                       "• <b>Çok Tehlikeli Sınıfta:</b> En geç <b>2 yılda bir</b>,<br/>"
                       "• <b>Tehlikeli Sınıfta:</b> En geç <b>4 yılda bir</b>,<br/>"
                       "• <b>Az Tehlikeli Sınıfta:</b> En geç <b>6 yılda bir</b>.<br/>"
                       "<i>Not:</i> İşyerinde taşınma, yangın, iş kazası veya teknoloji değişikliği gibi majör bir durum gerçekleşirse bu süreler beklenmeksizin risk değerlendirmesi kısmen veya tamamen yenilenir.", body_style))
story.append(Paragraph("<b>3. Kabul Edilemez ve Kabul Edilebilir Risk Seviyeleri:</b><br/>"
                       "Matris analizinde elde edilen skorlara göre aksiyon planları yasal olarak belirlenmiştir. Bu değerler sınavda doğrudan sorulacaktır:", body_style))

# Define table style elements
table_header_style = ParagraphStyle(
    "TableHeader",
    parent=styles["Normal"],
    fontName="Arial-Bold",
    fontSize=10,
    leading=14,
    textColor=colors.HexColor("#ffffff")
)

table_body_style = ParagraphStyle(
    "TableBody",
    parent=styles["Normal"],
    fontName="Arial",
    fontSize=9,
    leading=13,
    textColor=colors.HexColor("#2b2c3c")
)

# Re-insert Table
r_table_data = [
    [Paragraph("<b>Risk Skoru</b>", table_header_style), Paragraph("<b>Risk Düzeyi</b>", table_header_style), Paragraph("<b>Açıklama / Eylem Planı</b>", table_header_style)],
    [Paragraph("15 - 25", table_body_style), Paragraph("KABUL EDİLEMEZ RİSK", table_body_style), Paragraph("İş kabul edilebilir seviyeye çekilmeden çalışmaya başlanamaz. Çalışılıyorsa iş durdurulur.", table_body_style)],
    [Paragraph("8 - 12", table_body_style), Paragraph("DİKKATE DEĞER RİSK", table_body_style), Paragraph("Bu risklere mümkün olduğu kadar çabuk müdahale edilmeli, acil eylem planlanmalı ve ilave tedbirler alınmalıdır.", table_body_style)],
    [Paragraph("1 - 6", table_body_style), Paragraph("KABUL EDİLEBİLİR RİSK", table_body_style), Paragraph("Acil tedbir gerektirmeyebilir ancak mevcut tedbirler sürdürülmeli ve iyileştirmeye devam edilmelidir.", table_body_style)]
]

r_table = Table(r_table_data, colWidths=[80, 120, 280])
r_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e1e2e")),
    ('ALIGN', (0,0), (-1,-1), 'LEFT'),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('BOTTOMPADDING', (0,0), (-1,0), 8),
    ('TOPPADDING', (0,0), (-1,0), 8),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
    ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#fecdd3")),  # Light red for unacceptable
    ('BACKGROUND', (0,2), (-1,2), colors.HexColor("#ffedd5")),  # Light orange for warning
    ('BACKGROUND', (0,3), (-1,3), colors.HexColor("#dcfce7")),  # Light green for acceptable
    ('PADDING', (0,1), (-1,-1), 8),
]))

story.append(r_table)
story.append(Spacer(1, 15))
story.append(PageBreak())

# Unit 6 Notes
story.append(Paragraph("Ünite 6: İş Hukuku ve Fesih Süreleri", toc_heading_style))
story.append(Paragraph("<b>1. 4857 Sayılı İş Kanunu Kapsamındaki Temel Haklar:</b><br/>"
                       "İş hukuku, işçi ile işveren arasındaki ilişkileri düzenleyen kanundur. Kanun kapsamında çalışma saatleri ve yasal sınırlar şu şekildedir:<br/>"
                       "• <b>Çalışma Süresi:</b> Haftalık çalışma süresi en fazla <b>45 saattir</b>. Aksi kararlaştırılmadıkça bu süre haftanın çalışılan günlerine eşit bölünür.<br/>"
                       "• <b>Fazla Çalışma Sınırı:</b> Bir işçiye yılda en fazla <b>270 saat</b> fazla çalışma yaptırılabilir. Günlük çalışma süresi fazla mesailer dahil hiçbir koşulda <b>11 saati</b> aşamaz.<br/>"
                       "• <b>Gece Çalışması Limiti:</b> Gece çalışmaları (20.00 - 06.00 saatleri arası) günde <b>7.5 saati</b> geçemez. Ancak sağlık, turizm ve güvenlik gibi bazı özel sektörlerde işçinin onayıyla bu sınır aşılabilir.", body_style))
story.append(Paragraph("<b>2. Yasal İhbar Süreleri ve Kıdem Tazminatı Koşulları:</b><br/>"
                       "Belirsiz süreli iş sözleşmelerinin feshinden önce karşı tarafa bildirim yapılması gereken yasal süreler işçinin kıdemine göre değişir. Bu sürelere uymayan taraf 'İhbar Tazminatı' ödemekle yükümlüdür:", body_style))

# Re-insert Law Table
l_table_data = [
    [Paragraph("<b>Çalışma Süresi (Kıdem)</b>", table_header_style), Paragraph("<b>Bildirim Süresi (İhbar Süresi)</b>", table_header_style)],
    [Paragraph("6 aydan az", table_body_style), Paragraph("2 Hafta (14 gün)", table_body_style)],
    [Paragraph("6 ay - 1.5 yıl arası", table_body_style), Paragraph("4 Hafta (28 gün)", table_body_style)],
    [Paragraph("1.5 yıl - 3 yıl arası", table_body_style), Paragraph("6 Hafta (42 gün)", table_body_style)],
    [Paragraph("3 yıldan fazla", table_body_style), Paragraph("8 Hafta (56 gün)", table_body_style)]
]

l_table = Table(l_table_data, colWidths=[240, 240])
l_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e1e2e")),
    ('ALIGN', (0,0), (-1,-1), 'LEFT'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('BOTTOMPADDING', (0,0), (-1,0), 8),
    ('TOPPADDING', (0,0), (-1,0), 8),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
    ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#f8fafc")),
    ('PADDING', (0,1), (-1,-1), 8),
]))

story.append(l_table)
story.append(Spacer(1, 10))

story.append(Paragraph("<b>3. İşe İade Davası Koşulları ve Tazminat Hesapları:</b><br/>"
                       "İş sözleşmesi geçerli bir sebep gösterilmeden feshedilen işçi, fesih bildiriminin tebliğinden itibaren <b>1 ay içinde</b> işe iade davası açabilir. İşe iade davası açabilmek için işyerinde <b>en az 30 işçi</b> çalışıyor olması ve işçinin en az <b>6 aylık kıdeminin</b> bulunması şarttır.<br/>"
                       "• Davayı kazanan işçi, kararın kesinleşmesinden itibaren 10 iş günü içinde işverene işe başlamak için başvurmalıdır.<br/>"
                       "• İşveren, işçiyi başvurudan itibaren <b>1 ay içinde</b> işe başlatmak zorundadır.<br/>"
                       "• İşçiyi işe başlatmayan işveren, işçiye en az <b>4 aylık</b> ve en fazla <b>8 aylık</b> ücreti tutarında <b>işe başlatmama tazminatı</b> öder.<br/>"
                       "• Ayrıca mahkeme, boşta geçen süre için en çok <b>4 aya kadar</b> olan ücret ve diğer hakların ödenmesine karar verir.", body_style))
story.append(PageBreak())

# Yavuz Hoca Notes
story.append(Paragraph("Yavuz Hoca'nın Özel İSG Notları", toc_heading_style))
story.append(Paragraph("Hocamızın derslerde özellikle vurguladığı ve sınavda kesinlikle 1 adet soru olarak geleceğini belirttiği notlar şunlardır:<br/>"
                       "• <b>Gürültü Sınır Değerleri:</b> Maruziyet eylem değerleri ve maruziyet sınır değerleri kulak koruyucu kullanımı açısından hayati önem taşır. En yüksek maruziyet etkin eylem değeri <b>85 dB(A)</b>, günlük maruziyet sınır değeri ise <b>87 dB(A)</b> olarak belirlenmiştir.<br/>"
                       "• <b>Çalışma Yaşı Limitleri:</b> Çocuk ve genç işçilerin ağır ve tehlikeli işlerde çalıştırılması yasaktır. Temel eğitimini tamamlamış ve 15 yaşını doldurmuş çocuklar hafif işlerde çalıştırılabilir.<br/>"
                       "• <b>İlkyardımcı Sayısı Zorunluluğu:</b> İşyerlerinde tehlike sınıfına göre belirli sayıda ilkyardımcı bulunmalıdır. Az Tehlikeli işyerlerinde her 20 çalışan için 1, Tehlikeli işyerlerinde her 15 çalışan için 1, Çok Tehlikeli işyerlerinde her 10 çalışan için 1 ilkyardımcı bulundurulması yasal zorunluluktur.", body_style))
story.append(PageBreak())

# --- 4. QUESTIONS SECTION ---
story.append(Paragraph("BÖLÜM 2: DETAYLI AÇIKLAMALI SORU BANKASI", toc_section_style))
story.append(Spacer(1, 10))

for unit_title, q_list in grouped_questions.items():
    if not q_list:
        continue
    
    # Topic Header (Triggers TOC registration)
    story.append(Paragraph(unit_title, toc_heading_style))
    story.append(Spacer(1, 10))
    
    for i, q in enumerate(q_list):
        q_elements = []
        
        # Display Question Text
        q_label = f"Soru {i+1}: {q['question']}"
        q_elements.append(Paragraph(q_label, q_text_style))
        
        # Clean and expand choices to 5 options
        raw_choices = q["choices"]
        cleaned_choices = clean_choices(raw_choices)
        
        # Ensure exactly 5 choices (append Hiçbiri if 4)
        if len(cleaned_choices) < 5:
            while len(cleaned_choices) < 4:
                cleaned_choices.append("Diğer")
            cleaned_choices.append("Hiçbiri")
            
        cleaned_choices = cleaned_choices[:5]
        
        # Display Choices vertically (A to E)
        for idx, choice in enumerate(cleaned_choices):
            prefix = option_prefixes[idx]
            choice_text = f"{prefix}{choice}"
            q_elements.append(Paragraph(choice_text, choice_normal_style))
            
        # Display Correct Answer explicitly with a 2-3 line gap
        q_elements.append(Spacer(1, 25))
        correct_idx = q["answer"]
        if correct_idx >= len(cleaned_choices):
            correct_idx = 0
        
        correct_letter = option_prefixes[correct_idx].replace(") ", "")
        correct_answer_text = f"<b>✔ Doğru Cevap:</b> {correct_letter}) {cleaned_choices[correct_idx]}"
        q_elements.append(Paragraph(correct_answer_text, ans_style))
        
        # Display Explanation inside light gray box table
        exp_text = f"<b>Açıklama:</b> {q['explanation']}"
        exp_paragraph = Paragraph(exp_text, exp_style)
        
        exp_table = Table([[exp_paragraph]], colWidths=[480])
        exp_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
            ('PADDING', (0,0), (-1,-1), 8),
            ('LINELEFT', (0,0), (0,-1), 3, colors.HexColor("#89b4fa")),
        ]))
        
        q_elements.append(Spacer(1, 4))
        q_elements.append(exp_table)
        q_elements.append(Spacer(1, 14))
        
        story.append(KeepTogether(q_elements))

# Function to add page numbers
def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Arial", 9)
    canvas.setFillColor(colors.HexColor("#64748b"))
    page_num = canvas.getPageNumber()
    canvas.drawRightString(A4[0] - 40, 30, f"Sayfa {page_num}")
    canvas.drawString(40, 30, "İSG Final Sınavı Aşırı Detaylı Çalışma Kitapçığı")
    canvas.setStrokeColor(colors.HexColor("#cbd5e1"))
    canvas.line(40, 42, A4[0] - 40, 42)
    canvas.restoreState()

# Build PDF Document using multiBuild to dynamically render the Table of Contents
doc.multiBuild(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
print("Saved İSG final exam preparation booklet PDF successfully with dynamic Table of Contents!")
