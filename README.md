# AlpTaskManager



Elimden geldiğince yalın bir yapı kurguladım:

Bu bir "Study Case" olduğu için hazır bir kütüphane yerine, kendi servis katmanımı ve hook yapımı kurarak altyapıyı manuel yönettim.
Projenin ölçeği "Prop Drilling" sorunu yaratacak büyüklükte değil. Global state yönetimi eklemek over-engineering olacaktı. State'i lokal tutarak performansı artırdım ve karmaşıklığı düşürdüm.
Salt CRUD işlemleri için Service Pattern yeterli ve daha okunaklı özellikle case kapsamında. CQRS gibi karmaşık bir pattern, bu ölçekteki bir projede kod takibini zorlaştırmaktan başka bir işe yaramayacaktı bu yüzden ekstradan onu uygulamadım.
Arayüzü olabildiğince basit tuttum gidip jiraya da benzetebilirdik ama önemli olan studycase içinde de belirtildiği üzere teknik kısım olduğundan eforu tasarımdan ziyade teknik kısma ayırdım.



Kod incelendiğinde görülecek talep edilen standart yapıların yanı sıra, operasyonel süreçleri kolaylaştıran şu eklentileri de ekledim

* **Docker & Docker Compose:** Tek komutla tüm ortamın (DB + API + UI) ayağa kalkması.
* **Auto-Migration:** Konteyner başladığında veritabanı tablolarının otomatik oluşturulması.
* **Soft Delete:** Verilerin fiziksel silinmemesi, `IsDeleted` flag'i ile yönetilmesi.

---

## Docker ile çalıştırabilirsiniz. Servis yapılanması mevcut.


1.  **Projeyi indirebilirsiniz**
    ```bash
    git clone https://github.com/dev-alp/alpTaskManager
    ```

2.  **Tek Komutla Başlatabilirsiniz**
    ```bash
    docker-compose up --build
    ```

**Adresler:**
* **Uygulama:** http://localhost:5173
* **API Swagger:** http://localhost:5062/swagger
