const studyNotesISG = [
    {
        title: "Bölüm 1: İSG'ye Giriş ve Temel Kavramlar",
        content: `
            <p><strong>İş Sağlığı ve Güvenliği (İSG),</strong> çalışanların sağlığını ve güvenliğini korumayı hedefleyen multidisipliner bir bilim dalıdır. Sınavda en önemli üç amacı sırasıyla şunlardır:</p>
            <ul>
                <li><strong>1. Çalışanları Korumak:</strong> İSG'nin birinci öncelikli ve temel amacıdır.</li>
                <li><strong>2. Üretim Güvenliğini Sağlamak:</strong> Verimliliği artırmak ve kayıpları engellemek.</li>
                <li><strong>3. İşletme Güvenliğini Sağlamak:</strong> İşyeri ve ekipmanların emniyetini korumak.</li>
            </ul>
            <p><strong>Tarihsel Gelişim Süreci:</strong>
                <ul>
                    <li><strong>Bernardino Ramazzini:</strong> İSG'nin kurucusu/babası olarak kabul edilir. İşçilere <em>"Ne iş yapıyorsun?"</em> sorusunun sorulması gerektiğini savunan ve meslek hastalıkları üzerine ilk kapsamlı kitabı (De Morbis Artificum Diatriba) yazan kişidir.</li>
                    <li><strong>Percivall Pott:</strong> Baca temizleyicilerinde görülen skrotum kanserinin mesleki bir hastalık olduğunu kanıtlayarak ilk mesleki kanser-iş ilişkisini kurmuştur.</li>
                    <li><strong>Sanayi Devrimi:</strong> Artan iş kazaları ve çocuk/kadın işçilerin sömürülmesi sonrası İngiltere'de fabrikalar kanunu ile çocuk çalıştırma sınırları gibi ilk yasal İSG düzenlemeleri ortaya çıkmıştır.</li>
                </ul>
            </p>
            <p><strong>Tehlike vs. Risk (6331 Sayılı Kanun):</strong>
                <ul>
                    <li><strong>Tehlike:</strong> İşyerinde var olan ya da dışarıdan gelebilecek, çalışanı veya işyerini etkileyebilecek zarar veya hasar verme <strong>potansiyelidir</strong> (Örn: Islak zemin, açık kablo).</li>
                    <li><strong>Risk:</strong> Tehlikeden kaynaklanacak kayıp, yaralanma ya da başka zararlı sonuç meydana gelme <strong>olasılığı ile şiddetinin bileşkesidir</strong> (Örn: Islak zeminde kayıp düşme riski, kablodan elektrik çarpması riski).</li>
                </ul>
            </p>
            <p><strong>Proaktif vs. Reaktif Yaklaşım:</strong>
                <ul>
                    <li><strong>Proaktif (Önleyici) Yaklaşım:</strong> Tehlikeleri önceden analiz edip kaza gerçekleşmeden risk analiziyle önlem alma anlayışıdır. Modern İSG'nin temelidir.</li>
                    <li><strong>Reaktif (Tepkisel) Yaklaşım:</strong> Olay gerçekleştikten sonra inceleme yapıp tedbir almaya çalışan geleneksel yaklaşımdır. Maliyetlidir ve can kayıplarını engellemede etkisizdir.</li>
                </ul>
            </p>
            <p><strong>NACE Kodları ve Tehlike Sınıfları:</strong>
                İşyerleri yasal olarak yaptıkları ana faaliyete göre NACE (Avrupa Birliği Ekonomik Faaliyetlerin Sınıflandırılması) kodları alırlar. Bu kodlar doğrultusunda işyerleri 3 tehlike sınıfına ayrılır:
                <ul>
                    <li><strong>Az Tehlikeli:</strong> Büro faaliyetleri, bankacılık, perakende mağazacılık, okullar.</li>
                    <li><strong>Tehlikeli:</strong> Diş klinikleri, mobilya imalatı, gıda işleme fabrikaları.</li>
                    <li><strong>Çok Tehlikeli:</strong> Maden ocakları, inşaat şantiyeleri, ağır kimya sanayii.</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 2: Risk Değerlendirmesi Metodolojileri",
        content: `
            <p>Risk analizi metodolojileri, tehlikeleri sayısal veya nitel olarak derecelendirmek ve kontrol tedbirleri planlamak için kullanılan sistemlerdir.</p>
            <ul>
                <li><strong>1. L Tipi Matris (5x5 Matris):</strong> Yarı-nicel bir risk analiz metodudur. Küçük ve karmaşık olmayan işletmelerde tercih edilir.
                    <div class="formula-block">
                        <strong>Risk Puanı</strong> = Olasılık (O) &times; Şiddet (Ş)
                    </div>
                    Parametreler 1 ile 5 arasında puanlanır. Risk Skoru en fazla 25, en az 1 olabilir. 25 puanlık risk, acil eylem gerektiren <strong>'Kabul Edilemez Risk'</strong> kategorisindedir.
                </li>
                <li><strong>2. İnce-Kinney (Fine-Kinney) Metodu:</strong> Klasik matristen farklı olarak tehlikeyle karşılaşma sıklığını (Frekans) da denkleme katar.
                    <div class="formula-block">
                        <strong>Risk Değeri</strong> = İhtimal (O) &times; Frekans (F) &times; Şiddet (Ş)
                    </div>
                    Olasılık (0.1 - 10), Frekans (0.5 - 10), Şiddet (1 - 100) arasında değişen puan cetvellerine sahiptir. Şiddet puanında 'Ölüm' 15 veya 40 puanla, 'Birden çok ölüm' ise 100 puanla temsil edilir.
                </li>
                <li><strong>3. FMEA (Hata Türleri ve Etkileri Analizi):</strong> Tasarım ve üretim hatalarını sıfıra indirmek için otomotiv ve havacılık sektöründe yaygın kullanılan bir metodolojidir.
                    <div class="formula-block">
                        <strong>Risk Öncelik Sayısı (RÖS)</strong> = Olasılık (O) &times; Şiddet (Ş) &times; Saptanabilirlik (D)
                    </div>
                    Parametreler 1-10 arası puanlanır. RÖS maksimum 1000 olabilir. RÖS değeri 100'ün üzerine çıktığında mutlaka düzeltici aksiyon alınmalıdır.
                    <br><em>Saptanabilirlik (D - Detection) Parametresi:</em> Hatanın fark edilme olasılığıdır. Hatanın sistem tarafından fark edilmesi kolaylaştıkça (Saptanabilirlik yüksek) puan düşer. Dolayısıyla RÖS azalır.
                </li>
                <li><strong>4. HAZOP (Tehlike ve İşletilebilirlik Analizi):</strong> Kimya ve nükleer tesis gibi karmaşık proses endüstrilerinde akışkan sistemlerdeki sapmaları incelemek için tasarlanmıştır. Beyin fırtınası temellidir. Akış parametrelerine (Sıcaklık, Basınç, Debi) <strong>kılavuz kelimeler</strong> (Fazla, Eksik, Yok, Ters) uygulanarak olası tehlikeli sapmalar tespit edilir.
                </li>
                <li><strong>5. FTA (Hata Ağacı Analizi):</strong> Tepe bir hata olayından (örneğin yangın) yola çıkarak mantıksal VE/VEYA kapılarıyla bu hataya yol açabilecek alt olayları geriye doğru inceler. Kantitatif (nicel) ve dedüktif (tümdengelimli) bir yöntemdir.
                </li>
                <li><strong>6. ETA (Olay Ağacı Analizi):</strong> Başlatıcı bir olaydan (örneğin borunun delinmesi) yola çıkarak güvenlik bariyerlerinin çalışıp çalışmamasına göre olası tüm zincirleme sonuçları tümevarımlı olarak inceler. İleriye doğru çalışır.
                </li>
            </ul>
        `
    },
    {
        title: "Bölüm 3: İSG Kurulları ve İş Kazaları",
        content: `
            <p><strong>1. İSG Kurullarının Yapısı ve Çalışma Kuralları:</strong>
                Kurulun kurulması için şu iki koşulun bir arada bulunması gerekir:
                <br>1. İşyerinde fiilen <strong>en az 50 çalışan</strong> bulunması,
                <br>2. İşin niteliği gereği <strong>6 aydan fazla süren sürekli işlerin</strong> yapılması.
                <br><em>Kurul Üyeleri:</em> İşveren veya vekili (Kurul başkanı), İş Güvenliği Uzmanı (Kurul sekreteri), İşyeri Hekimi, İnsan Kaynakları/İdari ve Mali İşler yöneticisi, Çalışan temsilcisi ve ustabaşı/formen.
                <br><em>Karar Alma:</em> Kurul üye tam sayısının salt çoğunluğu ile toplanır ve katılanların salt çoğunluğu ile karar alır. Oyların eşitliği halinde başkanın (işverenin) oyu kararı belirler.
            </p>
            <p><strong>2. Kurul Toplantı Sıklığı:</strong> 
                Kurul ayda en az bir kez toplanmak zorundadır. Ancak kurul tehlike sınıfına göre bu süreyi uzatabilir:
                <ul>
                    <li><strong>Az Tehlikeli işyerlerinde:</strong> En geç <strong>3 ayda bir</strong>.</li>
                    <li><strong>Tehlikeli işyerlerinde:</strong> En geç <strong>2 ayda bir</strong>.</li>
                    <li><strong>Çok Tehlikeli işyerlerinde:</strong> Her ay toplantı yapılması zorunludur (Süre uzatılamaz).</li>
                </ul>
            </p>
            <p><strong>3. İş Kazasının Yasal Tanımı (5510 Sayılı Kanun Madde 13):</strong>
                Bir kazanın yasal olarak iş kazası sayılabilmesi için sigortalının aşağıdaki durumların birinde bedenen veya ruhen engelli hale gelmesi gerekir:
                <ul>
                    <li>Sigortalının işyerinde bulunduğu sırada (iş yapıp yapmadığına bakılmaksızın avlu, bahçe ve dinlenme alanları dahil),</li>
                    <li>İşveren tarafından yürütülmekte olan iş nedeniyle veya görevli olarak başka bir yere gönderildiğinde,</li>
                    <li>Emziren kadın sigortalının çocuğuna süt vermek için ayrılan zamanlarda (süt izninde),</li>
                    <li>Sigortalıların işverence sağlanan bir taşıtla işin yapıldığı yere gidiş gelişi sırasında (servis kazaları).</li>
                </ul>
                <em>Bildirim Süresi:</em> İş kazaları, işveren tarafından kazadan sonraki <strong>en geç 3 iş günü içinde</strong> Sosyal Güvenlik Kurumu'na (SGK) bildirilmek zorundadır.
            </p>
        `
    },
    {
        title: "Bölüm 4: Çalışmaktan Kaçınma Hakkı ve Hesaplamalar",
        content: `
            <p><strong>1. Çalışmaktan Kaçınma Hakkı (6331 md. 13):</strong>
                Çalışanlar ciddi ve yakın bir tehlike ile karşı karşıya kaldıklarında kurula, kurulun bulunmadığı yerlerde ise doğrudan işverene başvurarak durumun tespit edilmesini ve gerekli tedbirlerin alınmasını talep ederler. 
                <ul>
                    <li>Çalışanlar, gerekli tedbirler alınıncaya kadar <strong>çalışmaktan kaçınabilirler</strong>.</li>
                    <li>Çalışmaktan kaçındıkları dönemde çalışanların ücretleri ödenmeye devam eder ve yasal hakları kısıtlanamaz.</li>
                    <li>Tehlikenin önlenemez olduğu durumlarda çalışanlar iş sözleşmelerini haklı nedenle derhal feshedebilirler.</li>
                </ul>
            </p>
            <p><strong>2. Kaza Sıklık Hızı (KSH) Formülü:</strong>
                İşyerindeki kazaların sıklık derecesini ölçmek için kullanılır.
                <div class="formula-block">
                    <strong>KSH</strong> = (Toplam İş Kazası Sayısı &times; 1.000.000) / Toplam Fiili Çalışma Saati (Adam-Saat)
                </div>
                <em>Not:</em> 1.000.000 katsayısı, 100 çalışanın yılda yaklaşık 2000 saat çalıştığı varsayımı üzerinden standart sanayi kabulüdür.
            </p>
            <p><strong>3. Kaza Ağırlık Hızı (KAH) Formülü:</strong>
                Kazaların işgücü kaybı açısından ne kadar şiddetli olduğunu ölçer.
                <div class="formula-block">
                    <strong>KAH</strong> = (Kayıp İş Günü Sayısı &times; 1.000) / Toplam Fiili Çalışma Saati (Adam-Saat)
                </div>
                <em>Önemli Hüküm:</em> Ölümlü iş kazalarında veya çalışanın tamamen malul kaldığı uzuv kayıplarında, kayıp gün sayısına yasal olarak doğrudan <strong>6000 gün</strong> eklenir. KAH hesaplanırken ölümlü bir kaza belirtilirse kayıp gün sayısına bu değeri eklemelisiniz.
            </p>
        `
    },
    {
        title: "Bölüm 5: Risk Yönetimi ve Kritik Tablolar",
        content: `
            <p><strong>1. Risk Kontrol Önlemlerinin Hiyerarşisi:</strong>
                Riskleri azaltmak için uygulanacak tedbirler sırasıyla şu hiyerarşik düzene göre seçilmelidir:
                <ol>
                    <li><strong>Tehlikenin Ortadan Kaldırılması (Eliminasyon):</strong> Tehlike kaynağının tamamen yok edilmesi (En etkili yöntem).</li>
                    <li><strong>Tehlikeli Olanın Daha Az Tehlikeliyle Değiştirilmesi (İkame):</strong> Tehlikeli kimyasal yerine su bazlı boya kullanılması.</li>
                    <li><strong>Mühendislik Önlemleri (Toplu Koruma):</strong> Makine koruyucuları takılması, havalandırma sistemleri kurulması.</li>
                    <li><strong>İdari Önlemler / İşaretler:</strong> Vardiyalı çalışma yaptırılarak maruziyet süresinin azaltılması, uyarı levhaları asılması.</li>
                    <li><strong>Kişisel Koruyucu Donanımlar (KKD):</strong> Baret, iş ayakkabısı, maske kullanımı (En son çare, sadece kişiyi korur).</li>
                </ol>
            </p>
            <p><strong>2. Risk Değerlendirmesinin Yenilenme Süreleri:</strong>
                Risk değerlendirmeleri, işyerinin tehlike sınıfına göre düzenli aralıklarla tamamen yenilenmek zorundadır:
                <ul>
                    <li><strong>Çok Tehlikeli Sınıfta:</strong> En geç <strong>2 yılda bir</strong>.</li>
                    <li><strong>Tehlikeli Sınıfta:</strong> En geç <strong>4 yılda bir</strong>.</li>
                    <li><strong>Az Tehlikeli Sınıfta:</strong> En geç <strong>6 yılda bir</strong>.</li>
                </ul>
            </p>
            <p><strong>3. Kabul Edilemez ve Kabul Edilebilir Risk Seviyeleri:</strong>
                <ul>
                    <li><strong>15 - 25 Puan (Kabul Edilemez Risk):</strong> İş kabul edilebilir seviyeye çekilmeden çalışmaya başlanamaz. Çalışılıyorsa iş durdurulur.</li>
                    <li><strong>8 - 12 Puan (Dikkate Değer Risk):</strong> Bu risklere mümkün olduğu kadar çabuk müdahale edilmeli, acil eylem planlanmalı ve ilave tedbirler alınmalıdır.</li>
                    <li><strong>1 - 6 Puan (Kabul Edilebilir Risk):</strong> Acil tedbir gerektirmeyebilir ancak mevcut tedbirler sürdürülmeli ve iyileştirmeye devam edilmelidir.</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 6: İş Hukuku ve Fesih Süreleri",
        content: `
            <p><strong>1. 4857 Sayılı İş Kanunu Kapsamındaki Temel Haklar:</strong>
                <ul>
                    <li><strong>Çalışma Süresi:</strong> Haftalık çalışma süresi en fazla <strong>45 saattir</strong>.</li>
                    <li><strong>Fazla Çalışma Sınırı:</strong> Bir işçiye yılda en fazla <strong>270 saat</strong> fazla çalışma yaptırılabilir. Günlük çalışma süresi fazla mesailer dahil hiçbir koşulda <strong>11 saati</strong> aşamaz.</li>
                    <li><strong>Gece Çalışması Limiti:</strong> Gece çalışmaları (20.00 - 06.00 saatleri arası) günde <strong>7.5 saati</strong> geçemez.</li>
                </ul>
            </p>
            <p><strong>2. Yasal İhbar Süreleri:</strong>
                Belirsiz süreli iş sözleşmelerinin feshinden önce karşı tarafa bildirim yapılması gereken yasal süreler:
                <ul>
                    <li><strong>6 aydan az kıdem:</strong> 2 Hafta (14 gün)</li>
                    <li><strong>6 ay - 1.5 yıl arası kıdem:</strong> 4 Hafta (28 gün)</li>
                    <li><strong>1.5 yıl - 3 yıl arası kıdem:</strong> 6 Hafta (42 gün)</li>
                    <li><strong>3 yıldan fazla kıdem:</strong> 8 Hafta (56 gün)</li>
                </ul>
            </p>
            <p><strong>3. İşe İade Davası Koşulları ve Tazminat Hesapları:</strong>
                İşe iade davası açabilmek için işyerinde <strong>en az 30 işçi</strong> çalışıyor olması ve işçinin en az <strong>6 aylık kıdeminin</strong> bulunması şarttır. Fesih bildiriminden itibaren <strong>1 ay içinde</strong> dava açılmalıdır.
                <ul>
                    <li>İşveren, davayı kazanan işçiyi başvurudan itibaren <strong>1 ay içinde</strong> işe başlatmak zorundadır.</li>
                    <li>İşçiyi işe başlatmayan işveren, en az <strong>4 aylık</strong> ve en fazla <strong>8 aylık</strong> ücreti tutarında <strong>işe başlatmama tazminatı</strong> öder.</li>
                    <li>Boşta geçen süre için en çok <strong>4 aya kadar</strong> olan ücret ve diğer haklar ödenir.</li>
                </ul>
            </p>
        `
    },
    {
        title: "Bölüm 7: Yavuz Hoca'nın Özel İSG Notları",
        content: `
            <ul>
                <li><strong>Gürültü Sınır Değerleri:</strong> En yüksek maruziyet etkin eylem değeri <strong>85 dB(A)</strong>, günlük maruziyet sınır değeri ise <strong>87 dB(A)</strong> olarak belirlenmiştir.</li>
                <li><strong>İlkyardımcı Sayısı Zorunluluğu:</strong>
                    <ul>
                        <li><strong>Az Tehlikeli işyerlerinde:</strong> Her 20 çalışan için 1 ilkyardımcı.</li>
                        <li><strong>Tehlikeli işyerlerinde:</strong> Her 15 çalışan için 1 ilkyardımcı.</li>
                        <li><strong>Çok Tehlikeli işyerlerinde:</strong> Her 10 çalışan için 1 ilkyardımcı.</li>
                    </ul>
                </li>
            </ul>
        `
    }
];
