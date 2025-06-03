const fs = require('fs');

const domains = [
  {
    url: "https://demo.peoplebox.biz/user/login",
    errorMessage: "DO SUNUCUSUNU KONTROL EDİN!",
  },
  {
    url: "https://demo2.peoplebox.biz/user/login",
    errorMessage: "SH2 SUNUCUSUNU KONTROL EDİN!",
  },
  {
    url: "https://demo91481.peoplebox.biz/user/login",
    errorMessage: "KNET SUNUCUSUNU KONTROL EDİN!",
  },
  // ... diğer domainler ...
];

describe("Sunucu Sağlık Kontrolü", () => {
  domains.forEach((domain) => {
    it(`Kontrol ediliyor: ${domain.url}`, () => {
      cy.request({
        url: domain.url,
        failOnStatusCode: false,
        timeout: 50000,
      }).then((response) => {
        if (response.status >= 400) {
          cy.task("logFailure", {
            url: domain.url,
            errorMessage: domain.errorMessage,
          });
          cy.visit(domain.url, { timeout: 50000 });
          cy.screenshot(domain.url.replace("https://", "").replaceAll("/", "_"));
          throw new Error(domain.errorMessage);
        } else {
          cy.visit(domain.url, { timeout: 50000 });
          cy.get('button[data-testid="submit button"]', { timeout: 30000 }).should("be.visible").catch(() => {
            cy.task("logFailure", {
              url: domain.url,
              errorMessage: domain.errorMessage + " (Buton bulunamadı)",
            });
            cy.screenshot(domain.url.replace("https://", "").replaceAll("/", "_"));
            throw new Error(domain.errorMessage);
          });
        }
      });
    });
  });
});
