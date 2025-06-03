const domains = [
  { url: "https://demo.peoplebox.biz/user/login", errorMessage: "DO SUNUCUSUNU KONTROL EDİN!" },
  { url: "https://demo2232.peoplebox.biz/user/login", errorMessage: "SH2 SUNUCUSUNU KONTROL EDİN!" },
  { url: "https://demo91481.peoplebox.biz/user/login", errorMessage: "KNET SUNUCUSUNU KONTROL EDİN!" },
  { url: "https://corendon.peoplebox.biz/user/login", errorMessage: "CORENDON MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://ai.peoplebox.biz/user/login", errorMessage: "Aİ MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://arabamcom.peoplebox.biz/user/login", errorMessage: "ARABAMCOM MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://iga.peoplebox.biz/user/login", errorMessage: "İGA MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://orhanholding.peoplebox.biz/user/login", errorMessage: "ORHANHOLDİNG MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://teleperformance.peoplebox.biz/user/login", errorMessage: "TELEPERFORMANCE MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://shaya.peoplebox.biz/user/login", errorMessage: "SHAYA MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://erisim.peoplebox.biz/user/login", errorMessage: "ERİSİM MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://mavi.peoplebox.biz/user/login", errorMessage: "MAVİ MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://penti.peoplebox.biz/user/login", errorMessage: "PENTİ MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://nbs.peoplebox.biz/user/login", errorMessage: "NBS MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://viennalife.peoplebox.biz/user/login", errorMessage: "VİENNALİFE MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://eae.peoplebox.biz/user/login", errorMessage: "EAE MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://flypgs.peoplebox.biz/user/login", errorMessage: "FLYPGS MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://nobelilac.peoplebox.biz/user/login", errorMessage: "NOBELİLAC MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://marubeni.peoplebox.biz/user/login", errorMessage: "MARUBENİ MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://ozakglobal.peoplebox.biz/user/login", errorMessage: "OZAKGLOBAL MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://acikholding.peoplebox.biz/user/login", errorMessage: "ACİKHOLDİNG MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://sanovel.peoplebox.biz/user/login", errorMessage: "SANOVEL MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://viennalifeakademi.peoplebox.biz/user/login", errorMessage: "VİENNALİFEAKADEMİ MÜŞTERİSİNİ KONTROL EDİN!" },
  { url: "https://anex.peoplebox.biz/user/login", errorMessage: "ANEX MÜŞTERİSİNİ KONTROL EDİN!" },
];

describe("Sunucu Sağlık Kontrolü", () => {
  domains.forEach(({ url, errorMessage }) => {
    it(`Kontrol ediliyor: ${url}`, () => {
      cy.request({
        url,
        failOnStatusCode: false,
        timeout: 30000,
      }).then((response) => {
        if (response.status >= 400) {
          const screenshotName = url.replace(/https?:\/\//, "").replace(/\//g, "_");
          cy.visit("about:blank");
          cy.screenshot(screenshotName);
          cy.task("logFailure", { url, errorMessage, screenshot: `${screenshotName}.png` });
          expect(response.status).to.be.lessThan(400);
        } else {
          cy.visit(url, { timeout: 30000 });
          cy.get('button[data-testid="submit button"]', { timeout: 30000 }).should("be.visible");
        }
      });
    });
  });
});
