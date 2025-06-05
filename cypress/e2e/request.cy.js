const domains = [
  {
    url: "https://demo123.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "DO SUNUCUSUNU KONTROL EDİN!",
  },
  {
    url: "https://demo2.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "SH2 SUNUCUSUNU KONTROL EDİN!",
  },
  {
    url: "https://demo9123.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "KNET SUNUCUSUNU KONTROL EDİN!",
  },
];

describe("Sunucu Sağlık Kontrolü", () => {
  domains.forEach((domain) => {
    it(`Kontrol ediliyor: ${domain.url}`, () => {
      cy.request({
        url: domain.url,
        failOnStatusCode: false,
        timeout: 35000,
      }).then((response) => {
        if (response.status >= 400) {
          throw new Error(`HATA: ${domain.url} HTTP ${response.status} → ${domain.errorMessage}`);
        }

        cy.visit(domain.url, { timeout: 35000 });

        cy.get(domain.selector, { timeout: 35000 }).should("exist");
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
