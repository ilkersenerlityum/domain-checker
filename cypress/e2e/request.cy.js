const domains = [
  {
    url: "https://demo.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "DO SUNUCUSUNU KONTROL EDİN!",
  },
  {
    url: "https://demo21331.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "SH2 SUNUCUSUNU KONTROL EDİN!",
  },
];

describe("Sunucu Sağlık Kontrolü", () => {
  domains.forEach((domain) => {
    it(`Kontrol ediliyor: ${domain.url}`, () => {
      cy.request({
        url: domain.url,
        failOnStatusCode: false,
        timeout: 75000,
      }).then((response) => {
        if (response.status >= 400) {
          throw new Error(`HATA: ${domain.url} HTTP ${response.status} → ${domain.errorMessage}`);
        }

        // Yavaşlık uyarısı kaldırıldı (isteğin üzerine)

        cy.visit(domain.url, { timeout: 75000 });
        cy.get("body", { timeout: 75000 }).then(($body) => {
          if ($body.find(domain.selector).length === 0) {
            throw new Error(`HATA: ${domain.url} → ${domain.errorMessage}`);
          }
        });
      });
    });
  });

  // Her test sonunda hata varsa screenshot al
  afterEach(function () {
    if (this.currentTest.state === "failed") {
      const fileName = this.currentTest.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      cy.screenshot(`failures/${fileName}`, { capture: "runner" });
    }
  });

});
