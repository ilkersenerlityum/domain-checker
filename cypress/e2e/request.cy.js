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

let failedDomains = [];

describe("Domain Content Check", () => {
  domains.forEach((domain) => {
    it(`Checking ${domain.url}`, () => {
      cy.request({
        url: domain.url,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status >= 400) {
          const errorMsg = `HATA: ${domain.url} açılırken HTTP ${response.status} hatası → ${domain.errorMessage}`;
          cy.task("log", errorMsg);
          failedDomains.push(errorMsg);
          throw new Error(errorMsg);
        } else {
          cy.visit(domain.url, { failOnStatusCode: false });
          cy.wait(3000);
          cy.get("body").then(($body) => {
            if ($body.find(domain.selector).length === 0) {
              const errorMsg = `HATA: ${domain.url} → ${domain.errorMessage}`;
              cy.task("log", errorMsg);
              failedDomains.push(errorMsg);
              throw new Error(errorMsg);
            } else {
              cy.task("log", `OK: ${domain.url} başarılı.`);
            }
          });
        }
      });
    });
  });

  after(() => {
    if (failedDomains.length > 0) {
      const finalMsg = `HATA: Tespit edilen domain sorunları:\n${failedDomains.join("\n")}`;
      cy.task("log", finalMsg);
      throw new Error(finalMsg);
    }
  });
});
