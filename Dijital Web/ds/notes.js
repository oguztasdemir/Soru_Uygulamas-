const studyNotesDS = [
    {
        title: "Bölüm 1: Dijital Dönüşüm ve Dijitalleşmeye Giriş",
        content: `
            <p><strong>Dijital Dönüşüm (Digital Transformation),</strong> küreselleşme, artan rekabet ve hızla değişen müşteri beklentilerine yanıt olarak, iş süreçlerinin dijital teknolojilerle yeniden tasarlanmasıdır. Bu süreç sadece bir teknoloji entegrasyonu değil; kültür, süreç ve iş modeli değişimidir.</p>
            <p><strong>Dijital Dönüşümün Nedenleri:</strong>
                <ul>
                    <li>Küreselleşme ve artan müşteri talepleri, esnek ve hızlı olma ihtiyacı.</li>
                    <li>Mevcut sektörel sınırların bulanıklaşması ve inovasyona dayalı rekabet.</li>
                    <li>Mevcut yeterlilikler üzerindeki <strong>"yaratıcı yıkım" (creative destruction)</strong> etkisi (Schumpeter'in kavramı).</li>
                    <li>Düşük kâr marjları ve karmaşıklaşan yönetim kararları.</li>
                </ul>
            </p>
            <p><strong>Toplumun Gelişim Evreleri ve Krizler:</strong>
                <ul>
                    <li><strong>İlkel Toplum:</strong> Doğal kaynakların kullanımına bağımlıydı. Doğal kaynakların azalması krize neden olmuş ve bu da Tarım Devrimi'ni tetiklemiştir.</li>
                    <li><strong>Tarım Toplumu:</strong> Yerleşik yaşam ve tarım arazilerinin bakımı önem kazanmıştır. Arazilerin kıtlığı ve verim arayışı Sanayi Devrimi'ni tetiklemiştir.</li>
                    <li><strong>Sanayi Toplumu:</strong> Seri üretim, standart (tek tip) üretim ve makineleşme bu dönemin temel özellikleridir. Pazarda doygunluk Bilgi Toplumu'nu tetiklemiştir.</li>
                    <li><strong>Bilgi Toplumu:</strong> Teknoloji, bilgisayar destekli üretim (CAD/CAM) ve küreselleşme ön plandadır. Ürün ve hizmetlerin <strong>toplu olarak kişiselleştirilmesi (mass customization)</strong> esastır.</li>
                </ul>
            </p>
            <p><strong>Dijital Dönüşümün Dört İlkesi (4C):</strong>
                <ul>
                    <li><strong>Connection (Bağlantı):</strong> Verilerin ve sistemlerin birbirine bağlanması.</li>
                    <li><strong>Coordination (Koordinasyon):</strong> Süreçlerin entegre çalışması.</li>
                    <li><strong>Collaboration (İş Birliği):</strong> Departmanlar ve ekosistemler arası ortaklık.</li>
                    <li><strong>Commerce (Ticaret/İş Modeli):</strong> Dijital değer üretimi ve gelir modelleri.</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 2: Sayısallaştırma, Dijitalleşme ve Dijital Dönüşüm Tarihçesi",
        content: `
            <p>Dijital dönüşüm süreci üç aşamalı bir kavramsal hiyerarşiye sahiptir:</p>
            <ul>
                <li><strong>Sayısallaştırma (Digitization):</strong> Fiziksel haldeki bilginin dijital forma dönüştürülmesidir. Bilgisayar tarafından kullanılabilir hale getirme sürecidir.
                    <br><em>Örnekler:</em> Kağıt belgeyi tarayıp PDF yapmak, kağıt notları Excel'e girmek, analog VHS kasetleri DVD'ye kaydetmek.
                </li>
                <li><strong>Dijitalleşme (Digitalization):</strong> Sayısallaştırılmış bilginin iş süreçlerini iyileştirmek ve otomatikleştirmek için kullanılmasıdır. Verinin gelir yaratmasını sağlar.
                    <br><em>Örnekler:</em> PDF'i buluta yükleyip analiz için paylaşmak, Excel'i buluttaki Google E-Tablolar'a dönüştürmek, filmleri çevrimiçi (online) yayınlamak.
                </li>
                <li><strong>Dijital Dönüşüm (Digital Transformation):</strong> Dijital teknolojilerin ve verilerin entegrasyonu ile iş modellerinin, kültürün ve operasyonların kökten değişmesidir.
                    <br><em>Örnekler:</em> Çevrimiçi yayıncılıktan elde edilen verilerle kişiselleştirilmiş film önerileri sunarak yeni bir iş modeli kurmak.
                </li>
            </ul>
            <p><strong>Sanayi 4.0 (Dördüncü Sanayi Devrimi):</strong> Veri ve bilgiye bağımlı olan, siber-fiziksel sistemler üzerine kurulu devrimdir. Dalenogare vd. (2018) çalışmasına göre 5 temel sütundan biri **Simülasyonlar/Sanal Modellerin Analizi**dir. Temel bileşenleri:
                <ul>
                    <li>Endüstriyel İnternet (IoT), Kablosuz Sensör Ağları.</li>
                    <li>Büyük veri toplama ve analizi, Bulut bilişim.</li>
                    <li>Üretim Yönetim Sistemleri (MES) ve SCADA entegrasyonu.</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 3: Dijital Olgunluk Modelleri",
        content: `
            <p><strong>Olgunluk Modelleri,</strong> bir kuruluşun yeteneklerinin öngörülen, istenen veya mantıklı bir süreç sonucunda nasıl geliştiğini görmeye yardımcı olan yaklaşımlardır.</p>
            <p><strong>PUKÖ Döngüsü (Planla-Uygula-Kontrol Et-Önlem Al):</strong> Deming (2018) tarafından tanımlanan Kalite Yönetim Sistemi olup, çoğu olgunluk modelinin temelini oluşturur.</p>
            <p><strong>Dijital Olgunluk Tanımları:</strong>
                <ul>
                    <li><strong>Paulk ve ark. (1993):</strong> Kuruluşların yazılım yeteneklerini ve geliştirme süreçlerini iyileştiren aşamalı çerçeve.</li>
                    <li><strong>Klimko (2001):</strong> Bir işletmedeki bir varlığın (fiziki veya örgütsel işlev) zaman içindeki gelişim süreci.</li>
                    <li><strong>Pullen (2007):</strong> Gelişim sürecinin farklı aşamalarındaki etkili işlemlerin özelliklerini tanımlayan yapılandırılmış öğeler koleksiyonu.</li>
                </ul>
            </p>
            <p><strong>IBM Dijital Olgunluk Modeli (Berman ve Bell, 2011):</strong>
                <ul>
                    <li><strong>Analitik Görü:</strong> Kestirimci tahmine ve ileri düzey veri analizine dayalı bilgi üretimi.</li>
                    <li><strong>Süreç Entegrasyonu:</strong> Dijital olanaklarla süreçlerin optimize edilip şirketler arasında entegre edilmesi.</li>
                    <li><strong>İş Modeli İnovasyonu:</strong> Müşteri değerini temel alan yeni kurumsal iş modellerinin tasarlanması.</li>
                    <li><strong>Müşteri ve Toplum İş Birliği:</strong> Müşteri odaklılığın tüm bölümlere yayılması ve sosyal ağların entegrasyonu.</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 4: Türkiye'de Dijitalleşme Çalışmaları",
        content: `
            <p>Türkiye'de dijitalleşmeye ilişkin devlet politikasını 3 ana faaliyet alanına ayırmak mümkündür:</p>
            <ol>
                <li><strong>Politika Geliştirme Süreci:</strong> Sanayi ve Teknoloji Bakanlığı Ar-Ge Teşvikleri Genel Müdürlüğü tarafından üstlenilmiştir.</li>
                <li><strong>Pilot Uygulama Süreçleri:</strong> Sanayi ve Verimlilik Genel Müdürlüğü'ne aittir.</li>
                <li><strong>Dönüşüm Finansmanı:</strong> Üç kaynak belirlenmiştir: AB ve Dış İlişkiler Genel Müdürlüğü, TÜBİTAK ve KOSGEB.</li>
            </ol>
            <p><strong>Sanayide Dönüşüm Politika Belgeleri:</strong> TOBB, TİM, TÜSİAD, MÜSİAD, YASED ve TTGV işbirliği ile 6 çalışma grubu kurulmuştur:
                <ul>
                    <li>İleri üretim teknikleri, Eğitim, Dijital teknolojiler, Mevzuat ve standardizasyon, Altyapı, Açık İnovasyon.</li>
                </ul>
            </p>
            <p><strong>İmalat Sanayi İçin Atılan Somut Adımlar:</strong>
                <ul>
                    <li>Dördüncü Sanayi Devrimi Dairesi'nin kurulması.</li>
                    <li>Cumhurbaşkanlığı Dijital Dönüşüm Ofisi'nin kurulması.</li>
                    <li>Sanayide dijital olgunluk düzeyi anketinin yapılması.</li>
                    <li>Ankara ve Bursa'da öncelikli olmak üzere <strong>Dijital Model Fabrikaların</strong> kurulması.</li>
                    <li>Dijital Türkiye Yol Haritası'nın yayınlanması ve 15 üniversite ile bilgi sermayesi iş birlikleri yapılması.</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 5: Dijital Dönüşümde Verinin Önemi ve Büyük Veri",
        content: `
            <p>Dijital çağda veri; inovasyonu tetikleyen, stratejik kararları yönlendiren ve işletmeleri dönüştüren en kritik yakıttır. <strong>"Veri yeni petroldür."</strong> 2025 yılında dünya genelinde <strong>175 ZB (Zettabyte)</strong> veri üretileceği öngörülmektedir.</p>
            <p><strong>Veri Stratejisi ve Karar Alma:</strong> Verinin stratejik kullanımı yalnızca bir teknoloji yatırımı değil, kültürel bir dönüşümdür. Şirketlerde verinin yönetimi için <strong>CDO (Chief Data Officer)</strong> pozisyonları hızla artmaktadır.</p>
            <p><strong>Büyük Veri (Big Data) 3V Prensibi:</strong>
                <ul>
                    <li><strong>Volume (Hacim):</strong> Üretilen ve depolanan veri miktarının büyüklüğü.</li>
                    <li><strong>Velocity (Hız):</strong> Verinin gerçek zamanlı olarak akma ve işlenme hızı.</li>
                    <li><strong>Variety (Çeşitlilik):</strong> Verinin farklı formatlarda (metin, video, ses, sensör datası) yapısal veya yapısal olmayan biçimde olması.</li>
                </ul>
            </p>
            <p><strong>Büyük Veri Analitiği Seviyeleri:</strong>
                <ul>
                    <li><strong>Tanımlayıcı (Descriptive):</strong> Ne oldu? (Raporlama ve geçmiş veriler).</li>
                    <li><strong>Tanısal (Diagnostic):</strong> Neden oldu? (Kök neden analizleri).</li>
                    <li><strong>Öngörücü (Predictive):</strong> Ne olacak? (Makine öğrenmesi modelleriyle gelecek tahmini).</li>
                    <li><strong>Yönlendirici (Prescriptive):</strong> Ne yapmalıyız? (Karar destek ve optimizasyon sistemleri).</li>
                </ul>
            </p>
            <p><strong>Endüstride Büyük Veri Örnekleri:</strong>
                <ul>
                    <li><strong>Siemens MindSphere:</strong> 1.3 milyondan fazla cihazdan veri toplayıp analiz eden bulut tabanlı IoT sistemi.</li>
                    <li><strong>Arçelik Data Lake (Veri Gölü):</strong> Kalite zekası, üretim optimizasyonu ve servis verilerinin toplanıp işlendiği ortak veri havuzu.</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 6: Yapay Zekâ ve Dijital Karar Fabrikası",
        content: `
            <p>Modern dijital işletmelerin merkezinde geleneksel operasyonel kısıtlamaların olmadığı, kararları algoritmaların aldığı bir <strong>"Yapay Zekâ Fabrikası" (AI Factory)</strong> yer alır.</p>
            <p><strong>Ant Financial Group (Alibaba / Alipay Örneği):</strong>
                <ul>
                    <li>Piyasaya girdikten 5 yıl sonra, 2019'da tüketici sayısı <strong>1 milyar sınırını</strong> aşmıştır.</li>
                    <li>Bunu ABD'nin en büyük bankalarının 10'da birinden daha az çalışanla, ancak 10 kat fazla müşteriye hizmet vererek başarmıştır.</li>
                    <li>2018 sonlarında piyasa değeri 150 milyar dolara (JPMorgan Chase'in yarısı) ulaşmıştır.</li>
                    <li>Şirkette kredileri onaylayan, finansal tavsiyeler veren veya operasyonel kararları alan hiçbir insan çalışan yoktur; tüm kararları yapay zekâ verir.</li>
                </ul>
            </p>
            <p><strong>Yapay Zekâ Fabrikasının Dört Temel Bileşeni:</strong>
                <ol>
                    <li><strong>Veri Hattı (Data Pipeline):</strong> Verileri sistematik, ölçeklenebilir ve otomatik şekilde toplayan, temizleyen ve birleştiren hat.</li>
                    <li><strong>Algoritmik Karar Motoru (Predictive Engine):</strong> Gelecekteki durum veya aksiyonlara ilişkin kestirimlerde bulunan modeller.</li>
                    <li><strong>Deney Platformu (Experimentation Platform):</strong> Yeni algoritma hipotezlerinin A/B testleriyle doğrulandığı ortam.</li>
                    <li><strong>Yazılım Entegrasyonu ve Altyapı:</strong> Bu döngüyü yazılıma gömen, iç ve dış kullanıcılara sunan arayüzler.</li>
                </ol>
            </p>
            <p><strong>Güçlü vs Zayıf Yapay Zekâ:</strong>
                <ul>
                    <li><strong>Zayıf Yapay Zekâ:</strong> Geleneksel anlamda insanın yaptığı belirli dar işleri yapmak üzere tek bir alanda uzmanlaşmış algoritmalar.</li>
                    <li><strong>Güçlü Yapay Zekâ:</strong> Etki alanı sınırlamalarıyla kısıtlanmamış, değişen koşullara hızla adapte olabilen genel insan zekâsı seviyesi.</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 7: Dijital Dönüşümde Doğru ve Yanlışlar (Efsaneler)",
        content: `
            <p>Yöneticilerin dijital dönüşümle ilgili algıları ile gerçekler arasında ciddi farklar vardır:</p>
            <p><strong>Efsane 1: Dijital dönüşüm iş modelinde büyük bir yıkım gerektirir.</strong>
                <br><em>Gerçek:</em> Çoğu şirket için dönüşüm eskiyi çöpe atmak değil, çekirdek değer önermesini dijital araçlarla daha iyi sunmaktır.
                <ul>
                    <li><strong>Maersk (Nakliye):</strong> Konteyner takip verisizliğini aşmak için sensörler ve şeffaf veri paylaşımı kullanarak daha verimli hale gelmiştir.</li>
                    <li><strong>Aeroflot (Rus Havayolu):</strong> Dijitalleşme sayesinde operasyonları iyileştirmiş, Net Tavsiye Skorunu (NPS) %44 artırarak en kötü havayolundan en iyilerden birine dönüşmüştür.</li>
                    <li><strong>G7 Taksi (Paris):</strong> 1905 yapımı geleneksel taksi şirketi, Uber tehdidine karşı kendi dijital rezervasyon ve yönlendirme sistemini kurarak pazarını korumuştur.</li>
                </ul>
            </p>
            <p><strong>Efsane 2: Fiziksel kanallar tamamen ortadan kalkacaktır.</strong>
                <br><em>Gerçek:</em> Dijital ve fiziksel modeller bir arada (hibrit) var olacaktır.
                <ul>
                    <li><strong>Galeries Lafayette Champs-Élysées:</strong> Fiziksel akıllı mağazasında verileri kullanırken, müşterilerle duygusal bağ kurmak için kişisel stilistleri entegre etmiştir.</li>
                    <li>İnternetten doğan perakendeciler (Örn: GL) veri toplamak ve duygusal bağ kurmak için fiziksel mağazalar açmaya başlamıştır.</li>
                </ul>
            </p>
            <p><strong>Efsane 3: Şirketler yenilikçilik için teknoloji startup'ları satın almalıdır.</strong>
                <br><em>Gerçek:</em> Startup'ları satın alıp ana firmanın bürokrasi ve yavaşlığıyla boğmak yerine, yarı bağımsız çalışıp sinerji yaratmalarına izin verilmelidir (Örn: **Avnet**'in Hackster.io'yu satın alıp bağımsız bırakması).
            </p>
            <p><strong>Efsane 4: Dijital dönüşüm sadece teknoloji yatırımıdır.</strong>
                <br><em>Gerçek:</em> Dönüşüm insan kaynağını ve kültürel değişimi gerektirir (Örn: **Adobe**'un çalışanlara fikir geliştirme fırsatı veren **"Turuncu Kutu" (Orange Box)** projesi).
            </p>
            <p><strong>Efsane 5: Eski bilgi sistemleri altyapısını tamamen yenileyerek başlamak gerekir.</strong>
                <br><em>Gerçek:</em> Altyapıyı toptan değiştirmek çok risklidir. Dönüşüm aşamalı olmalı ve pazarda test edilerek ilerlenmelidir (Örn: **Marriott**'un Expedia rekabetinde aşamalı güncellemesi).
            </p>
        `
    },
    {
        title: "Bölüm 8: Sürdürülebilirlik ve Ortak Malların Trajedisi",
        content: `
            <p><strong>Sürdürülebilirlik,</strong> gelecek nesillerin kendi ihtiyaçlarını karşılama yeteneğinden ödün vermeden, bugünün ihtiyaçlarını karşılayabilmektir. Üç temel boyutu vardır: <strong>Çevresel, Sosyal ve Ekonomik sürdürülebilirlik.</strong></p>
            <p><strong>Ortak Malların Trajedisi (Tragedy of the Commons):</strong> Garrett Hardin tarafından tanımlanan kavramdır. Bireylerin, kamuya açık ortak ve ücretsiz mallardan (örneğin meralar) kendi faydalarını maksimize etmek için aşırı tüketim yapması sonucu kaynağın tamamen tükenmesidir.
                <br><em>Örnek:</em> Çobanın merada hayvan sayısını artırarak (+1 fayda) meranın yeşilliklerini yok etmesi ve uzun vadede tüm çobanların kaybetmesi.
            </p>
            <p><strong>Kurumsal Sosyal Sorumluluk (KSS) ve Çevre Felaketleri:</strong>
                <ul>
                    <li>Geleneksel verimlilik ve kâr odaklı yönetim anlayışının çevresel ve sosyal felaketlere yol açtığı kanıtlanmıştır.</li>
                    <li><strong>Nike (1996):</strong> Pakistan'da çocuk işçilerin futbol topu diktiğinin ortaya çıkmasıyla marka imajı büyük zarar görmüştür.</li>
                    <li><strong>Bhopal Disiplin Felaketi (3 Aralık 1984):</strong> Hindistan Bhopal'deki Union Carbide böcek ilacı fabrikasından sızan <strong>Metil İzosiyanat (MIC)</strong> gazı binlerce insanın ölümüne ve çevre zehirlenmesine yol açmıştır.</li>
                </ul>
            </p>
            <p><strong>Yeşil Tedarik Zinciri ve Tersine Lojistik (Reverse Logistics):</strong>
                <ul>
                    <li><strong>Tersine Lojistik:</strong> Ürünlerin değer kazanımı veya uygun şekilde imha edilmesi amacıyla tüketim noktasından çıkış noktasına (orijine) doğru akışının yönetilmesidir.</li>
                    <li>Yeniden üretim süreçlerinde enerji gereksinimi, hammaddeden sıfırdan üretime göre <strong>%85'e kadar daha düşüktür.</strong></li>
                    <li>Geri dönüştürülmüş alüminyum üretmek, ilk üretimin sadece <strong>%5'i kadar</strong> enerji gerektirir.</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 9: Sürdürülebilir Akıllı Şehirler",
        content: `
            <p><strong>Sürdürülebilir Akıllı Şehir;</strong> sınırlı olan kaynakları bilgi ve iletişim teknolojileri yardımıyla daha etkin ve verimli kullanan, vatandaşların yaşam kalitesini artıran, karbon ayak izini azaltan ve sürdürülebilir kalkınmaya yatırım yapan şehirdir.</p>
            <p><strong>Neden Akıllı Şehirlere İhtiyaç Var?</strong>
                <ul>
                    <li>Dünyada üretilen enerjinin <strong>%75'i şehirlerde tüketilmekte</strong> ve dünya genelindeki karbondioksit salınımının %80'i şehirlerden kaynaklanmaktadır.</li>
                    <li>Bugün dünya nüfusunun %55'i şehirlerde yaşarken, 2050 yılına kadar bu oranın <strong>%68'e ulaşacağı</strong> öngörülmektedir.</li>
                    <li>Bu hızlı kentsel nüfus artışı; işsizlik, altyapı yetersizliği, çevre kirliliği ve kaynak tüketimi gibi krizleri de beraberinde getirmektedir.</li>
                </ul>
            </p>
            <p><strong>Kentsel Sürdürülebilirlik vs Akıllı Şehir:</strong>
                <ul>
                    <li><strong>Kentsel Sürdürülebilirlik:</strong> Daha çok çevre faktörünü ve ekolojik korumayı ön plana çıkarır (Neirotti vd., 2014).</li>
                    <li><strong>Akıllı Şehir:</strong> Teknolojiyi kullanarak sosyal ve ekonomik faktörleri, verimliliği ve vatandaş katılımını ön plana çıkarır.</li>
                    <li>Gül ve Çobanoğlu (2017) çalışmasına göre akıllı şehir; bilgi, teknoloji, sürdürülebilirlik ve katılımın entegre olduğu yapıdır.</li>
                </ul>
            </p>
            <p><strong>Sürdürülebilir Şehirleşmenin Temel Esasları:</strong> Yerel düzeyde ekonomik, sosyal ve kültürel kalkınma olanaklarının sunulması ve toplumsal dayanışmanın oluşturulmasıdır.</p>
        `
    },
    {
        title: "Bölüm 10: Sürdürülebilir Kalkınma ve Turizm İlkeleri",
        content: `
            <p>Sürdürülebilir kalkınma; ekonomik büyümeyi ekolojik dengeleri ve doğal kaynakların yenilenebilme sınırlarını göz önünde bulundurarak gerçekleştirmektir. Ekonomik büyümeyle ekolojik denge birbirine bağımlıdır.</p>
            <p><strong>Ekonomik Sürdürülebilirlik İlkeleri (Burns ve Holden 1995):</strong>
                <ul>
                    <li>Ekonomik faaliyetlerin ve kaynakların adil bölüşümü.</li>
                    <li>İkame olanakları bulunmayan yenilenemeyen kaynakların kullanımına sınırlama getirilmesi.</li>
                    <li>Hükümet politikalarıyla aşırı büyümelere çevre koruma sınırları getirilmesi.</li>
                </ul>
            </p>
            <p><strong>UNEP ve UNWTO Sustainable Tourism (Sürdürülebilir Turizm) İlkeleri:</strong>
                <ul>
                    <li><strong>Ekonomik Süreklilik:</strong> Güzergah ve girişimlerin uzun vadede fayda sağlaması.</li>
                    <li><strong>Yerel Kalkınma:</strong> Ziyaretçilerin yerel üreticilerle buluşması ve harcamaların yerelde kalması.</li>
                    <li><strong>İstihdam Kalitesi:</strong> Ayrımcılık yapılmaksızın ücret ve iş kalitesinin artırılması.</li>
                    <li><strong>Toplumsal Refah:</strong> Yaşam kalitesinin korunması.</li>
                    <li><strong>Kültürel Zenginlik:</strong> Tarihi mirasa, özgün kültüre ve ayırt edici özelliklere saygı gösterilmesi.</li>
                    <li><strong>Biyolojik Çeşitlilik:</strong> Doğal alanların ve endemik türlerin koruma-kullanma dengesiyle korunması.</li>
                    <li><strong>Çevresel Etki:</strong> Hava, su, toprak kirliliği ve atık üretiminin asgari düzeye indirilmesi.</li>
                </ul>
            </p>
            <p><strong>Kültürel Sürdürülebilirlik ve Süreklilik:</strong>
                <ul>
                    <li>Kültür tarihidir, süreklidir ve değişime açıktır. Kültürün sürekliliğini gelenek ve görenekler sağlar.</li>
                    <li>Vurgulanmak istenen gelenekçi bir tavır değil; ülkelerin geçmiş mirasının ve yerleşim ilkelerinin çok büyük birer sürdürülebilir kaynak olduğunun fark edilmesidir.</li>
                </ul>
            </p>
        `
    }
];
