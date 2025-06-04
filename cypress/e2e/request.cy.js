const domains = [
  { url: "https://demo.peoplebox.biz/user/login", errorMessage: "DO SUNUCUSUNU KONTROL EDİN!" },
  { url: "https://demo2232.peoplebox.biz/user/login", errorMessage: "SH2 SUNUCUSUNU KONTROL EDİN!" },
];

describe("Sunucu Sağlık Kontrolü", () => {
  before(() => {
    cy.task("clearFailures");
  });

  domains.forEach((domain) => {
    it(`${domain.url} kontrol ediliyor`, () => {
      const screenshotName = domain.url.replace(/https?:\/\//, "").replace(/\//g, "_");

      cy.request({
        url: domain.url,
        failOnStatusCode: false,
        timeout: 30000,
      }).then((response) => {
        if (response.status >= 400) {
          cy.screenshot(screenshotName);
          cy.task("logFailure", {
            url: domain.url,
            errorMessage: domain.errorMessage,
            screenshot: `${screenshotName}.png`,
          });
          expect(response.status, domain.errorMessage).to.be.lessThan(400); // Testi fail ettirir ve mesajı gösterir
        } else {
          cy.visit(domain.url, { timeout: 30000 });
          cy.get('button[data-testid="submit button"]', { timeout: 30000 }).should("be.visible");
        }
      });
    });
  });
});