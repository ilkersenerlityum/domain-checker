const { exec } = require('child_process');

describe('Domain Content Check', () => {
  const domains = [
    { url: 'https://demo.peoplebox.biz/user/login', selector: '._main_1p1ww_22'},
    { url: 'https://demo2.peoplebox.biz/user/login', selector: '._main_1p1ww_22'},
    { url: 'https://demo9.peoplebox.biz/user/login', selector: '._main_1p1ww_22'}
  ];

  domains.forEach((domain) => {
    it(`Checking ${domain.url}`, () => {
      cy.visit(domain.url, { failOnStatusCode: false });
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.find(domain.selector).length === 0) {
          const errorMessage = `❌ ${domain.url} is missing critical element: ${domain.selector}`;
          cy.log(errorMessage);

          // Hata olursa e-posta bildirimi gönder
          exec(`node sendMail.js "${errorMessage}"`, (err, stdout, stderr) => {
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
});