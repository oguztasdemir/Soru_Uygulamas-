const studyNotesGAI = [
    {
        title: "Bölüm 1: Yapay Zekâya Giriş ve Temel Kavramlar",
        content: `
            <p><strong>Yapay Zekâ (Artificial Intelligence - AI),</strong> insan bilişsel işlevlerini (öğrenme, algılama, akıl yürütme, problem çözme ve karar verme) simüle eden yazılımsal ve donanımsal sistemlerin genel adıdır.</p>
            <p><strong>Tarihsel Gelişimi ve Dönüm Noktaları:</strong>
                <ul>
                    <li>1950'lerde Alan Turing'in "Makineler düşünebilir mi?" sorusu ve 1956 Dartmouth Konferansı ile yapay zekâ bağımsız bir araştırma alanı haline gelmiştir.</li>
                    <li>İlk chatbot, MIT (Massachusetts Institute of Technology) tarafından 1960'larda geliştirilen <strong>ELIZA</strong>'dır. ELIZA, kullanıcı girdilerini belirli kurallarla eşleyerek psikoterapist taklidi yapmaktaydı (Soru 120).</li>
                </ul>
            </p>
            <p><strong>Yapay Zekâ Kışları (AI Winters):</strong> Aşırı yüksek beklentilere karşılık donanımsal ve algoritmik yetersizlikler sebebiyle araştırmaların ve devlet desteklerinin askıya alındığı duraklama dönemleridir.
                <ul>
                    <li><strong>Birinci Yapay Zekâ Kışı (1970'ler):</strong> Sembolik yapay zekânın sınırlarının görülmesi ve ilk yapay sinir ağlarından Perceptron'un doğrusal olmayan temel problemleri (XOR gibi) çözemediğinin kanıtlanması sonucu yaşanmıştır (Soru 120-123).</li>
                    <li><strong>İkinci Yapay Zekâ Kışı (1980'lerin sonu):</strong> Endüstriyel alanda popüler olan "Uzman Sistemler" (Expert Systems) adlı kural tabanlı yazılımların aşırı yüksek bakım maliyetleri, esneklikten uzak olmaları ve dinamik durumlara uyum sağlayamamaları sebebiyle yaşanmıştır.</li>
                </ul>
            </p>
            <p><strong>Yapay Zekânın Hiyerarşik Yapısı ve Metotları:</strong>
                <ul>
                    <li><strong>Yapay Zekâ (AI):</strong> İnsan zekasını taklit etmeyi hedefleyen en genel bilişsel şemsiye alandır.</li>
                    <li><strong>Makine Öğrenmesi (ML):</strong> Verilerden örüntüler öğrenen matematiksel algoritmalar alt kümesidir.
                        <ul>
                            <li><em>Denetimli (Supervised):</em> Her girdinin (x) doğru bir hedef etiketi (y) bulunur. Sınıflandırma ve Regresyon görevlerini barındırır.</li>
                            <li><em>Denetimsiz (Unsupervised):</em> Veriler etiketsizdir. Verinin kendi benzerliklerinden gizli yapıları keşfeder (Kümeleme, Boyut İndirgeme).</li>
                            <li><em>Pekiştirmeli (Reinforcement):</em> Bir ajanın ödül/ceza sinyallerine göre deneme-yanılma yoluyla en yüksek kümülatif ödülü hedeflemesidir.</li>
                        </ul>
                    </li>
                    <li><strong>Derin Öğrenme (DL):</strong> Çok katmanlı yapay sinir ağlarıyla temsil özelliklerini ham veriden insan katkısı olmadan çıkaran özel ML dalıdır.</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 2: Üretken Yapay Zekâ (Generative AI) ve Çalışma Mantığı",
        content: `
            <p><strong>Ayrıştırıcı (Discriminative) vs Üretken (Generative) Modeller:</strong>
                <ul>
                    <li><strong>Ayrıştırıcı Modeller:</strong> Veriler arasındaki sınırları öğrenir ve girdileri sınıflandırır ($P(y|x)$). (Örn: Bir resmin kedi mi köpek mi olduğunu belirlemek).</li>
                    <li><strong>Üretken Modeller:</strong> Eğitildikleri veri kümesinin genel olasılık dağılımını ($P(x)$ veya $P(x,y)$) öğrenerek, bu dağılıma dayalı <strong>tamamen yeni, özgün ve gerçekçi içerikler</strong> (metin, resim, ses, video) üretir (Soru 70, 84).</li>
                </ul>
            </p>
            <p><strong>Üretken Sinir Ağı Mimarileri:</strong>
                <ul>
                    <li><strong>GAN (Generative Adversarial Networks - Üretken Çekişmeli Ağlar):</strong> İki sinir ağının birbiriyle yarışmasına dayanır. **Oluşturucu (Generator)** sahte veriler üreterek gerçekçiliği artırmaya çalışır; **Ayırt Edici (Discriminator)** ise gelen verinin gerçek mi yoksa oluşturucu tarafından üretilmiş sahte mi olduğunu denetler. İkisi arasındaki bu çekişmeli eğitim, modellerin aşırı gerçekçi veriler üretmesini sağlar (Soru 66).</li>
                    <li><strong>Difüzyon (Diffusion) Modelleri:</strong> İki aşamalı çalışır. İleri difüzyon aşamasında görsele aşamalı olarak rastgele Gauss gürültüsü eklenerek tamamen bozuluş sağlanır. Geri difüzyon (denoising) aşamasında ise sinir ağı, rastgele gürültüden aşama aşama gürültüyü temizleyerek **tamamen net, özgün görseller** üretmeyi öğrenir (Örn: Midjourney, Stable Diffusion, DALL-E) (Soru 74).
                        <br><em>Stable Diffusion Farkı:</em> Diğer ticari ve kapalı kodlu modellerin aksine, açık kaynak kodlu olması ve kullanıcıların kendi yerel donanımlarında çalıştırıp ince ayar yapabilmelerine olanak tanımasıyla ayrılır (Soru 53).
                        <br><em>Adobe Firefly Farkı:</em> Adobe Stock ve telif hakkı bulunmayan temiz görsellerle eğitildiğinden, profesyonel tasarımcılara **telif hakkı riski taşımayan** güvenli ticari çıktılar sunmasıyla öne çıkar (Soru 54, 63).
                    </li>
                </ul>
            </p>
            <p><strong>Transformer Mimarisi ve Dil Devrimi:</strong>
                <br>Üretken yapay zekada modern dönemi başlatan ve öz-dikkat (self-attention) mekanizmasını tanıtan dönüm noktası makale **"Attention Is All You Need"** **2017** yılında yayımlanmıştır (Soru 68). 
                <br>Transformer, RNN ve LSTM gibi eski mimarilerin sıralı (kelime kelime) çalışma darboğazını aşarak, veriler arasındaki ilişkileri **paralel olarak** aynı anda işler ve devasa eğitim hızları sunar (Soru 76).
                <ul>
                    <li><strong>Öz-Dikkat (Self-Attention):</strong> Cümledeki kelimelerin birbirleriyle olan anlamsal bağlarını **Query (Sorgu), Key (Anahtar) ve Value (Değer)** vektörleri aracılığıyla hesaplar. Böylece model, kelimenin cümlenin neresinde olduğuna bakmaksızın bağlamı kavrar (Soru 72).</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 3: İstem Mühendisliği (Prompt Engineering) Teknikleri",
        content: `
            <p><strong>İstem Mühendisliği:</strong> Yapay zeka ile olan metinsel etkileşimi rastgele denemelerden kurtarıp sistemli, öngörülebilir ve tekrarlanabilir bir disipline dönüştürme sürecidir (Soru 20, 80, 89).</p>
            <p><strong>Sistemik İstem Tasarımı Formülleri:</strong>
                <ul>
                    <li><strong>C.R.A.F.T.E.D. Formülü:</strong> Mükemmel istem inşası için kullanılan 7 temel bileşendir:
                        <br>1. **Character (Karakter):** Modele atanan rol veya persona (Örn: "Kıdemli Yazılım Mimarı gibi davran") (Soru 13, 24, 32).
                        <br>2. **Request (Görev):** Modelden beklenen temel eylem veya soru (Soru 6).
                        <br>3. **Action (Eylemler):** Görevi yerine getirirken izlemesi gereken adım adım yönergeler (Soru 22).
                        <br>4. **Focus (Bağlam):** Konunun sınırları ve arka plan detayları (Soru 5).
                        <br>5. **Type (Biçim/Format):** Çıktının yapısı (tablo, liste, kod bloğu vb.) (Soru 14, 31).
                        <br>6. **Extra Info (Bilgi Havuzu):** Gem veya Custom GPT'lere yüklenen harici bilgi tabanı.
                        <br>7. **Do's and Dont's (Kurallar):** Modelin kesinlikle uyması gereken kısıtlamalar (Soru 6).
                    </li>
                    <li><strong>C.L.E.A.R. Kalite Kontrol Listesi:</strong> Üretilen çıktıyı denetlemek ve istemi rafine etmek için kullanılır (Soru 29, 38).
                        <br>*Explicit (Açık)* kriteri çıktı sınırlandırma komutlarının yoruma açık olmayacak şekilde net ve ölçülebilir olmasını ifade eder (Örn: "Kısa yaz" yerine "50 kelimeyi geçme") (Soru 23, 36).
                    </li>
                </ul>
            </p>
            <p><strong>İleri Düzey İstemleme Teknikleri:</strong>
                <ul>
                    <li><strong>Zero-Shot (Sıfır Örnekli):</strong> Modele daha önce hiç örnek göstermeden doğrudan talimatı çözmesini beklemektir (Soru 86).</li>
                    <li><strong>Few-Shot (Az Örnekli):</strong> Modele ne yapacağını sadece tarif etmek yerine, girdilerin ve istenen çıktıların birkaç somut örneğini göstererek ton ve format uyumunu artırma tekniğidir (Soru 26, 33).</li>
                    <li><strong>Düşünce Zinciri (Chain-of-Thought - CoT):</strong> Modelin karmaşık mantıksal veya matematiksel problemleri çözerken ara adımları ve mantık silsilesini takip edebilmesi için **"Adım adım düşün"** sihirli komutuyla akıl yürütmesini sağlamaktır (Soru 25, 34, 65).</li>
                    <li><strong>Self-Consistency (Öz-Tutarlılık):</strong> Modelin aynı soruya birden fazla farklı CoT akıl yürütme yoluyla yanıtlar üretip, aralarından en tutarlı ve en çok tekrarlanan yanıtı seçerek doğruluk oranını artırmasıdır (Soru 28, 39).</li>
                    <li><strong>Chunking (Parçalara Bölme):</strong> Çok büyük veya karmaşık görevlerin tek seferde verilip modelin bağlam sınırlarını zorlayarak sığ/eksik yanıtlar üretmesini (Darboğaz) önlemek amacıyla görevi küçük parçalara bölme işlemidir (Soru 27, 35).</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 4: Gelişmiş Mimariler ve Yapay Zekâ Araçları",
        content: `
            <p><strong>RAG Mimarisi (Retrieval-Augmented Generation - Arama Destekli Üretim):</strong> 
            Dil modelleri eğitildikleri tarihe kadar olan bilgileri bilirler. RAG, dil modeline bir dış bilgi kaynağı entegre ederek (genellikle metinlerin yüksek boyutlu sayısal vektörlere dönüştürülüp vektör veritabanlarında saklandığı yapı), sorulan soruyla ilgili güncel belgeleri dinamik olarak getirir ve modele bağlam olarak sunar. Böylece model güncel verilere erişir ve **halüsinasyon riski sıfıra yakın** çıktılar üretir (Soru 88, 92).</p>
            <p><strong>Özel Yapay Zekâ Asistan Platformları:</strong>
                <ul>
                    <li><strong>OpenAI Custom GPTs:</strong> Harici API entegrasyonu (Actions) sunması ve şirket içi/ekip içi paylaşım kolaylıkları sayesinde startup ekiplerinin entegrasyonları için çok elverişlidir. Mayıs 2024 itibarıyla Custom GPT'leri kullanmak ücretsiz üyeler için de aktifleştirilmiştir (Soru 4, 7).</li>
                    <li><strong>Google Gemini Gems:</strong> Google Workspace (Google Drive, Gmail, Docs) araçlarıyla yerleşik entegrasyona sahiptir (Örn: Drive'daki notlara doğrudan erişip özet çıkarma) (Soru 2, 10). 1 Milyon tokenlik devasa bağlam (context) penceresi sayesinde çok büyük miktarda veriyi tek seferde analiz edebilir (Soru 5).</li>
                    <li><strong>Claude Projects:</strong> Projeler yalnızca organizasyon (Team) içindeki diğer kullanıcılarla paylaşılabilir, genel kullanıma açık bir pazaryeri (marketplace) bulunmamaktadır (Soru 9).</li>
                </ul>
            </p>
            <p><strong>Model Özelleştirme Stratejileri Karşılaştırması:</strong>
                <ul>
                    <li><strong>Prompting (İstemleme):</strong> Sıfır eğitim maliyeti, düşük doğruluk, bağlam penceresiyle sınırlı.</li>
                    <li><strong>RAG (Arama Destekli):</strong> Düşük maliyet, yüksek güncellik, harici belgelerle sınırlandırılmış bilgi doğruluğu.</li>
                    <li><strong>Fine-Tuning (İnce Ayar):</strong> Yüksek eğitim maliyeti, önceden eğitilmiş genel yetenekli bir modele sektörel veya özel görevlerde uzmanlık kazandırmak için ek verilerle eğitilmesi sürecidir (Soru 77).</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 5: Etik, Hukuk, Güvenlik ve Regülasyonlar",
        content: `
            <p><strong>Halüsinasyon (Uydurma):</strong> Modellerin uydurma ve yanlış bilgileri son derece ikna edici ve akıcı bir üslupla üretmesi durumudur. Akademik çalışmalarda yapay zekanın ürettiği kaynakçaların hatalı olma riski **%30 civarındadır**; bu yüzden kaynakçadaki her referans manuel olarak doğrulanmalıdır (Soru 44, 48, 62, 98).</p>
            <p><strong>Akademik Etik Kuralları:</strong>
                <ul>
                    <li>Yapay zeka ortak yazarlık kriterlerini (fikri katkı sağlama ve yasal/entelektüel sorumluluk üstlenme) karşılayamadığı için bilimsel yayınlarda **yazar (co-author) olarak listelenemez** (Soru 42, 45).</li>
                    <li>Her türlü bilimsel hata, intihal veya yanlış beyandan doğacak sorumluluk doğrudan **insan araştırmacıya (aracın kendisine) aittir** (Soru 42, 61).</li>
                    <li>Şeffaflık (Transparency) ilkesi gereği, bilimsel çalışmalarda kullanılan yapay zeka aracının adı, sürüm bilgisi ve tam olarak hangi amaçla kullanıldığı metodoloji bölümünde **açıkça belirtilmelidir** (Soru 43, 60).</li>
                    <li>Yapay zeka kullanıldığını saklamak/gizlemek ciddi bir akademik etik ihlali ve suçtur (Soru 49).</li>
                </ul>
            </p>
            <p><strong>Veri Gizliliği ve Siber Tehditler:</strong>
                <ul>
                    <li>Katılımcı verilerinin veya hassas kurumsal verilerin yapay zekaya yüklenip işlenmesinden önce mutlaka **anonimleştirilmesi** (kimlik bilgilerinden arındırılması) gerekir (Soru 46, 69).</li>
                    <li><strong>Prompt Injection (İstem Enjeksiyonu):</strong> Üçüncü taraf veya kullanıcı girdileriyle modelin orijinal sistem talimatlarının sabote edilip devre dışı bırakılmasıdır.</li>
                    <li><strong>Jailbreaking (Sınırları Aşma):</strong> Özel olarak tasarlanmış istemlerle modelin güvenlik filtrelerini aşarak, modelin zararlı, yasa dışı veya etik dışı çıktılar üretmeye zorlanmasıdır.</li>
                </ul>
            </p>
        `
    }
];
