/* ============================================================================
   MARYVILLE SOCCER CAMP — SITE DATA
   ----------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT EACH YEAR.

   Change a date or a price here and it updates everywhere on the site
   automatically. Nothing below needs to be touched in the HTML files.

   HOW IT WORKS
   Any element in the HTML with data-mc="camps.elite.dayPrice" gets its text
   replaced with the matching value below. Any element with
   data-mc-href="camps.elite.registrationUrl" gets its link set.

   VERIFY WITH COACH BEFORE PUBLISHING — see CONTENT-CHECKLIST.md
   ========================================================================== */

const siteData = {

  /* --------------------------------------------------------------------
     ANNOUNCEMENT BAR
     Shown at the very top of every page. To close registration, just
     change the text — e.g. "2027 Camp Dates Coming Soon".
     Set `announcementLink` to "" to make the bar plain text (no link).
     -------------------------------------------------------------------- */
  registrationStatus: "2026 camp registration is open",
  announcementLinkText: "Register",
  announcementLink: "register.html",

  /* --------------------------------------------------------------------
     CONTACT
     -------------------------------------------------------------------- */
  contact: {
    email: "maryvillesoccercamp@gmail.com",
    phone: "865-256-4070",
    phoneDial: "+18652564070"          // used for tel: links
  },

  /* --------------------------------------------------------------------
     LOCATION
     -------------------------------------------------------------------- */
  location: {
    college: "Maryville College",
    city: "Maryville, Tennessee",
    checkIn: "Cooper Athletic Center",
    // VERIFY WITH COACH: confirm this is the address parents should drive to.
    mapsUrl: "https://maps.google.com/?q=Maryville+College,+502+E+Lamar+Alexander+Pkwy,+Maryville,+TN+37804",
    campusUrl: "https://www.maryvillecollege.edu/",
    athleticsUrl: "https://mcscots.com/"
  },

  /* --------------------------------------------------------------------
     PAYMENT
     Stored once. Referenced by the FAQ page and both camp pages.
     VERIFY MAILING ADDRESS WITH COACH BEFORE PUBLISHING FUTURE VERSIONS.
     -------------------------------------------------------------------- */
  payment: {
    checkPayableTo: "Maryville Soccer Camp",
    checkRecipient: "Pepe Fernandez",
    checkStreet: "2101 Chippendale Drive",
    checkCityStateZip: "Maryville, TN 37803",
    // VERIFY WITH COACH: is PayPal still the provider for 2026?
    // Leaving this blank hides the "Pay online" button in the FAQ.
    onlinePaymentUrl: "",
    onlinePaymentName: "PayPal",
    note: "Cash or check only on the day of camp. NCAA regulations prohibit discounts."
  },

  /* --------------------------------------------------------------------
     CAMPS
     -------------------------------------------------------------------- */
  camps: {

    prospect: {
      name: "ID & Prospect Camp",
      shortName: "ID & Prospect",
      category: "College experience",
      page: "id-prospect.html",
      audience: "College-bound players",
      // VERIFY WITH COACH: 2026 dates.
      menDate: "Saturday, February 14, 2026",
      menDateShort: "Feb 14",
      womenDate: "Sunday, February 15, 2026",
      womenDateShort: "Feb 15",
      datesShort: "February 14–15, 2026",
      price: "$110",
      priceNote: "Lunch included",
      // NOTE: the old Google Site used TWO DIFFERENT forms for this camp.
      // The homepage linked to the docs.google.com form below; the ID camp
      // page linked to https://goo.gl/forms/ksjU3xZmJObtYCM63
      // VERIFY WITH COACH which form is live for 2026.
      registrationUrl: "https://docs.google.com/forms/d/e/1FAIpQLScuE1741Drt3EwkHoWLa-IEm1d1FY20RG9Sf_cIB8TbloOz2A/viewform"
    },

    elite: {
      name: "Elite Camp",
      shortName: "Elite Camp",
      category: "Day & overnight",
      page: "elite-camp.html",
      audience: "Boys & girls, ages 8–17",
      ages: "8–17",
      dates: "May 31 – June 4, 2026",
      datesShort: "May 31 – Jun 4",
      dayPrice: "$235",
      dayPriceNote: "Includes lunch Monday–Wednesday",
      overnightPrice: "$440",
      overnightPriceNote: "Includes three meals Monday–Wednesday and breakfast Thursday",
      registrationUrl: "https://docs.google.com/forms/d/e/1FAIpQLSf66xjzX2rTckOCe9j8HA39jCD5DyB5pwO6e6e0nlQgc3dXyw/viewform"
    },

    team: {
      name: "High School Girls Team Camp",
      shortName: "HS Girls Team Camp",
      category: "Team camp",
      page: "hs-team-camp.html",
      audience: "High school girls teams",
      dates: "July 12 – 15, 2026",
      datesShort: "Jul 12–15",
      dayPrice: "$210",
      overnightPrice: "$375",
      mountainChallengePrice: "$30",
      mountainChallengeNote: "per player, optional",
      // VERIFY WITH COACH: this is a shortened goo.gl link from the old site.
      // Short links are being retired — please confirm the full form URL.
      registrationUrl: "https://goo.gl/forms/1TMObe0i0OYlWUKh1"
    }
  },

  /* --------------------------------------------------------------------
     TEAMS THAT HAVE ATTENDED (historical participation, not current
     registrations). From the previous website.
     -------------------------------------------------------------------- */
  pastTeams: [
    "Franklin", "Farragut", "Alcoa", "Webb", "Maryville", "Cookeville",
    "Sprayberry", "Pope", "Bearden", "Station Camp", "Lenoir City",
    "McMinn", "Hardin Valley", "Heritage"
  ],

  /* --------------------------------------------------------------------
     STAFF — intentionally empty.
     The staff section stays hidden until real, verified information is
     supplied. Add objects like:
       { name: "", role: "", bio: "", photo: "assets/camp/name.jpg" }
     -------------------------------------------------------------------- */
  staff: [],

  /* --------------------------------------------------------------------
     TESTIMONIALS — intentionally empty. Never invent these.
     The section stays hidden while this array is empty. Add objects like:
       { quote: "", attribution: "" }
     -------------------------------------------------------------------- */
  testimonials: []
};

/* Make available to script.js */
window.siteData = siteData;
