const studyNotesML = [
    {
        title: "Bölüm 1: Makine Öğrenmesi Temelleri & Öğrenme Biçimleri",
        content: `
            <p><strong>Makine Öğrenmesi (ML),</strong> verileri analiz ederek açık kurallar yazılmadan örüntüleri öğrenen algoritmaların bütünüdür. 3 ana öğrenme yöntemine ayrılır:</p>
            <ul>
                <li><strong>Denetimli Öğrenme (Supervised):</strong> Girdiler ($x$) ve karşılık gelen doğru etiketler ($y$) eşlidir. Model $f(x) \approx y$ fonksiyonunu öğrenir. Çıktı kategorikse <strong>Sınıflandırma (Classification)</strong>, sürekli sayısal değerse <strong>Regresyon (Regression)</strong> olarak adlandırılır (Soru 1, 2, 70).
                    <br><em>Önemli İpucu:</em> Konut fiyat tahmini regresyondur, e-postanın spam olup olmadığını bulmak sınıflandırmadır.
                </li>
                <li><strong>Denetimsiz Öğrenme (Unsupervised):</strong> Veride etiket yoktur. Algoritma verinin kendi içindeki benzerliklere dayanarak gizli örüntüleri gruplar (Örn: Kümeleme, Boyut İndirgeme) (Soru 2, 50).
                    <br><em>Önemli İpucu:</em> Müşteri segmentasyonu denetimsizdir; çünkü kimin hangi grupta olduğu önceden bilinmez.
                </li>
                <li><strong>Pekiştirmeli Öğrenme (Reinforcement):</strong> Ajanın bir ortamda aldığı ödül (reward) veya ceza (penalty) sinyallerine göre en doğru davranış stratejisini (policy) deneme-yanılma yoluyla öğrenmesidir.
                </li>
            </ul>
            <p><strong>Adam (Adaptive Moment Estimation) Optimizer:</strong> SGD (Stochastic Gradient Descent) ile Momentum ve RMSProp optimizasyon tekniklerinin bir sentezidir. Ağırlıkların gradyan yönündeki değişimlerini takip ederek her bir ağırlık parametresi için bağımsız ve adaptif öğrenme oranları hesaplar. Bu sayede kararlı ve hızlı bir öğrenme döngüsü sağlar (Soru 2).</p>
            <p><strong>Gradyan İnişi (Gradient Descent):</strong> Model parametrelerini (ağırlıklarını) hatayı en aza indirmek için adım adım güncelleyen optimizasyon algoritmasıdır. Güncelleme formülü: $w_{next} = w - \alpha \cdot \nabla L(w)$'dir. Burada yer alan <strong>Öğrenme Oranı (&alpha;)</strong> adımların büyüklüğünü (adım boyunu) belirleyen hiperparametredir (Soru 28, 29).</p>
        `
    },
    {
        title: "Bölüm 2: Uyum Problemleri (Bias-Variance Trade-off)",
        content: `
            <p>Bir modelin tahmin hataları üç bileşenden oluşur: **Sapma (Bias) Hatası**, **Varyans (Variance) Hatası** ve model iyileştirilerek azaltılamayan, verinin doğasından kaynaklanan **İndirgenemez Hata (&sigma;²)** (Soru 50).</p>
            <ul>
                <li><strong>Aşırı Uyum / Aşırı Öğrenme (Overfitting):</strong> Model, eğitim verisindeki gürültüleri ve rastgele dalgalanmaları ezberler. Eğitim hatası sıfıra yakınken, test (yeni) verisindeki hata çok yüksektir. **Düşük Yanlılık (Bias), Yüksek Varyans (Variance)** durumudur (Soru 8, 33, 56).
                    <br><em>Engelleme Yöntemleri:</em> Karar ağaçlarında gereksiz dalları kesmek (**Budama/Pruning**), yapay sinir ağlarında düğümleri rastgele kapatmak (**Dropout**), model katsayılarını sınırlamak (**Düzenlileştirme/L1-L2**) veya eğitim verisini artırmaktır (Soru 20, 97).
                </li>
                <li><strong>Yetersiz Uyum / Eksik Öğrenme (Underfitting):</strong> Model verideki temel ilişkileri ve örüntüyü kavrayamayacak kadar basittir. Hem eğitim hem test kümesinde başarısızdır. **Yüksek Yanlılık, Düşük Varyans** durumudur (Soru 53).
                    <br><em>Çözüm Yöntemleri:</em> Model karmaşıklığını (esnekliğini) artırmak, daha güçlü algoritmalar seçmek veya daha fazla açıklayıcı özellik (feature) eklemektir.
                </li>
            </ul>
        `
    },
    {
        title: "Bölüm 3: Ön İşleme, Özellik Seçimi & Mesafe Ölçütleri",
        content: `
            <p>Mesafe tabanlı çalışan modellerde (k-NN, K-Means) özelliklerin ölçeklerinin birbirine yakın olması kritik öneme sahiptir. Aksi halde, sayısal aralığı büyük olan özellik varyans hesaplamasını domine eder. Bunu önlemek için <strong>Z-Score Ölçekleme</strong> kullanılır (Ortalamayı 0, standart sapmayı 1 yapar: $z = \frac{x - \mu}{\sigma}$) (Soru 94).</p>
            <p><strong>Özellik Seçimi (Feature Selection) Yöntemleri:</strong>
                <ul>
                    <li><strong>Filtre (Filter) Yöntemleri:</strong> Model eğitiminden bağımsız olarak, sadece verinin istatistiksel özelliklerine dayanarak özellik seçer. Çok hızlı ve hesaplama maliyeti düşüktür (ANOVA F-Testi, Pearson Korelasyonu, Mutual Information) (Soru 81).
                        <br><em>ANOVA F-Testi:</em> Sınıflar arası varyansın sınıf içi varyansa oranıdır. Yüksek F değeri, özelliğin sınıfları ayırt etmede güçlü olduğunu gösterir (Soru 83).
                    </li>
                    <li><strong>Sarma (Wrapper) Yöntemleri:</strong> Farklı özellik kombinasyonlarını model üzerinde eğitip performansa göre karar verir (RFE - Öz yinelemeli eleme, Forward/Backward selection). Pahalıdır ama doğruluk yüksektir (Soru 84, 87).
                    </li>
                    <li><strong>Gömülü (Embedded) Yöntemler:</strong> Özellik seçimi eğitim aşamasının içinde gerçekleşir (Lasso L1 Düzenlileştirmesi gibi katsayıları sıfıra çeken yapılar).
                    </li>
                </ul>
            </p>
            <p><strong>Matematiksel Metrik / Mesafe Koşulları:</strong> Bir fonksiyonun metrik sayılabilmesi için negatif olmama, simetri ve <strong>Üçgen Eşitsizliği</strong> ($d(x,y) \leq d(x,z) + d(z,y)$) kurallarını sağlaması zorunludur (Soru 52).</p>
            <ul>
                <li><strong>Öklid Mesafesi:</strong> İki nokta arasındaki en kısa, doğrusal çizgiyi ölçer (Soru 4, 34, 51).</li>
                <li><strong>Manhattan ($L_1$) Mesafesi:</strong> Yüksek boyutlu veya seyrek (sparse) verilerde Öklid mesafesine kıyasla boyutun olumsuz etkilerine karşı çok daha kararlı ve dirençlidir (Soru 57).</li>
                <li><strong>Kosinüs Benzerliği:</strong> Vektörlerin uzunluklarından tamamen bağımsız olup, sadece yönsel benzerliklerini (aralarındaki açıyı) ölçer (Soru 54).</li>
                <li><strong>Jaccard Benzerliği:</strong> İki kümenin örtüşme miktarını ölçer ($J(A,B) = \frac{|A \cap B|}{|A \cup B|}$) (Soru 59).</li>
            </ul>
        `
    },
    {
        title: "Bölüm 4: Regresyon Analizi & Performans Metrikleri",
        content: `
            <p><strong>OLS (En Küçük Kareler - Ordinary Least Squares):</strong> Gerçek değerler ile tahmin edilen değerler arasındaki artıkların (hataların) kareleri toplamını (SSE) en aza indiren doğrusal regresyon parametre bulma yöntemidir. Katsayı matrisi analitik çözümü: $\beta = (X^T X)^{-1} X^T y$ şeklindedir. Tersi alınabilir olması için $X^T X$ matrisinin rütbesi tam (full rank) olmalıdır (Soru 60).</p>
            <p><strong>Düzenlileştirme (Regularization) Cezaları:</strong>
                <ul>
                    <li><strong>Lasso Regresyon (L1):</strong> Hata fonksiyonuna katsayıların mutlak değerini ekler ($\\lambda \\cdot \sum |w_j|$). Alakasız özelliklerin katsayılarını tam olarak **sıfıra eşitleyerek** özellik seçimi yapabilir (Soru 61, 85).</li>
                    <li><strong>Ridge Regresyon (L2):</strong> Hata fonksiyonuna katsayıların karesini ekler ($\\lambda \\cdot \sum w_j^2$). Katsayıları sıfıra yaklaştırır ama tam sıfır yapmaz (overfitting'i engeller) (Soru 61, 63).</li>
                </ul>
            </p>
            <p><strong>Performans Değerlendirme Metrikleri:</strong>
                <ul>
                    <li><strong>R-Kare ($R^2$):</strong> Bağımsız değişkenlerin hedef değişkendeki değişkenliği (varyansı) açıklama oranını gösterir (Soru 66).</li>
                    <li><strong>Düzeltilmiş R-Kare (Adjusted $R^2$):</strong> Modele eklenen alakasız değişkenleri cezalandırır. Sadece modele gerçekten bilgi katan değişkenler eklendiğinde yükselir; gürültü özellikler eklendiğinde ise düşer (Soru 67).</li>
                    <li><strong>MAE (Ortalama Mutlak Hata):</strong> Hataların mutlak değerini alır. Aykırı değerlerin (outliers) yoğun olduğu veri setlerinde karesel cezalandırma yapmadığı için daha kararlıdır (Soru 61).</li>
                    <li><strong>MSE (Ortalama Kare Hata):</strong> Hataların karesini alır. Büyük sapmaları çok sert cezalandırır. Matematiksel olarak türetilebilir (differentiable) olduğu için optimizasyon algoritmalarında (Gradient Descent) yaygın olarak tercih edilir (Soru 19, 62).</li>
                    <li><strong>RMSE (Kök Ortalama Kare Hata):</strong> MSE'nin kareköküdür. Hata birimini hedef değişkenin orijinal birimine (TL, Derece vb.) döndürerek yorumlama kolaylığı sağlar (Soru 68).</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 5: Sınıflandırma Modelleri & Topluluk Yöntemleri",
        content: `
            <p>Sınıflandırma modelleri girdileri önceden belirlenmiş sınıflara atama işlevini yürütür (Soru 70).</p>
            <ul>
                <li><strong>Lojistik Regresyon:</strong> Doğrusal kombinasyonun çıktısını $0$ ile $1$ arasında bir sınıf olasılığına sıkıştırmak için **Sigmoid Fonksiyonunu** ($\\sigma(z) = \frac{1}{1+e^{-z}}$) kullanır (Soru 13, 26). **Log-Odds (Lojit)** dönüşümü, kısıtlı olasılık uzayını doğrusal modellerin çalışabileceği sınırsız reel sayı uzayına ($-\infty, +\infty$) haritalar (Soru 64).</li>
                <li><strong>k-En Yakın Komşu (k-NN):</strong> Eğitim aşamasında hesaplama yapmayan, tüm aramayı tahmin anında yapan tembel (lazy) sınıflandırıcıdır (Soru 36). Komşu sayısı $k$ çok küçükse model verideki gürültülere aşırı duyarlı hale gelerek overfitting/yüksek varyans yaşar (Soru 12, 38).</li>
                <li><strong>Destek Vektör Makineleri (SVM):</strong> Karar sınırına (hiperdüzleme) en yakın veri noktalarına **Destek Vektörleri (Support Vectors)** denir (Soru 6). SVM, sınıflar arasındaki bu boşluğu (**margin**) maksimize etmeye odaklanır (Soru 17, 18). **Kernel Trick**, doğrusal ayrılamayan verileri yüksek boyutlu uzaya taşıyarak doğrusal olarak ayrılabilir kılma yöntemidir (Soru 28).</li>
                <li><strong>Naive Bayes:</strong> Hesaplamayı kolaylaştırmak için özelliklerin sınıfa göre birbirinden tamamen **bağımsız olduğunu** varsayar (Soru 14).</li>
                <li><strong>Topluluk (Ensemble) Modelleri:</strong>
                    <ul>
                        <li><strong>Random Forest (Bagging):</strong> Orijinal veri kümesinden yerine koyarak (**with replacement**) çekilen bootstrap alt kümelerinde çok sayıda karar ağacını paralel olarak eğitir ve sonuçları oylar. Varyansı azaltır (Soru 7, 38).</li>
                        <li><strong>Gradient Boosting (Boosting):</strong> Ağaçları paralel değil, **sıralı (ardışıl)** olarak eğitir. Her yeni ağaç, bir önceki ağacın yaptığı hataları (artıkları - residuals) azaltacak şekilde kurulur. Yanlılığı azaltır (Soru 15, 15, 27).</li>
                    </ul>
                </li>
            </ul>
        `
    },
    {
        title: "Bölüm 6: Kümeleme Analizi (Denetimsiz Öğrenme)",
        content: `
            <p>Etiketsiz verileri kendi içlerindeki benzerlik ve yoğunluklarına göre gruplama sürecidir (Soru 49).</p>
            <ul>
                <li><strong>K-Means (K-Ortalamalar):</strong> Küme içi varyasyonu yani **Inertia (Atalet)** değerini minimize etmeyi hedefler. Optimal küme sayısı olan $K$ değerini belirlemek için toplam hata düşüşünün yavaşladığı kırılma noktasını bulmaya yarayan **Dirsek (Elbow) Yöntemi** kullanılır (Soru 24, 39, 40).</li>
                <li><strong>DBSCAN:</strong> Yoğunluk tabanlı kümelemedir. K-Means'in aksine küme sayısını önceden bilmeye gerek duymaz. Dairesel olmayan, karmaşık şekilli küme yapılarını kolayca tespit edebilir ve yoğunluk dışındaki seyrek noktaları **gürültü (noise/aykırı değer)** olarak işaretleyip eler (Soru 16, 30).</li>
                <li><strong>Hiyerarşik Kümeleme:</strong> Verileri aşağıdan yukarıya veya yukarıdan aşağıya doğru birleştirerek ağaç yapısında sunan yöntemdir. Bu ağaç diyagramına **Dendrogram** denir (Soru 17, 31).
                    <ul>
                        <li><em>Single (Tekil) Linkage:</em> İki küme arasındaki mesafeyi, bu kümelerin elemanları arasındaki **en kısa** mesafe olarak tanımlar (Soru 32, 33).</li>
                        <li><em>Complete (Tam) Linkage:</em> İki küme arasındaki mesafeyi, bu kümelerin elemanları arasındaki **en uzun** mesafe olarak tanımlar (Soru 30).</li>
                    </ul>
                </li>
                <li><strong>GMM & EM:</strong> Gauss Karışım Modelleri, Expectation-Maximization adımlarıyla olasılıksal/yumuşak (soft clustering) kümeleme kararları üretir (Soru 23).</li>
            </ul>
        `
    },
    {
        title: "Bölüm 7: Boyut İndirgeme (Dimensionality Reduction)",
        content: `
            <p>Yüksek boyutlu verilerde veri noktaları arasındaki mesafeler birbirine çok benzer hale gelir, yakınlık kavramı anlamını yitirir ve arama/eğitim imkansızlaşır. Buna **Boyutluluğun Laneti (Curse of Dimensionality)** denir (Soru 13, 14, 80). Boyut indirgeme bu laneti aşar ve gürültüyü azaltarak sinyal/gürültü oranını artırır (Soru 9).</p>
            <ul>
                <li><strong>PCA (Temel Bileşen Analizi):</strong> Denetimsizdir. Verideki **maksimum varyansı (bilgiyi)** koruyacak şekilde birbirine dik (ortogonal) yeni yapay bileşenler üretir. Projeksiyon doğrultusunu kovaryans matrisinin **özvektörleri** belirler, özdeğerler ise bu yönün önem derecesini gösterir (Soru 10, 11, 23).</li>
                <li><strong>LDA (Doğrusal Diskriminant Analizi):</strong> Sınıfları birbirinden olabildiğince uzaklaştırmak için sınıf etiketlerini kullanan **denetimli** bir boyut indirgeme yöntemidir. En fazla sınıf sayısı eksi bir ($K-1$) kadar bileşen üretebilir (Soru 18, 22, 58, 59).</li>
                <li><strong>Autoencoder:</strong> Ortadaki gizli katmanda bir darboğaz (**bottleneck**) oluşturarak verinin sıkıştırılmış temsilini ($z$) öğrenen çok katmanlı yapay sinir ağı mimarisidir (Soru 76, 77).</li>
            </ul>
        `
    },
    {
        title: "Bölüm 8: Derin Öğrenme & Yapay Sinir Ağları",
        content: `
            <p>Çok katmanlı yapay sinir ağlarını kullanarak ham veriden hiyerarşik özellik çıkaran modeller disiplinidir.</p>
            <ul>
                <li><strong>Perceptron (Nöron):</strong> Ağırlıklarla girdileri çarpıp toplayan, eşik değeri (bias) ekleyen ve aktivasyon fonksiyonundan geçirerek çıktı üreten en temel işlem birimidir (Soru 9). Doğrusal regresyonun çözemediği **XOR Paradoksu** gibi doğrusal olmayan problemleri çözmek için araya gizli katmanlar (MLP - Multi-layer Perceptron) eklenmelidir (Soru 21, 24).</li>
                <li><strong>Geri Yayılım (Backpropagation):</strong> Çıkış katmanında hesaplanan hata payının, **Zincir Kuralı (Chain Rule)** yardımıyla katmanlar boyunca geriye doğru dağıtılarak ağırlık gradyanlarının hesaplanması ve güncellenmesi sürecidir (Soru 4, 25).</li>
                <li><strong>Aktivasyon Fonksiyonları:</strong> Doğrusal olmayan ilişkileri modele ekler.
                    <ul>
                        <li><em>ReLU ($max(0,z)$):</em> Hesaplama maliyeti çok düşüktür ve eğitimi hızlandırır.</li>
                        <li><em>Sigmoid:</em> Derin ağlarda türevi sıfıra yaklaştığı için **Gradyan Kaybolması (Vanishing Gradient)** problemine ve öğrenmenin durmasına yol açar (Soru 95, 98).</li>
                    </ul>
                </li>
                <li><strong>Batch Normalization:</strong> Mini-batch girdilerini her katman öncesinde normalize ederek gradyan sorunlarını azaltır ve eğitimi büyük ölçüde hızlandırır (Soru 5, 96).</li>
            </ul>
        `
    },
    {
        title: "Bölüm 9: Model Doğrulama, Optimizasyon & Metrik Analizi",
        content: `
            <p>Modelin gerçek hayattaki başarısını tarafsız bir şekilde ölçebilmek için doğrulama stratejileri uygulanır.</p>
            <ul>
                <li><strong>Hiperparametre Arama Yöntemleri:</strong>
                    <ul>
                        <li><em>Grid Search (Izgara Araması):</em> Belirlenen hiperparametre aralığındaki tüm kombinasyonları brute-force ile tarar. Seviye ($L$) ve faktör ($F$) sayısı arttıkça maliyet üstel olarak $O(L^F)$ şeklinde artar (Soru 46, 51).</li>
                        <li><em>Random Search (Rastgele Arama):</em> Parametre uzayından rastgele seçimler yapar. Yüksek boyutlarda önemli parametreler üzerinde daha fazla benzersiz değer denediği için daha başarılıdır (Soru 44, 55).</li>
                        <li><em>Bayesyen Optimizasyon:</em> Rastgele aramak yerine, geçmiş denemelerin sonuçlarından olasılıksal bir model (surrogate model) kurarak bir sonraki en iyi noktayı tahmin eder (Soru 45).</li>
                    </ul>
                </li>
                <li><strong>Sınıflandırma Metrikleri & Confusion Matrix:</strong>
                    <ul>
                        <li><em>Accuracy (Doğruluk):</em> Dengesiz veri setlerinde (örn: %99 Sağlıklı, %1 Hasta) hiçbir hastayı bulamayan modeli dahi %99 başarılı göstereceği için en az güvenilir metriktir (Soru 65, 75).</li>
                        <li><em>F1-Skoru:</em> Kesinlik (Precision) ve Duyarlılığın (Recall) harmonik ortalamasıdır. İkisinden biri çok düşükse skoru aşağı çeker (Soru 44, 76).</li>
                        <li><em>Tip I Hata (Yalancı Alarm):</em> Gerçekte negatif olan bir durumun pozitif tahmin edilmesidir (Soru 72).</li>
                        <li><em>Tip II Hata (Kaçırılan Tehlike):</em> Gerçekte pozitif olan durumun negatif tahmin edilerek gözden kaçırılmasıdır (Soru 39).</li>
                    </ul>
                </li>
            </ul>
        `
    }
];
