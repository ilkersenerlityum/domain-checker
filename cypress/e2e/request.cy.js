const { exec } = require("child_process");

describe("Domain Content Check", () => {
  const domains = [
    {
      url: "https://demo.peoplebox.biz/user/login",
      selector: "._main_1p1ww_22",
      errorMessage: "🚨 DO SUNUCUSUNU KONTROL EDİN!",
    },
    {
      url: "https://demo21231.peoplebox.biz/user/login",
      selector: "._main_1p1ww_22",
      errorMessage: "🚨 SH2 SUNUCUSUNU KONTROL EDİN!",
    },
    {
      url: "https://demo912124.peoplebox.biz/user/login",
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
          failedDomains.push(errorMsg);
          console.error("🔥 LOG HATASI:", errorMsg); // GitHub Actions loglarına yaz
          throw new Error(errorMsg);
        } else {
          cy.visit(domain.url, { failOnStatusCode: false });
          cy.wait(3000);

          cy.get("body").then(($body) => {
            if ($body.find(domain.selector).length === 0) {
              cy.log(domain.errorMessage);
              failedDomains.push(domain.errorMessage);
              console.error("🔥 LOG HATASI:", domain.errorMessage); // GitHub Actions loglarına yaz
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
    if (failed
