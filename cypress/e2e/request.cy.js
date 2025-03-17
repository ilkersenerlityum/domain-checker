const { exec } = require('child_process');

describe('Domain Content Check', () => {
  const domains = [
    { url: 'https://demo.peoplebox.biz/user/login', selector: '._main_1p1ww_22', errorMessage: '🚨 DO SUNUCUSU PATLADI!' },
    { url: 'https://demo2.peoplebox.biz/user/login', selector: '.testeestest', errorMessage: '🚨 SH2 SUNUCUSU PATLADI!' },
    { url: 'https://demo9.peoplebox.biz/user/login', selector: '._main_1p1ww_22', errorMessage: '🚨 KNET SUNUCUSU PATLADI!' }
  ];

  let failedDomains = [];

  domains.forEach((domain) => {
    it(`Checking ${domain.url}`, () => {
      // Sayfa çalışıyor mu kontrol et
      cy.request({
        url: domain.url,
        failOnStatusCode: false
      }).then((response) => {
        if (response.status >= 400) {
          cy.log(`🚨 ${domain.url} açılırken hata aldı: ${response.status}`);
          throw new Error(`🚨 ${domain.url} açılırken hata aldı: ${response.status}`);
        }
      });

      cy.visit(domain.url);
      cy.wait(3000);

      cy.get(domain.selector, { timeout: 3000 }).should('exist').then(() => {
        cy.log(`✅ ${domain.url} is OK!`);
      }).catch(() => {
        cy.log(domain.errorMessage);
        failedDomains.push(`🌐 ${domain.url} → ${domain.errorMessage}`);
        console.log(`🚨 HATA: ${domain.url} → ${domain.errorMessage}`);
        throw new Error(`🚨 HATA: ${domain.url} → ${domain.errorMessage}`);
      });
    });
  });

  after(() => {
    if (failedDomains.length > 0) {
      console.log("🔥 HATALI DOMAINLER:");
      failedDomains.forEach(msg => console.log(msg));
      throw new Error(`⚠️ *Domain Hataları Tespit Edildi!* \n${failedDomains.join('\n')}`);
    }
  });
});
