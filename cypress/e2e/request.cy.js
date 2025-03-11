const { exec } = require('child_process');

describe('Domain Content Check', () => {
  const domains = [
    { url: 'https://demo.peoplebox.biz/user/login', selector: '._main_1p1ww_22', errorMessage: '🚨  DO SUNUCUSUNU KONTROL EDİN!  🚨' },
    { url: 'https://demo2.peoplebox.biz/user/login', selector: '._main_1p1ww_22', errorMessage: '🚨  SH2 SUNUCUSUNU KONTROL EDİN!  🚨' },
    { url: 'https://demo9.peoplebox.biz/user/login', selector: '._main_1p1ww_22', errorMessage: '🚨  KNET SUNUCUSUNU KONTROL EDİN!  🚨' }
  ];

  let failedDomains = [];

  const webhookURL = "https://chat.googleapis.com/v1/spaces/AAAAwMjP3Sw/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=i49oCA6iZzjnInJlJP32a-xE_kkqQuH44R8_SnbcSt0";

  domains.forEach((domain) => {
    it(`Checking ${domain.url}`, () => {
      cy.visit(domain.url, { failOnStatusCode: false });
      cy.wait(3000);

      cy.get('body').then(($body) => {
        if ($body.find(domain.selector).length === 0) {
          cy.log(domain.errorMessage);
          failedDomains.push(domain.errorMessage);

          const chatMessage = `⚠️ *Domain Hatası!* \n${domain.errorMessage}`;
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

  after(() => {
    if (failedDomains.length > 0) {
      const errorMessage = `⚠️ *Domain Hataları Tespit Edildi!* \n${failedDomains.join('\n')}`;
      cy.log(errorMessage);

      const curlCommand = `curl -X POST -H "Content-Type: application/json" -d "{\\"text\\": \\"${errorMessage}\\"}" "${webhookURL}"`;

      exec(curlCommand, (err, stdout, stderr) => {
        if (err) {
          console.error('❌ Google Chat mesajı gönderilemedi:', err);
        } else {
          console.log('✅ Google Chat mesajı gönderildi:', stdout);
        }
      });
    }
  });
});
