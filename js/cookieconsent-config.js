import "../lib/cookieconsent/cookieconsent.umd.js";

export const antiForgeryCookie = {
  name: ".AspNetCoreAntiforgery",
  domain: "ASP.NET Core",
  duration: "Session",
  description:
    "Cookie set by sites written with Microsoft .NET based technologies for security.",
};

export const xsrfTokenCookie = {
  name: "XSRF-TOKEN",
  domain: "ASP.NET Core",
  duration: "Session",
  description:
    "Cookie set for website security and Cross-Site-Request forgery prevention.",
};

export const cultureCookie = {
  name: ".AspNetCore.Culture",
  domain: "ASP.NET Core",
  duration: "Session",
  description:
    "Cookie set by sites written with Microsoft .NET based technologies to set the culture/language.",
};

export const identityCookie = {
  name: ".AspNetCore.Identity.Application",
  domain: "ASP.NET Core",
  duration: "1 year",
  description:
    "Cookie set by sites written with Microsoft .NET based technologies for login functionality.",
};

export const AbpAuthCookie = {
  name: "Abp.AuthToken",
  domain: "ABP",
  duration: "24 Hours",
  description: "Cookie set by sites using ABP's swagger API",
};

export const cookieTableBody = [
  antiForgeryCookie,
  identityCookie,
  cultureCookie,
  xsrfTokenCookie,
];

export const cookieConsentConfig = {
  autoClearCookies: true, // Enables automatic cookie removal
  disablePageInteraction: true,

  categories: {
    necessary: {
      enabled: true, // this category is enabled by default
      readOnly: true, // this category cannot be disabled
    },
    //functionality: {
    //    enabled: true,
    //    autoClear: {
    //        cookies: [
    //            { name: 'XSRF-TOKEN' }
    //        ]
    //    },
    //}
  },

  services: {
    necessary: {
      label: "Antiforgery Token",
      cookies: [".AspNetCore.Antiforgery", ".AspNetCore.Identity.Application"],
    },
    //functionality: {
    //    label: "Culture Preference",
    //    cookies: ['XSRF-TOKEN']
    //}
  },

  guiOptions: {
    consentModal: {
      layout: "box",
      position: "bottom left",
      flipButtons: false,
      equalWeightButtons: true,
      autoOpenPreferencesModal: true,
    },
    preferencesModal: {
      layout: "box",
      flipButtons: false,
      equalWeightButtons: true,
    },
  },

  language: {
    default: "en",
    translations: {
      en: {
        consentModal: {
          title: "We value your privacy",
          description:
            "We only use cookies that are required to run our services and basic website functionality. By accepting you agree to the use of essential cookies.",
          acceptAllBtn: "Accept Essentials Cookies",
          /*acceptNecessaryBtn: 'Reject all',*/
          showPreferencesBtn: "View Cookie Details",
        },
        preferencesModal: {
          title: "Cookie Details",
          acceptAllBtn: "Accept Essentials Cookies",
          /* acceptNecessaryBtn: 'Reject all'*/
          /*savePreferencesBtn: 'Accept current selection',*/
          closeIconLabel: "Close modal",
          sections: [
            {
              title: "We use cookies",
              description:
                "We use cookies to help you navigate efficiently and perform certain functions. You will find detailed information about all cookies below.",
            },
            {
              title: "Strictly Essential cookies",
              description:
                "These cookies are stored on your browser as they are essential for enabling the basic functionalities of the site. These cookies do not store any personally identifiable data.",

              linkedCategory: "necessary",
              cookieTable: {
                headers: {
                  name: "Name",
                  domain: "Service",
                  duration: "Duration",
                  description: "Description",
                },
                body: cookieTableBody,
              },
            },
            //{
            //    title: 'Functionality Cookies',
            //    description: 'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
            //    linkedCategory: 'functionality',
            //    cookieTable: {
            //        headers: {
            //            name: "Name",
            //            domain: "Service",
            //            description: "Description"
            //        },
            //        body: [
            //            {
            //                name: ".AspNetCore.Culture",
            //                domain: "ASP.NET Core",
            //                description: "Cookie set by ASP.NET Core"
            //            }
            //        ]
            //    }
            //},
          ],
        },
      },
    },
  },
};

CookieConsent.run(cookieConsentConfig);
