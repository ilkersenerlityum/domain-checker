const { exec } = require("child_process");

describe("Domain Content Check", () => {
  const domains = [
    {
      url: "https://demo.peoplebox.biz/user/login",
      selector: "._main_1p1ww_22",
      errorMessage: "🚨 DO SUNUCUSUNU KONTROL EDİN!",
    },
    {
      url: "https://demo2.peoplebox.biz/user/login",
      selector: "._main_1p1ww_22",
      errorMessage: "🚨 SH2 SUNUCUSUNU KONTROL EDİN!",
    },
    {
      url: "https://demo9.peoplebox.biz/user/login",
      selector: "._main_1p1ww_22",
      errorMessage: "🚨 KNET SUNUCUSUNU KONTROL EDİN!",
    },
  ];

  let failedDomains = [];

  domains.forEach((domain) => {
    it(`Checking ${domain.url}`, () => {
      // Sayfa HTTP hatası veriyor mu kontrol ediyoruz
      cy.request({
        url: domain.url,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status >= 400) {
          const errorMsg = `🚨 ${domain.url} açılırken hata aldı: ${response.status} → ${domain.errorMessage}`;
          cy.log(errorMsg);
          failedDomains.push(`🌐 ${domain.url} → ${errorMsg}`);
          throw new Error(errorMsg);
        } else {
          cy.visit(domain.url, { failOnStatusCode: false });
          cy.wait(3000);

          // Selector'un olup olmadığını kontrol ediyoruz
          cy.get("body").then(($body) => {
            if ($body.find(domain.selector).length === 0) {
              cy.log(domain.errorMessage);
              failedDomains.push(`🌐 ${domain.url} → ${domain.errorMessage}`);
              throw new Error(`🚨 HATA: ${domain.url} → ${domain.errorMessage}`);
            } else {
              cy.log(`✅ ${domain.url} is OK!`);
            }
          });
        }
      });
    });
  });

  after(() => {
    if (failedDomains.length > 0) {
      console.log("🔥 HATALI DOMAINLER:");
      failedDomains.forEach((msg) => console.log(msg));

      const errorMessage = `⚠️ *Domain Hataları Tespit Edildi!* \n${failedDomains.join("\n")}`;
      cy.log(errorMessage);

      // Cypress hataları yakalaması için bir error fırlatıyoruz
      throw new Error(errorMessage);
    }
  });
});
