const { exec } = require('child_process');

describe('Domain Content Check', () => {
  const domains = [
    { url: 'https://demo.peoplebox.biz/user/login', selector: '._main_1p1ww_22', errorMessage: '🚨  DO SUNUCUSUNU KONTROL EDİN!  🚨' },
    { url: 'https://demo2.peoplebox.biz/user/login', selector: '._main_1p1ww_22414', errorMessage: '🚨  SH2 SUNUCUSUNU KONTROL EDİN!  🚨' },
    { url: 'https://demo9.peoplebox.biz/user/login', selector: '._main_1p1ww_22', errorMessage: '🚨  KNET SUNUCUSUNU KONTROL EDİN!  🚨' }
  ];

  let failedDomains = [];

  domains.forEach((domain) => {
    it(`Checking ${domain.url}`, () => {
      cy.visit(domain.url, { failOnStatusCode: false });
      cy.wait(3000);

      cy.get('body').then(($body) => {
        if ($body.find(domain.selector).length === 0) {
          cy.log(domain.errorMessage);
          failedDomains.push(domain.errorMessage); // Hata mesajını listeye ekle

          // Hata olursa e-posta bildirimi gönder
          exec(`node sendMail.js "${domain.errorMessage}"`, (err, stdout, stderr) => {
            if (err) {
              console.error('E-posta gönderilemedi:', err);
            } else {
              console.log('E-posta gönderildi:', stdout);
            }
          });
        } else {
          cy.log(`✅ ${domain.url} is OK!`);
        }
      });
    });
  });

  after(() => {
    // Eğer birden fazla domain patlarsa, bunları kontrol et ve hata mesajı oluştur
    if (failedDomains.length > 0) {
      const errorMessage = `⚠️ Şu domainlerde sorun tespit edildi: \n${failedDomains.join('\n')}`;
      cy.log(errorMessage);

      // E-posta bildirimi gönder
      exec(`node sendMail.js "${errorMessage}"`, (err, stdout, stderr) => {
        if (err) {
          console.error('E-posta gönderilemedi:', err);
        } else {
          console.log('E-posta gönderildi:', stdout);
        }
      });
    }
  });
});
