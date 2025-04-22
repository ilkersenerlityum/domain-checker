const domains = [
  {
    url: "https://demo.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "DO SUNUCUSUNU KONTROL EDİN!",
  },
  {
    url: "https://demo2.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "SH2 SUNUCUSUNU KONTROL EDİN!",
  },
  {
    url: "https://demo9.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "KNET SUNUCUSUNU KONTROL EDİN!",
  },
  {
    url: "https://corendon.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "CORENDON MÜŞTERİSİNİ KONTROL EDİN!",
  },
  {
    url: "https://ai.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "Aİ MÜŞTERİSİNİ KONTROL EDİN!",
  },
  {
    url: "https://arabamcom.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "ARABAMCOM MÜŞTERİSİNİ KONTROL EDİN!",
  },
  {
    url: "https://iga.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "İGA MÜŞTERİSİNİ KONTROL EDİN!",
  },
  {
    url: "https://orhanholding.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "ORHANHOLDİNG MÜŞTERİSİNİ KONTROL EDİN!",
  },
  {
    url: "https://teleperformance.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "TELEPERFORMANCE MÜŞTERİSİNİ KONTROL EDİN!",
  },
  {
    url: "https://shaya.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "SHAYA MÜŞTERİSİNİ KONTROL EDİN!",
  },
  {
    url: "https://erisim.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "ERİSİM MÜŞTERİSİNİ KONTROL EDİN!",
  },
  {
    url: "https://mavi.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "MAVİ MÜŞTERİSİNİ KONTROL EDİN!",
  },
  {
    url: "https://penti.peoplebox.biz/user/login",
    selector: "._main_1p1ww_22",
    errorMessage: "PENTİ MÜŞTERİSİNİ KONTROL EDİN!",
  },
];

describe("Sunucu Sağlık Kontrolü", () => {
  domains.forEach((domain) => {
    it(`Kontrol ediliyor: ${domain.url}`, () => {
      cy.request({
        url: domain.url,
        failOnStatusCode: false,
        timeout: 20000, // 20 saniyeye kadar bekletiyorum
      }).then((response) => {
        if (response.status >= 400) {
          throw new Error(`HATA: ${domain.url} HTTP ${response.status} → ${domain.errorMessage}`);
        }

        cy.visit(domain.url, { timeout: 10000 }); // 10 saniyeye kadar bekletiyorum
        cy.get("body", { timeout: 10000 }).then(($body) => {
          if ($body.find(domain.selector).length === 0) {
            throw new Error(`HATA: ${domain.url} → ${domain.errorMessage}`);
          }
        });
      });
    });
  });
});
