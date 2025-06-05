const domains = [
  {
    url: "https://demo515.peoplebox.biz/user/login",
    errorMessage: "DO SUNUCUSUNU KONTROL EDİN!",
  },
  {
    url: "https://demo21331.peoplebox.biz/user/login",
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

        cy.visit(domain.url, { timeout: 75000 });

        // Sadece butonun varlığını 30 saniyeye kadar bekle
        cy.get('button[data-testid="submit button"]', { timeout: 30000 }).should('exist');
      });
    });
  });

  afterEach(function () {
    if (this.currentTest.state === "failed") {
      const fileName = this.currentTest.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      cy.screenshot(`failures/${fileName}`, { capture: "runner" });
    }
  });
});
