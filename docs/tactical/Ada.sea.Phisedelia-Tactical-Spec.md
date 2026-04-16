# Mission
- Node: Ada.sea.Phisedelia
- Primary Goal:
  - Otonom yarış teknesi S/Y Phisedelia'nın açık deniz yarışlarında (Volvo Ocean Race / Ocean Globe Race) optimum performans, güvenlik ve kural uyumu ile ilerlemesini sağlamak.
  - Denizdeki tüm operasyonel karar alma süreçlerini (rota optimizasyonu, yelken seçimi, manevra zamanlaması) otonom olarak yönetmek.
- Secondary Goals:
  - Gerçek zamanlı NMEA2000 sensör verilerini işleyerek tekne sistemlerinin bütünlüğünü izlemek.
  - COLREGs (Denizde Çatışmayı Önleme Tüzüğü) ve yarış kurallarına (OSR) anlık uyumu sağlamak.
  - Optimizasyon algoritmaları kullanarak, rüzgar ve akıntıya göre en hızlı ve güvenli rotayı dinamik olarak belirlemek.
  - İnsan ekibe sadece "denetleme" ve "stratejik onay" rolü bırakmak.

---

# Context
- Data sources:
  - Tekne temel verisi:
    - LOA, beam, draft, deplasman, direk yüksekliği, yelken alanı.
    - Polar diyagramlar (farklı rüzgar hız ve açılarında tekne hız performans tabloları).
    - Yelken envanteri (boyut, tipi, kullanım koşulları).
    - Sensör kalibrasyon verileri (AIS, radar, derinlik, rüzgar).
  - Operasyonel veriler:
    - NMEA2000 bus verileri (rüzgar hızı/yönü, SOG, COG, tekne hızı/yönü, derinlik, GPS).
    - Gyro/IMU verileri (heel, pitch, roll, yaw).
    - Motor devri, yakıt seviyesi, akü voltaj/akım.
    - Seyir planı, rotalar, ara noktalar (waypoints).
  - Yarış verileri:
    - Yarış kuralları (Ocean Race Sailing Rules / World Sailing OSR).
    - Rakip AIS verileri, pozisyon raporları.
    - Start/finish line koordinatları, geçiş noktaları (gates).
    - Protesto bildirimleri, yarış komitesinden gelen anonslar.
- External APIs:
  - Hava durumu & okyanus verisi:
    - GRIB dosyaları (rüzgar, dalga, akıntı tahminleri).
    - Satellite görüntüleri (bulut, fırtına tespiti).
    - PredictWind / OceanWeather benzeri özel denizcilik API’leri.
  - Uydu iletişim:
    - Starlink / Iridium (düşük gecikmeli veri senkronizasyonu).
  - Karar destek sistemleri:
    - Route Optimization (çeşitli rotalama motorları).
  - Yarış komitesi:
    - Race HQ API (pozisyon güncelleme, kural ihlali bildirimleri).

- Hardware / Sensors:
  - Tekne üzerinde:
    - GPS alıcıları (RTK özellikli, yüksek doğruluk).
    - NMEA2000 Gateway / SignalK server (tüm sensör verilerini toplar).
    - Ultrasonik rüzgar sensörleri (masthead, redundant).
    - Foward-looking sonar (sığ su / engel tespiti).
    - Radar (uzun menzil, darbe modlu).
    - AIS transponder (Class A/B).
    - Otonom direksiyon / yelken trim aktüatörleri.
    - IMU / Gyro sensörleri (trim, denge kontrolü).
    - Bilgisayar vizyonu (kamera, buğu tespiti, yelken formu izleme).
    - Akü yönetim sistemi (BMS), yakıt ve su tankı sensörleri.
  - İletişim:
    - VHF telsiz (DSC Class A).
    - Uydu modemleri (Starlink/Iridium).

- Constraints (offline, latency, legal, safety, energy budget):
  - Offline:
    - Okyanus ortasında internet kesildiğinde hayati navigasyon, kural uyumu ve güvenlik sistemleri %100 otonom çalışmalı.
    - Lokal GRIB verisi önbelleğe alınmalı.
    - LLM yerine rule-based ve deterministik algoritmalar kullanılmalı.
  - Latency:
    - Çatışmayı önleme manevraları için < 100 ms karar/aksiyon gecikmesi.
    - Rüzgar değişimlerine yelken trimi yanıtı < 500 ms.
    - LLM sadece stratejik planlama (örn. yarış stratejisi) ve post-event raporlamada yer almalı.
  - Legal:
    - COLREGs (Denizde Çatışmayı Önleme Tüzüğü) ihlalleri sıfıra indirilmeli.
    - Yarış kurallarına tam uyum.
    - Uydu iletişim gizliliği (KVKK/GDPR).
  - Safety:
    - Mekanik arıza durumlarında (direksiyon, yelken sistemleri) otomatik yedekleme (redundancy) veya "fail-safe" modlarına geçiş.
    - Acil durum sinyalleri (EPIRB/PLB) otomatik tetikleme.
    - Hava durumu uyarılarında otomatik olarak "güvenli moda" geçiş (yelken küçültme, rota değiştirme).
  - Energy Budget:
    - Akü deşarj limitleri, jeneratör kullanım optimizasyonu.
    - Sensör ve işlemci gücünü duruma göre ayarlama (örn. sakin denizde daha az radar taraması).

---

# Tools (MCP / FastAPI / GraphQL)
- Tool-1: `mcp-sea-nmea-gateway`
  - Görev: NMEA2000/SignalK verilerini gerçek zamanlı okuma, filtreleme, normalizasyon ve yazma (otonom dümen, yelken trimi).
- Tool-2: `mcp-sea-colregs-engine`
  - Görev: Radar, AIS, kamera verilerini kullanarak COLREGs'e göre çatışma riski tespiti ve manevra önerisi.
- Tool-3: `mcp-sea-polar-optimizer`
  - Görev: Anlık rüzgar, dalga ve tekne trimine göre polar diyagramlardan en uygun yelken kombinasyonu ve tekne hızı hesaplama.
- Tool-4: `mcp-sea-route-planner`
  - Görev: GRIB verisi ve yarış kurallarını dikkate alarak optimum rota çizimi ve sürekli rota güncellemeleri.
- Tool-5: `mcp-sea-system-monitor`
  - Görev: Akü, yakıt, su, motor, bilge gibi tüm tekne sistemlerinin durumunu izleme ve anomali tespiti.
- Tool-6: `mcp-sea-sail-trimmer`
  - Görev: Rüzgar verilerine göre ana yelken, flok, balon gibi yelkenlerin otonom trim ayarları.
- Tool-7: `mcp-sea-race-hq-comm`
  - Görev: Yarış komitesi ile veri alışverişi (pozisyon raporları, kural ihlali sorguları, anonslar).
- Tool-8: `mcp-sea-sat-comm`
  - Görev: Starlink/Iridium üzerinden karadaki Ada.marina node'u veya yarış komitesi ile güvenli ve loglanmış iletişim.
- Tool-9: `mcp-sea-emergency`
  - Görev: Acil durum sinyali (EPIRB), uyarı mesajı gönderme, en yakın liman/yardım rotası hesaplama.
- Tool-10: `mcp-sea-vision`
  - Görev: Kamera görüntülerini işleyerek buğu, yelken formu, ufuk çizgisi tespiti ve engel algılama.

---

# Agent Topology
- Orchestrator:
  - `Ada.sea.Phisedelia.orchestrator` (local node orchestrator).
  - Görev:
    - Yarış stratejisini anlamak (hızlı, güvenli, rakibe göre).
    - Uygun domain agent’lara görev dağıtmak.
    - Tool çağrılarını planlamak, sıraya koymak, sonuçları birleştirip tek cevap üretmek.

- Domain Agents:
  - `NavigationAgent`
    - GPS, rota, derinlik, COLREGs uyumu üzerinden navigasyonu yönetir.
  - `PerformanceAgent`
    - Rüzgar, dalga, yelken trimi, polar diyagramları kullanarak tekne hızını ve performansını optimize eder.
  - `SafetyAgent`
    - Çatışma riski, sistem arızaları, hava durumu uyarılarını izler ve acil durum protokollerini tetikler.
  - `RaceStrategyAgent`
    - Rakip pozisyonları, yarış kuralları, geçiş noktalarına göre yarış stratejileri geliştirir ve uygular.
  - `SystemHealthAgent`
    - Akü, motor, yakıt, su gibi tekne sistemlerinin durumunu izler, anomali ve arıza raporları üretir.
  - `CommunicationAgent`
    - VHF, uydu ve yarış komitesi ile iletişimi yönetir, pozisyon raporlarını otomatik gönderir.

- Evaluator / Judge Agent:
  - `COLREGs_Judge`
    - `NavigationAgent`'ın manevra önerilerini COLREGs'e göre değerlendirir:
      - "COLREGs Uyumlu - otomatik uygula"
      - "COLREGs Uyumlu ama insan onayı iste (örn. kısıtlı görüş)"
      - "COLREGs İhlali - red + gerekçe" kararını üretir.

- Sandbox / Execution Env:
  - `AgentSandbox` (E2B / Modal benzeri bir safe execution ortamı; tekne üzerinde Docker tabanlı, hafif Python/MicroPython).
  - Kullanım:
    - Karmaşık matematiksel optimizasyonlar (örn. yelken alanı hesabı).
    - NMEA verileri üzerinde anlık analizler, filtreleme.
    - Rota çizim algoritmaları, GRIB işleme.

---

# Autonomy Levels
- L0: Sadece öneri
  - Agent’lar sadece Kaptana/Taktikçiye öneri bırakır, hiçbir sistemi değiştirmez.
  - Örnek: "Mevcut rüzgar koşullarında Code 3 yelkenini açmanız önerilir."

- L1: Öner + detaylı log
  - Öneriye ek olarak, tüm sensör verileri ve kurallar referanslarıyla birlikte açıklamalı log üretir.
  - Örnek: "Bu öneri, Polar diyagramlara göre 18 kn rüzgarda en yüksek VMG'yi (Velocity Made Good) sağlamak için yapılmıştır. Referans: Polar_V3.2."

- L2: Onaylı otomasyon
  - İnsan onayı gerektiren ama onay sonrası otomatik uygulanan işler.
  - Örnek:
    - Otonom dümen sistemine rota değişikliği komutu gönderme (Kaptan onayı sonrası).
    - Yelken trim ayarlarını uygulama (Taktikçi onayı sonrası).
    - Yarış komitesine protesto bildirimi taslağı hazırlama.

- L3: Full otomasyon (kritik limitler dahil)
  - Belirlenmiş güvenli sınırlar içinde insan onayı olmadan aksiyon alır.
  - Örnek:
    - COLREGs ihlali riski durumunda otomatik olarak manevra yapma (çatışmayı önleme).
    - Rüzgar hızının 35 kn üzerine çıkması durumunda otomatik yelken küçültme.
    - Akü voltajının kritik seviyeye düşmesi durumunda jeneratörü otomatik çalıştırma.
  - Sınırlama:
    - Yarış stratejisi değiştirme, rota dışına çıkma, motor çalıştırma gibi durumlar için her zaman en az L2 (insan onayı) gerekir.

---

# Success Criteria (Acceptence Tests)
- Scenario 1: Çatışma Riski Manevrası
  - Girdi:
    - AIS: Başka bir tekne 0.5nm mesafede, CPA (Closest Point of Approach) düşüyor.
    - Radar: Tekne tespit edildi, kilitlendi.
    - Sensör: Görüş mesafesi 1nm'den az.
  - Beklenen:
    - 100 ms içinde:
      - `COLREGs_Judge` "COLREGs Rule 15: Crossing Situation" ihlali riski tespit eder.
      - `NavigationAgent` otomatik olarak sancak iskeleye rota değişikliği (yol veren tekne).
      - Otonom dümen sistemi rota değişikliğini uygular.
      - Kaptana "Otonom Manevra: Çatışma Önleme" bildirimi gider.

- Scenario 2: Rota Optimizasyonu (GRIB entegrasyonu)
  - Girdi:
    - Yarış rotası (waypoint listesi).
    - Güncel GRIB verisi (ileriki 24 saat için rüzgar, dalga).
    - Tekne polar diyagramı.
  - Beklenen:
    - 30 sn içinde:
      - `RoutePlannerAgent` mevcut ve tahmini koşullara göre en hızlı 3 alternatif rotayı çizer.
      - Her rota için tahmini varış süresi (ETA) ve yelken değiştirme stratejilerini sunar.
      - Kaptana "Optimum Rota Önerisi" sunulur.

- Scenario 3: Kritik Akü Deşarjı
  - Girdi:
    - BMS: Servis akü voltajı 23.5V altına düştü.
    - `SystemHealthAgent` kritik eşik tespiti.
  - Beklenen:
    - 5 sn içinde:
      - `SystemHealthAgent` otomatik olarak jeneratörü çalıştırır.
      - Kaptana "Akü Kritik: Jeneratör Devrede" bildirimi gönderir.
      - `SystemHealthAgent` şarj verilerini izlemeye başlar.

- Scenario 4: Yarış Kuralları İhlali Sorgusu
  - Girdi:
    - Kaptan: "Rakip X teknesi benden 10nm uzakta, rüzgar altı pozisyonunda. Rüzgarımı kesiyor mu?"
  - Beklenen:
    - `RaceStrategyAgent`:
      - Rakibin mevcut ve anlık rota tahminini yapar.
      - "World Sailing OSR Rule X.Y" referansını kullanarak bir değerlendirme yapar.
      - Kaptana "Kural İhlali Potansiyeli: Protesto Hazırlığı" önerisi sunar (delilleri ile).

---

# Observability
- Logs:
  - Her agent için ayrı log stream:
    - `orchestrator.log`, `navigation.log`, `performance.log`, `safety.log` vb.
  - İçerik:
    - Gelen sensör verisi özetleri.
    - `COLREGs_Judge` kararları, referans kurallar.
    - Uygulanan manevra (dümen açısı, yelken trimi).
    - Sistem hata / arıza durumları.
  - Güvenlik:
    - Tüm karar ve aksiyonlar değiştirilemez audit logda tutulmalı (KVKK/GDPR uyumu).

- Metrics:
  - Tekne performansı:
    - VMG (Velocity Made Good) yüzdesi.
    - Ortalama yelken değiştirme süresi.
    - Dümen açısı sapmaları (otonom dümen performansı).
  - Sistem sağlığı:
    - Akü şarj döngüleri.
    - Motor çalışma saatleri.
    - Sensör hata oranları.
  - Otonomi:
    - L0/L1/L2/L3 aksiyon dağılımları.
    - `COLREGs_Judge`'ın "red" kararı oranı (Kural ihlali tespitleri).
  - Enerji:
    - Günlük enerji tüketimi (kWh), jeneratör kullanım sıklığı.

- Alerts:
  - Critical:
    - COLREGs ihlali riski (çatışma önleme manevrası gerektiren durum).
    - Sistem arızası (dümen, motor).
    - Akü voltajı kritik eşik altına düşmesi.
    - Şiddetli hava uyarısı + otomatik güvenli mod geçişi yapılamaması.
  - Warning:
    - Rota dışına çıkma.
    - Performans düşüşü (Polar diyagramdan sapma).
    - Yedek sensör devreye girmesi.
  - Info:
    - Günlük yarış özeti (pozisyon, rakip takibi, hava durumu).

---

# Compute Advantage Notes
- Ne lokal, ne cloud?
  - Lokal (tekne üzerinde, Pi5 / CM5 kutuları / NVIDIA Jetson):
    - Gerçek zamanlı NMEA işleme, sensör verisi analizi.
    - Otonom dümen / yelken trim kontrolü (<100ms gecikme).
    - COLREGs çatışma önleme algoritmaları (ultra düşük gecikme, internet yokken hayati).
    - Bilgisayar vizyonu (kamera, yelken formu, buğu tespiti).
  - Cloud / merkezi Ada.Stargate (varsa):
    - Büyük LLM tabanlı stratejik rota optimizasyonu (uzun dönem GRIB analizi).
    - Yarış komitesi ile veri senkronizasyonu.
    - Uzun süreli öğrenme, pattern analizi, prediction modelleri (rakip tahmini).

- Hangi yükü hangi cihaza veriyoruz?
  - Pi5 / CM5 / Jetson kutuları:
    - Gerçek zamanlı sensör füzyonu, dümen/yelken kontrolü.
    - Küçük, deterministik görevler; minimal veya hiç LLM.
  - Cloud (GPU / güçlü CPU):
    - Compute-intensive LLM çağrıları.
    - Çok node’lu Ada ekosistemi için merkezi GraphQL/MCP gateway.
    - Uzun süreli öğrenme, pattern analizi, prediction modelleri.

Bu yapı, Ada ekosisteminde diğer node’lara (Ada.marina.WIM, Ada.travel, Ada.congress) birebir kopyalanabilir; sadece **Context**, **Tools** ve **Success Scenarios** domain’e göre değişir.