const domains = [
  {
    url: "https://demo.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "DO SUNUCUSUNU KONTROL EDİN!",
  },
  {
    url: "https://demo2.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "SH2 SUNUCUSUNU KONTROL EDİN!",
  },
  {
    url: "https://demo9.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22123123",
    errorMessage: "KNET SUNUCUSUNU KONTROL EDİN!",
  },
];

describe("Sunucu Sağlık Kontrolü", () => {
  domains.forEach((domain) => {
    it(`Kontrol ediliyor: ${domain.url}`, () => {
      // HTTP isteği gönder
      cy.request({
        url: domain.url,
        failOnStatusCode: false, // Hata durumunu elle kontrol edeceğiz
      }).then((response) => {
        // HTTP durumu kontrolü
        if (response.status >= 400) {
          throw new Error(`HATA: ${domain.url} HTTP ${response.status} → ${domain.errorMessage}`);
        }

        // Sayfa açılıyor ve içerik kontrolü yapılıyor
        cy.visit(domain.url);
        cy.get("body").then(($body) => {
          if ($body.find(domain.selector).length === 0) {
            throw new Error(`HATA: ${domain.url} → ${domain.errorMessage}`);
          }
        });
      });
    });
  });
});
