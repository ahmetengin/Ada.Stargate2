# Mission
- Node: Ada.marina.WIM
- Primary Goal:
  - West İstanbul Marina’daki tüm operasyonel akışı (giriş–çıkış, bağlama, güvenlik, faturalama, raporlama) Ada.marina node’u üzerinden yarı-otonom / otonom yönetmek.
- Secondary Goals:
  - Marina verisini Ada ekosistemine (Ada.sea, Ada.travel, Ada.congress, Ada.finance, Ada.legal) besleyen ana “hub” haline getirmek.
  - GM / Operasyon / Güvenlik ekiplerine tek ekrandan (CaptainDesk / MarinaDesk) aksiyon alınabilir özetler sunmak.
  - KVKK uyumlu, denetlenebilir, log’lanmış bir yapay zekâ karar motoru kurmak.
  - İleride diğer marinalara kopyalanabilir, tenant-bazlı çoklu marina mimarisinin ilk canlı örneği olmak (Ada.marina.<tenant>).

---

# Context
- Data sources:
  - Marina temel verisi:
    - Berth / iskele / ponton envanteri, ölçüler, derinlikler.
    - Kontratlar, kira dönemleri, fiyat tarifeleri, iskontolar.
    - Tekne profilleri (LOA, beam, draft, tipi, sahibi, bayrak, sigorta).
    - Müşteri profilleri (sahip, kaptan, acente, acil irtibat).
    - Giriş–çıkış logları, ziyaretçi kayıtları, araç plakaları.
  - Operasyonel loglar:
    - Palamar çağrıları, vinç / lift rezervasyonları.
    - Tekne yer değiştirme, şamandıra / mooring bilgileri.
    - Bakım / arıza ticket’ları, iş emirleri.
  - Sensör & video verisi:
    - Kamera/YOLO olayları (yasak alanda park, hız limiti ihlali, uygunsuz davranış).
    - Kapı / turnike / barrier logları.
    - AIS / trafik verisi (yaklaşan–uzakta seyreden tekneler).
  - Finansal veriler:
    - Fatura kayıtları (Ada.finance/Parasut entegrasyonu).
    - Ödeme bildirimleri (Iyzico, PayTR vb.).
    - Borç–alacak durumu, geciken ödemeler.
  - Hukuki & kural dokümanları:
    - Marina sözleşmeleri, ek protokoller.
    - İç yönetmelikler, güvenlik prosedürleri.
    - Devlet bildirim zorunluluklarına ilişkin metinler (otel benzeri kimlik bildirim rejimi).

- External APIs:
  - Hava durumu:
    - OpenWeather / Meteoblue / PredictWind benzeri API’ler.
  - Deniz trafiği:
    - MarineTraffic / Kpler AIS / ilgili MCP node’ları.
  - Ödeme sistemleri:
    - Iyzico, PayTR, Stripe vb. payment gateway API’leri.
  - Fatura / muhasebe:
    - Parasut veya benzeri e-fatura/e-arşiv entegrasyonu (Ada.finance).
  - Hukuk / mevzuat:
    - Yargı-MCP (Ada.legal ile entegre hukuki RAG katmanı).
  - Bildirim:
    - E-posta (SMTP provider), SMS, WhatsApp Business API, Apple/Google push, PassKit.

- Hardware / Sensors:
  - Marina ofisinde:
    - Mac mini / mini PC (Ada.marina node + Stargate bağlantısı).
    - Pi5 / CM5 kutuları (kamera, NVR, NMEA2000, sensör, access control).
  - Sahada:
    - IP kameralar (YOLO için RTSP stream).
    - ANPR / LPR kameralar (araç plaka tanıma).
    - Kapı, turnike, bariyer kontrol üniteleri.
    - Kartlı geçiş / QR okuyucular (misafir ve personel girişleri).
    - Yerel hava istasyonu (rüzgar, basınç, sıcaklık vs.).
    - (Varsa) NMEA2000/OneNet backbone; şamandıra sensörleri; ponton titreşim/su seviyesi sensörleri.

- Constraints (offline, latency, legal, KVKK, güvenlik):
  - Offline:
    - İnternet kesildiğinde marina içi operasyonlar (giriş–çıkış, kamera görüntüleme, temel loglama) devam etmeli.
    - Offline modda büyük LLM yerine hafif policy engine + rule-based kararlar kullanılmalı.
  - Latency:
    - Kapı/bariyer açma, palamar çağrısı, acil durum alarmları için < 1–2 sn gecikme hedefi.
    - LLM tabanlı değerlendirme kritik loop’ta değil, karar sonrası rapor/özet üretiminde yer almalı.
  - Legal:
    - KVKK / GDPR uyumu (minimum veri, maskelenmiş loglar, role-based access).
    - Sözleşmeler, kurallar ve hukuki aksiyonlar için Ada.legal / Yargı-MCP referans alınmalı.
  - Security:
    - Tüm API çağrılarında imzalı istek (API_KEY + SECRET_KEY, HMAC).
    - Her tenant (Ada.marina.WIM vs başka marina) için izole veritabanı / şema.
    - Kamera stream’leri ve kişisel veriler sadece yetkili rollere açılmalı.
    - Ajanların aksiyonları audit log’da imzalı ve değiştirilemez şekilde tutulmalı.

---

# Tools (MCP / FastAPI / GraphQL)
- Tool-1: `mcp-marina-db-wim`
  - Görev: Postgres üzerindeki marina veritabanına (berths, vessels, contracts, movements, tickets, invoices) erişim ve CRUD işlemleri.
- Tool-2: `mcp-marina-rules-wim`
  - Görev: Marina sözleşmeleri, kurallar ve prosedürler üzerinde RAG sorgulama; “Bu durumda hangi kural geçerli?” sorusuna cevap.
- Tool-3: `mcp-marina-vision`
  - Görev: Kamera/YOLO olaylarını alıp “incident” objelerine dönüştürmek (yasak park, hız ihlali, güvenlik olayı).
- Tool-4: `mcp-weather-sea`
  - Görev: WIM için anlık/forecast hava durumu ve deniz durumu sorguları.
- Tool-5: `mcp-ais-traffic`
  - Görev: AIS/Kpler üzerinden marina çevresindeki trafik verisini çekmek (yaklaşan tekneler, rota tahmini).
- Tool-6: `mcp-finance-billing`
  - Görev: Fatura oluşturma, gönderme, ödeme durumu sorgulama (Parasut + ödeme sistemleri).
- Tool-7: `mcp-passkit-access`
  - Görev: Misafir / tekne sahipleri için QR/PassKit pass üretimi, iptali, yeniden gönderimi.
- Tool-8: `mcp-notify`
  - Görev: E-posta, SMS, WhatsApp, push bildirimlerini tek unified arayüzden göndermek.
- Tool-9: `mcp-legal-yargi`
  - Görev: Yargı-MCP üzerinden ilgili mevzuata danışma (kimlik bildirimi, sözleşme maddeleri, sorumluluk sınırları).
- Tool-10: `mcp-sandbox`
  - Görev: Güvenli kod/komut çalıştırma, mini simülasyonlar, rapor üretimi için izole execution ortamı.

Tüm bu tool’lar, Ada.Stargate / Graphiti gateway üzerinden GraphQL veya MCP endpoint olarak expose edilir.

---

# Agent Topology
- Orchestrator:
  - `Ada.Stargate` (global orchestrator) + `Ada.marina.WIM.orchestrator` (local node orchestrator).
  - Görev:
    - Kullanıcı niyetini (GM, Operasyon, Güvenlik) anlamak.
    - Uygun domain agent’lara görev dağıtmak.
    - Tool çağrılarını planlamak, sıraya koymak, sonuçları birleştirip tek cevap üretmek.

- Domain Agents:
  - `BerthPlannerAgent`
    - Uygun bağlama yerini, derinlikleri, boy/eni, manevra kolaylığını hesaba katarak önerir.
  - `CheckInCheckOutAgent`
    - Yeni tekne geliş–gidiş süreçlerini, kontrat durumlarını ve kimlik bildirimlerini yönetir.
  - `SecurityWatchAgent`
    - Kamera/YOLO olaylarını izler, risk skoru verir, gerekiyorsa alarmları tetikler.
  - `BillingAndTariffAgent`
    - Fiyat hesaplar, aylık/yıllık kontratları takip eder, fatura ve reminder üretir.
  - `MaintenanceAgent`
    - Jetty, pontoon, elektrik/su pedestallarındaki arızaları iş emrine çevirir, SLA takibi yapar.
  - `GuestExperienceAgent`
    - Tekne sahibi / kaptan için öneriler, SMS/WhatsApp ile bilgilendirme, concierge tarzı hizmetler üretir.
  - `LegalComplianceAgent`
    - Kimlik bildirim, sözleşme yükümlülükleri ve kural ihlallerini Ada.legal üzerinden kontrol eder.

- Evaluator / Judge Agent:
  - `RiskAndPolicyJudge`
    - Domain agent’ların önerdiği aksiyonları:
      - Marina kuralları,
      - Hukuki çerçeve,
      - KVKK,
      - Güvenlik risk skoru
    açısından değerlendirip:
      - “Uygun – otomatik uygula”
      - “Uygun ama insan onayı iste”
      - “Uygun değil, red + gerekçe” kararını üretir.

- Sandbox / Execution Env:
  - `AgentSandbox` (e2b / Modal benzeri bir safe execution ortamı; Ada.marina için Docker tabanlı).
  - Kullanım:
    - Raporlama script’leri, ad-hoc SQL sorguları, istatistik üretimi.
    - Kamera olayları üzerinde batch analiz (örneğin son 24 saat rule violation sayısı).
    - Test amaçlı simülasyonlar (hayali tekne vs gerçek veri ile çakıştırma).

---

# Autonomy Levels
- L0: Sadece öneri
  - Agent’lar sadece GM / Operasyon ekranına öneri bırakır, hiçbir sistemi değiştirmez.
  - Örnek: “Tekne X için C-12 numaralı yeri öneriyorum, derinlik ve manevra açısından uygun görünüyor.”

- L1: Öner + detaylı log
  - Öneriye ek olarak, tüm veri kaynakları ve kurallar referanslarıyla birlikte açıklamalı log üretir.
  - Örnek: “Bu öneriyi şu üç kural ve şu derinlik ölçümlerine dayanarak yaptım. İşte linkler/loglar.”

- L2: Onaylı otomasyon
  - İnsan onayı gerektiren ama onay sonrası otomatik uygulanan işler.
  - Örnek:
    - Berth atamasını otomatik veritabanına yazma,
    - Fatura draft’ı oluşturup GM onayına sunma,
    - Güvenlik uyarısını ilgili personele mesaj olarak gönderme.

- L3: Full otomasyon (kritik limitler dahil)
  - Belirlenmiş güvenli sınırlar içinde insan onayı olmadan aksiyon alır.
  - Örnek:
    - Daha önce defalarca doğrulanmış tipik check-in senaryosu: kontrat uygun, borç yok, kimlikler eksiksiz → otomatik pass üretimi + gate sistemine erişim izni.
    - Küçük borç hatırlatma SMS/WhatsApp mesajları.
  - Sınırlama:
    - Kapı/barrier açma, büyük finansal işlem, hukuki riskli aksiyonlar için her zaman en az L2 (insan onayı) gerekir.

---

# Success Criteria (Acceptence Tests)
- Scenario 1: Yeni tekne geliş talebi
  - Girdi:
    - Tekne bilgileri (LOA, draft, tip, bayrak).
    - Geliş tarihi, kalış süresi.
  - Beklenen:
    - 30 sn içinde:
      - Uygun 3 bağlama yeri önerisi (gerekçeli).
      - Kontrat tipi önerisi (günlük / aylık / yıllık).
      - İlk fatura draft’ı (tarifeye göre).
      - Kimlik bildirim ve KVKK onayları için checklist.
    - Tüm süreç tek ekranda, tek onay akışıyla yönetilebilmeli.

- Scenario 2: Geciken ödeme + çıkış talebi
  - Girdi:
    - Tekne sahibi çıkış talebi.
    - Veritabanında geciken fatura bulunması.
  - Beklenen:
    - Ada.marina:
      - Otomatik olarak borç durumunu tespit eder.
      - Müşteriye nazik ama net bir bilgilendirme metni hazırlar.
      - Ödeme linkini üretir (mcp-finance-billing).
      - GM’e “ödemesiz çıkış riski” için alert drop eder.
    - İnsan sadece onay / istisna kararı verir.

- Scenario 3: Güvenlik ihlali (kamera/YOLO)
  - Girdi:
    - Kamera: “yasak alanda araç parkı” veya “gece saatlerinde izinsiz hareket” tespiti.
  - Beklenen:
    - 5 sn içinde:
      - İhlal kaydının oluşturulması (görüntü referansı ile).
      - Risk skorlaması (düşük/orta/yüksek).
      - İlgili personele mobil bildirim.
      - Tekrar eden ihlal ise otomatik rapor taslağı (fotoğraf + zaman + kural referansı).

- Scenario 4: Şiddetli hava uyarısı
  - Girdi:
    - Hava durumu API’lerinden şiddetli fırtına / lodos uyarısı (örneğin < 12 saat içinde).
  - Beklenen:
    - Ada.marina:
      - Ponton / iskele doluluk durumunu çıkarır.
      - Geçmiş hasar istatistiklerine göre riskli bölgeleri işaretler.
      - GM için “Fırtına Hazırlık Planı” kontrol listesi oluşturur.
      - Palamar ekibine görev planı önerir (halat kontrolü, ek bağlama, vs.).
      - Tekne sahiplerine bilgilendirme mesajı taslakları üretir.

---

# Observability
- Logs:
  - Her agent için ayrı log stream:
    - `orchestrator.log`, `berth_planner.log`, `security_watch.log`, `billing_agent.log` vb.
  - İçerik:
    - Gelen kullanıcı niyeti / komutu.
    - Çağrılan tool’lar, input–output özetleri.
    - Alınan karar, L-seviyesi (L0–L3).
    - Hata / istisna durumları.
  - KVKK:
    - Kişisel veriler loglarda maskeleme veya anonymization ile tutulmalı.

- Metrics:
  - Operasyon:
    - Ortalama berth atama süresi.
    - Geciken ödeme sayısı, tahsilat oranı.
    - Günlük/aylık check-in / check-out sayıları.
  - Güvenlik:
    - Günlük incident sayısı.
    - “Yanlış pozitif” olay oranı.
  - Ada performansı:
    - L0/L1/L2/L3 aksiyon dağılımları.
    - Tool hata oranları, latency.
    - LLM çağrı maliyeti (token / $ bazında).
  - Kullanıcı deneyimi:
    - GM / Operasyon ekibinin yaptığı override oranı (Ada’nın önerisi reddedildi mi?).

- Alerts:
  - Critical:
    - Aynı bağlama yerine çift atama (double booking).
    - Büyük borçlu teknede çıkış girişimi.
    - Kamera veya kritik sensör offline olması.
    - Şiddetli hava uyarısı + hazırlık planı yapılmamış olması.
  - Warning:
    - Tekrarlayan küçük ihlaller (hız, park vb.).
    - SLA dışında kalmış bakım talepleri.
  - Info:
    - Günlük özet rapor (operasyon / güvenlik / finans kısa özeti).

---

# Compute Advantage Notes
- Ne lokal, ne cloud?
  - Lokal (marina içinde, Pi5 / Mac mini):
    - Kamera / YOLO inference (mümkünse edge’de).
    - Kapı/bariyer kontrolü, QR/Passkit doğrulama.
    - Sensör verisi toplama (NMEA, hava istasyonu, LoRa).
    - Temel kural motoru (internet yokken minimum yaşam).
  - Cloud / merkezi Ada.Stargate:
    - Büyük LLM reasoning (multi-agent orchestrasyon).
    - RAG + Neo4j + Qdrant + Postgres birleşik sorgular.
    - Cross-node senaryolar (Ada.sea, Ada.travel, Ada.congress ile veri alışverişi).
    - Ağır analitik, tahmin ve optimizasyon (doluluk forecast, fiyat optimizasyonu).

- Hangi yükü hangi cihaza veriyoruz?
  - Pi5 / CM5 kutuları:
    - Gerçek zamanlı IO, sensör, access control.
    - Küçük, deterministik görevler; minimal veya hiç LLM.
  - Mac mini / marina local server:
    - Ada.marina local node (cache, queue, temporer LLM kullanım).
    - Log ve metric koleksiyonu.
  - Cloud (GPU / güçlü CPU):
    - Compute-intensive LLM çağrıları.
    - Çok node’lu Ada ekosistemi için merkezi GraphQL/MCP gateway.
    - Uzun süreli öğrenme, pattern analizi, prediction modelleri.

Bu yapı, Ada ekosisteminde diğer node’lara (Ada.sea.Phisedelia, Ada.travel, Ada.congress) birebir kopyalanabilir; sadece **Context**, **Tools** ve **Success Scenarios** domain’e göre değişir.