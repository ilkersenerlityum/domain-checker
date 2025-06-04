const domains = [
  { url: "https://demo.peoplebox.biz/user/login", errorMessage: "DO SUNUCUSUNU KONTROL EDİN!" },
  { url: "https://demo2232.peoplebox.biz/user/login", errorMessage: "SH2 SUNUCUSUNU KONTROL EDİN!" },
];

describe("Sunucu Sağlık Kontrolü", () => {
  domains.forEach((domain) => {
    it(`Kontrol ediliyor: ${domain.url}`, () => {
      const screenshotName = domain.url.replace(/https?:\/\//, "").replace(/\//g, "_");

      cy.request({
        url: domain.url,
        failOnStatusCode: false,
        timeout: 30000,
      }).then((response) => {
        if (response.status >= 400) {
          cy.screenshot(screenshotName).then(() => {
            cy.task("logFailure", {
              url: domain.url,
              errorMessage: domain.errorMessage,
              screenshot: `${screenshotName}.png`,
            });
          });

          cy.wrap(response.status).should("be.lessThan", 400); // test burada fail etsin
        } else {
          cy.visit(domain.url, { timeout: 30000 });
          cy.get('button[data-testid="submit button"]', { timeout: 30000 }).should("be.visible");
        }
      });
    });
  });
});
