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
        const status = response.status;

        if (status >= 400) {
          // Önce task çalışsın
          cy.task("logFailure", {
            url: domain.url,
            errorMessage: domain.errorMessage,
            screenshot: `${screenshotName}.png`,
          }).then(() => {
            // Sonra screenshot alınsın
            cy.screenshot(screenshotName);
          });

          // En sonda test fail olsun (diğer işlemler önce çalışsın diye)
          cy.wrap(status, { log: false }).should("be.lessThan", 400);
        } else {
          cy.visit(domain.url, { timeout: 30000 });
          cy.get('button[data-testid="submit button"]', { timeout: 30000 }).should("be.visible");
        }
      });
    });
  });
});
