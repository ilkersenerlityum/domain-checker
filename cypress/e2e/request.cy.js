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
        timeout: 10000, // 10 saniyeye kadar bekletiyorum
      }).then((response) => {
        if (response.status >= 400) {
          throw new Error(`HATA: ${domain.url} HTTP ${response.status} → ${domain.errorMessage}`);
        }

        cy.visit(domain.url, { timeout: 10000 }); // 10 saniyeye kadar bekletiyorum
        cy.get("body", { timeout: 10000 }).then(($body) => {
          if ($body.find(domain.selector).length === 0) {
            throw new Error(`HATA: ${domain.url} → ${domain.errorMessage}`);
          }
        });
      });
    });
  });
});
