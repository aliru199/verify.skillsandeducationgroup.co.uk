import {
  cookieConsentConfig,
  cookieTableBody,
  antiForgeryCookie,
  xsrfTokenCookie,
} from "/js/cookieconsent-config.js";
import "/lib/cookieconsent/cookieconsent.umd.js";

//Delete all existing cookies from the cookie table
cookieTableBody.length = 0;

//Add in the verify only cookies
cookieTableBody.push(antiForgeryCookie);
cookieTableBody.push(xsrfTokenCookie);

CookieConsent.run(cookieConsentConfig);
