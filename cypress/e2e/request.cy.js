const { exec } = require('child_process');

describe('Domain Content Check', () => {
  const domains = [
    { url: 'https://demo.peoplebox.biz/user/login', selector: '._main_1p1ww_22', errorMessage: '🚨  DO SUNUCUSU PATLADI!  🚨' },
    { url: 'https://demo2.peoplebox.biz/user/login', selector: '._main_1p1ww_221414', errorMessage: '🚨  SH2 SUNUCUSU PATLADI!  🚨' },
    { url: 'https://demo9.peoplebox.biz/user/login', selector: '._main_1p1ww_22', errorMessage: '🚨  KNET SUNUCUSU PATLADI!  🚨' }
  ];

  const webhookURL = "https://chat.googleapis.com/v1/spaces/AAAAwMjP3Sw/messages?key=API_KEY&token=TOKEN";

  domains.forEach((domain) => {
    it(`Checking ${domain.url}`, () => {
      cy.visit(domain.url, { failOnStatusCode: false });
      cy.wait(3000);

      cy.get('body').then(($body) => {
        if ($body.find(domain.selector).length === 0) {
          cy.log(domain.errorMessage);
          
          // Hata mesajını domain ile birlikte oluştur
          const chatMessage = `⚠️ *Domain Hatası!* \n${domain.errorMessage}\n🌐 *Hatalı URL:* ${domain.url}`;
          
          // Google Chat'e mesaj gönderme
          const curlCommand = `curl -X POST -H "Content-Type: application/json" -d "{\\"text\\": \\"${chatMessage}\\"}" "${webhookURL}"`;

          exec(curlCommand, (err, stdout, stderr) => {
            if (err) {
              console.error('❌ Google Chat mesajı gönderilemedi:', err);
            } else {
              console.log('✅ Google Chat mesajı gönderildi:', stdout);
            }
          });
        } else {
          cy.log(`✅ ${domain.url} is OK!`);
        }
      });
    });
  });
});
