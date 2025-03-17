const { exec } = require('child_process');

describe('Domain Content Check', () => {
  const domains = [
    { url: 'https://demo.peoplebox.biz/user/login', selector: '._main_1p1ww_22', errorMessage: '🚨 DO SUNUCUSU PATLADI!' },
    { url: 'https://demo2.peoplebox.biz/user/login', selector: '._main_1p1ww_22123', errorMessage: '🚨 SH2 SUNUCUSU PATLADI!' },
    { url: 'https://demo9.peoplebox.biz/user/login', selector: '._main_1p1ww_22', errorMessage: '🚨 KNET SUNUCUSU PATLADI!' }
  ];

  let failedDomains = [];

  domains.forEach((domain) => {
    it(`Checking ${domain.url}`, () => {
      cy.visit(domain.url, { failOnStatusCode: false });
      cy.wait(3000);

      cy.get('body').then(($body) => {
        if ($body.find(domain.selector).length === 0) {
          cy.log(domain.errorMessage);
          failedDomains.push(`🌐 ${domain.url} → ${domain.errorMessage}`);

          // **LOG dosyasına hatayı yazdır**
          console.log(`🚨 HATA: ${domain.url} → ${domain.errorMessage}`);
        } else {
          cy.log(`✅ ${domain.url} is OK!`);
        }
      });
    });
  });

  after(() => {
    if (failedDomains.length > 0) {
      console.log("🔥 HATALI DOMAINLER:");
      failedDomains.forEach(msg => console.log(msg));

      const errorMessage = `⚠️ *Domain Hataları Tespit Edildi!* \n${failedDomains.join('\n')}`;
      cy.log(errorMessage);
    }
  });
});
