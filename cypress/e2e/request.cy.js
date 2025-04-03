const { exec } = require("child_process");

describe("Domain Content Check", () => {
  const domains = [
    {
      url: "https://demo.peoplebox.biz/user/login",
      selector: "._main_1p1ww_22",
      errorMessage: "🚨 DO SUNUCUSUNU KONTROL EDİN!",
    },
    {
      url: "https://demo2123123.peoplebox.biz/user/login",
      selector: "._main_1p1ww_22",
      errorMessage: "🚨 SH2 SUNUCUSUNU KONTROL EDİN!",
    },
    {
      url: "https://demo9123123.peoplebox.biz/user/login",
      selector: "._main_1p1ww_22",
      errorMessage: "🚨 KNET SUNUCUSUNU KONTROL EDİN!",
    },
  ];

  let failedDomains = [];

  domains.forEach((domain) => {
    it(`Checking ${domain.url}`, () => {
      cy.request({
        url: domain.url,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status >= 400) {
          const errorMsg = `🚨 ${domain.url} açılırken hata aldı: ${response.status} → ${domain.errorMessage}`;
          cy.log(errorMsg);
          failedDomains.push(`🌐 ${domain.url} → ${errorMsg}`);
          console.error(errorMsg); // **Hata kesinlikle loglara düşsün diye**
          throw new Error(errorMsg);
        }        
        else {
          cy.visit(domain.url, { failOnStatusCode: false });
          cy.wait(3000);

          cy.get("body").then(($body) => {
            if ($body.find(domain.selector).length === 0) {
              cy.log(domain.errorMessage);
              failedDomains.push(domain.errorMessage);
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
      const errorMessage = `⚠️ *Domain Hataları Tespit Edildi!* \n${failedDomains.join("\n")}`;
      cy.log(errorMessage);
      throw new Error(errorMessage);
    }
  });
});
