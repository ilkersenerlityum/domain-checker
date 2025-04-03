const { exec } = require("child_process");

describe("Domain Content Check", () => {
  const domains = [
    {
      url: "https://demo.peoplebox.biz/user/login",
      selector: "._main_1p1ww_22",
      errorMessage: "🚨 DO SUNUCUSUNU KONTROL EDİN!",
    },
    {
      url: "https://demo212321.peoplebox.biz/user/login",
      selector: "._main_1p1ww_22",
      errorMessage: "🚨 SH2 SUNUCUSUNU KONTROL EDİN!",
    },
    {
      url: "https://demo912312.peoplebox.biz/user/login",
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
          const errorMsg = `🔥 LOG HATASI: ${domain.url} açılırken HTTP ${response.status} hatası → ${domain.errorMessage}`;
          cy.log(errorMsg);
          console.log(errorMsg); // stdout'a da yaz
          failedDomains.push(errorMsg);
          throw new Error(errorMsg);
        } else {
          cy.visit(domain.url, { failOnStatusCode: false });
          cy.wait(3000);

          cy.get("body").then(($body) => {
            if ($body.find(domain.selector).length === 0) {
              const errorMsg = `🔥 LOG HATASI: ${domain.url} → ${domain.errorMessage}`;
              cy.log(errorMsg);
              console.log(errorMsg); // stdout'a yaz
              failedDomains.push(errorMsg);
              throw new Error(errorMsg);
            } else {
              cy.log(`✅ ${domain.url} başarılı.`);
            }
          });
        }
      });
    });
  });

  after(() => {
    if (failedDomains.length > 0) {
      const finalMsg = `🔥 LOG HATASI: Tespit edilen domain sorunları:\n${failedDomains.join("\n")}`;
      cy.log(finalMsg);
      console.log(finalMsg); // Google Chat için log'a yaz
      throw new Error(finalMsg);
    }
  });
});
