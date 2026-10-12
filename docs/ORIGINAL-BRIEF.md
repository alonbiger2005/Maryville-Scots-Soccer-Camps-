You are rebuilding the Maryville College Soccer Camp website from the ground up.

CURRENT WEBSITE:
https://sites.google.com/view/maryvillesoccercamp

Your job is NOT to merely restyle the existing Google Sites page.

Your job is to:

1. Audit the existing website.
2. Preserve all useful and accurate information.
3. Completely redesign the user experience.
4. Make the site significantly easier for parents, campers, coaches and recruits to navigate.
5. Build a polished, modern, responsive website that feels like an official Maryville College Soccer property.
6. Keep the project technically simple and maintainable.

The final website should feel modern and premium, but it should NOT feel overbuilt.

This is a soccer camp website.

Its primary goals are:

- Help users quickly understand which camp is right for them.
- Make dates, ages, prices and schedules extremely easy to find.
- Make registration obvious.
- Reduce the number of basic questions that coaches receive.
- Make contact information easy to locate.
- Build trust with parents and prospective campers.
- Showcase Maryville College Soccer and the campus.
- Work extremely well on mobile phones.

==================================================
1. BRAND DIRECTION
==================================================

The visual identity should be based on Maryville College Soccer.

Use a similar visual language to a previous Maryville College Europe microsite:

PRIMARY COLORS

Maryville Garnet:
#6F1428

Deep Garnet:
#430A17

Maryville Orange:
#F26522

Dark Orange:
#D94F13

Cream:
#F4E4C6

White:
#FFFFFF

Charcoal:
#1E1E22

Light Background:
#F7F3EC

Muted Gray:
#6E6E73

The site should primarily use:

- White / cream backgrounds
- Garnet navigation
- Garnet headings
- Orange call-to-action buttons
- Dark charcoal body text
- Subtle cream sections
- Occasional full-width dark garnet sections

DO NOT make the entire site orange.

The garnet should create the premium collegiate feeling.

Orange should mainly be used as an accent and CTA color.

==================================================
2. MARYVILLE LOGO
==================================================

I will provide the official Maryville College Soccer / Scots logo.

Use the actual supplied logo file.

DO NOT:

- recreate the logo
- redraw it
- modify it
- generate an AI approximation
- stretch it
- change its colors
- crop important portions

Preserve the original aspect ratio.

Use the logo in:

- header
- mobile navigation
- hero area where appropriate
- footer

The site should clearly look like a Maryville College Soccer Camp website from the first screen.

==================================================
3. CORE USER EXPERIENCE PRINCIPLE
==================================================

The current website requires users to read too much text and navigate between pages to find basic answers.

The redesigned site must be built around QUICK ANSWERS.

A parent should be able to arrive on the homepage and answer these questions within approximately 10 seconds:

- What camps are offered?
- When are they?
- Who are they for?
- How much do they cost?
- Where are they?
- How do I register?

Every camp should therefore have a clear summary card.

Never bury critical details inside long paragraphs.

==================================================
4. WEBSITE STRUCTURE
==================================================

Create the following primary navigation:

HOME
CAMPS
ID & PROSPECT CAMP
ELITE CAMP
HS GIRLS TEAM CAMP
FAQ
CONTACT
REGISTER

The desktop navigation should be sticky.

The mobile version should use a clean hamburger menu.

REGISTER should look like a button rather than a normal text link.

Example:

[Home] [Camps] [ID & Prospect] [Elite Camp] [HS Team Camp] [FAQ] [Contact] [REGISTER]

Use the same navigation in the footer.

==================================================
5. HOMEPAGE
==================================================

The homepage should function as the central decision-making page.

Users should NOT need to visit three pages before understanding the camp options.

Suggested homepage structure:

1. Announcement / status bar
2. Navigation
3. Hero
4. Camp selector
5. Three primary camp cards
6. Why Maryville Soccer Camp
7. Campus / facilities feature
8. Goalkeeper training feature
9. Frequently asked questions
10. Contact block
11. Final registration CTA
12. Footer

==================================================
6. TOP ANNOUNCEMENT BAR
==================================================

At the very top of the site, create a narrow announcement bar.

Example:

2026 CAMP REGISTRATION IS OPEN

or

2027 CAMP DATES COMING SOON

This text needs to be extremely easy to edit.

Create a variable in the JavaScript or central config such as:

const siteConfig = {
  registrationStatus: "2026 Camp Registration Is Open"
};

If registration is closed, allow the administrator to change this message without restructuring the site.

==================================================
7. HERO SECTION
==================================================

Create a strong full-width hero.

Use a high-quality Maryville College soccer photograph.

Preferred imagery:

- Maryville soccer game
- MC Soccer Complex
- players celebrating
- team huddle
- training session
- campus / field environment

Overlay a dark garnet gradient so text remains readable.

Suggested copy:

MARYVILLE COLLEGE
SOCCER CAMP

Train. Compete. Develop.

Experience college-level soccer training on the Maryville College campus in East Tennessee.

Buttons:

EXPLORE CAMPS

REGISTER NOW

Underneath the buttons, show a compact trust/info row:

Maryville, Tennessee
College Coaches
Boys & Girls Opportunities
Day + Overnight Options

Do not overload the hero with text.

==================================================
8. CAMP FINDER
==================================================

Immediately below the hero, create:

WHICH CAMP IS RIGHT FOR YOU?

Show three clear options.

--------------------------------------------------
ID & PROSPECT CAMP
--------------------------------------------------

Best for:
College-bound players

Focus:
College soccer experience, evaluation and recruiting environment

Current website information:

MEN
February 14, 2026

WOMEN
February 15, 2026

Price:
$110

Includes:
Lunch

CTA:
VIEW CAMP

CTA:
REGISTER

--------------------------------------------------
ELITE CAMP
--------------------------------------------------

Best for:
Boys & girls ages 8–17

Dates:
May 31 – June 4, 2026

Options:
Day Camper
Overnight Camper

Price:
Day: $235
Overnight: $440

Features:
Competitive training
Goalkeeper School
College and high school coaches
Campus experience

CTA:
VIEW CAMP

CTA:
REGISTER

--------------------------------------------------
HIGH SCHOOL GIRLS TEAM CAMP
--------------------------------------------------

Best for:
High school girls teams

Dates:
July 12 – July 15, 2026

Price:
Day: $210
Overnight: $375

Features:
Team training
Games
Team building
Optional Mountain Challenge

CTA:
VIEW CAMP

CTA:
REGISTER

--------------------------------------------------

IMPORTANT:

Dates and pricing will change each year.

Store them in a centralized JavaScript/config object rather than hardcoding them across many HTML sections.

Example:

const camps = {
  prospect: {
    menDate: "...",
    womenDate: "...",
    price: "..."
  },

  elite: {
    dates: "...",
    dayPrice: "...",
    overnightPrice: "..."
  },

  team: {
    dates: "...",
    dayPrice: "...",
    overnightPrice: "..."
  }
};

==================================================
9. CAMP CARD DESIGN
==================================================

Each homepage camp card should contain:

- Camp category label
- Camp name
- Date
- Age / audience
- 2–4 sentence description maximum
- Key features
- Price
- Register button
- Learn More button

Use visual hierarchy.

Example:

ID + PROSPECT

ID & PROSPECT CAMP

FEBRUARY 14–15

College-bound players

Experience a day in the life of a Maryville College soccer player through college-style training, small-sided games and staff evaluation.

$110

[LEARN MORE]
[REGISTER]

Do not create giant paragraphs.

==================================================
10. ID & PROSPECT CAMP PAGE
==================================================

Create:

id-prospect.html

or equivalent routing structure.

The page should include:

HERO

ID & Prospect Camp

Experience College Soccer at Maryville

MEN — FEBRUARY 14, 2026
WOMEN — FEBRUARY 15, 2026

$110
Lunch Included

[REGISTER NOW]

--------------------------------------------------

ABOUT THE CAMP

Use the existing site information but rewrite it for readability.

Explain that the camp is intended for college-bound players who want to experience the environment of a collegiate soccer program.

Include:

- Maryville College staff-led training
- college-style practice
- small-sided games
- staff evaluation
- interaction with current players and alumni
- Maryville Starting 11 / program values
- Maryville system of play
- Q&A opportunity

Do not invent recruiting guarantees.

--------------------------------------------------

DAILY SCHEDULE

Build this visually as a timeline.

10:00 AM
Check In — Cooper Athletic Center

10:15 AM
Parent Information Session

10:30 AM
Training Session

12:00 PM
Lunch on Campus

1:00 PM
Maryville Core Values & System of Play

1:30 PM
Q&A with Current Players

2:00 PM
Small-Sided + Full-Sided Games

3:00 PM
Camp Ends

Use vertical timeline cards.

On mobile, they should remain easy to scan.

--------------------------------------------------

WHO SHOULD ATTEND?

Create a compact card.

College-bound male and female players interested in:

- experiencing a college training environment
- being evaluated by Maryville staff
- understanding collegiate expectations
- learning about the Maryville program

--------------------------------------------------

PRICE

$110

Includes lunch.

Display this clearly.

--------------------------------------------------

REGISTER

Place a registration CTA at:

- top
- middle
- bottom

==================================================
11. ELITE CAMP PAGE
==================================================

Create:

elite-camp.html

Hero:

ELITE CAMP

May 31 – June 4, 2026

Boys & Girls
Ages 8–17

DAY CAMPER
$235

OVERNIGHT CAMPER
$440

[REGISTER NOW]

--------------------------------------------------

ABOUT THE CAMP

Rewrite the existing site copy.

Explain that Elite Camp is a competitive day or overnight soccer camp for players ages 8–17.

Highlight:

- player development
- competition
- position-specific instruction
- experienced coaching staff
- awards
- overnight experience
- goalkeeper training

--------------------------------------------------

GOALKEEPER SCHOOL

Give this its own visual section.

This information deserves more prominence than on the current website.

Suggested heading:

GOALKEEPER SCHOOL

Dedicated goalkeeper instruction is conducted during Elite Camp.

Explain:

- full-time goalkeeper training available
- part-time keepers may choose between field-player and goalkeeper training sessions
- position-specific technical instruction

Do not invent exact curriculum details unless provided.

Use goalkeeper imagery if available.

--------------------------------------------------

LOCATION

Maryville College
Maryville, Tennessee

Mention:

- campus setting
- approximately 20 miles from Knoxville
- near the Great Smoky Mountains
- training takes place on the Maryville College campus

Include a map button:

GET DIRECTIONS

--------------------------------------------------

OVERNIGHT EXPERIENCE

Use icon cards:

AIR-CONDITIONED DORMS

Two campers maximum per room according to the current website.

CAMPUS DINING

Meals are served in the campus dining hall.

SUPERVISION

Campers are supervised by coaching staff.

--------------------------------------------------

CHECK-IN

Create two cards.

OVERNIGHT CAMPERS

Sunday
6:00–8:00 PM
Dorm Check-In

Clarify that Sunday evening dinner is not served, based on the current website.

DAY CAMPERS

Monday
8:00–9:00 AM

Training begins at 9:00 AM.

--------------------------------------------------

DAILY SCHEDULE

MONDAY – WEDNESDAY

9:00 AM
Roll Call

9:15–11:30 AM
Field Session

11:30 AM–12:30 PM
Lunch

12:30–1:00 PM
College Coaches / Special Topics

1:30–4:15 PM
Field Session

4:30 PM
Day Camper Pick-Up

THURSDAY

9:00 AM
Roll Call

9:15–11:30 AM
Field Session / Closing Activities

Awards ceremony information should be presented clearly but verify final timing with the coach because the current website contains conflicting wording.

Flag this in the code/content comments as:

VERIFY WITH COACH BEFORE PUBLISHING.

--------------------------------------------------

WHAT TO BRING

Use icons or checklist cards.

ALL CAMPERS:

Soccer ball labeled with name
Shin guards
Soccer shoes / cleats
Water bottle
Spending money for snacks

OVERNIGHT CAMPERS:

Twin bed linens
Bath towels
Personal hygiene items
Clothing for overnight stay

Add:

“Additional packing guidance may be added by camp staff.”

--------------------------------------------------

PRICING

DAY CAMPER
$235

Includes lunch Monday–Wednesday.

OVERNIGHT CAMPER
$440

Includes meals as specified by camp staff.

Add:

NCAA regulations prohibit discounts.

Do not make that visually intimidating; place it as a small note.

==================================================
12. HS GIRLS TEAM CAMP PAGE
==================================================

Create:

hs-team-camp.html

Hero:

HIGH SCHOOL GIRLS
TEAM CAMP

July 12 – July 15, 2026

Train Together.
Compete Together.
Grow Together.

[REGISTER YOUR TEAM]

--------------------------------------------------

ABOUT

Explain:

This camp is designed for high school girls soccer teams looking for preseason preparation, competitive games and team development.

Each team receives:

- two training sessions per day
- evening games
- college-level coaching environment
- optional team-building experiences

--------------------------------------------------

TEAM BUILDING

Give Mountain Challenge its own section.

Use:

MARYVILLE COLLEGE
MOUNTAIN CHALLENGE

Explain that optional team-building activities are led through Maryville College Mountain Challenge in the campus woods.

Current options include:

- High Ropes
- Low Ropes
- Canoes

Current website price:

$30 per player

Clearly label:

OPTIONAL ADD-ON

Do not automatically include it in camp pricing.

--------------------------------------------------

AREA EXPERIENCE

Create a visually attractive section:

MORE THAN SOCCER

Maryville sits near:

- Knoxville
- Great Smoky Mountains National Park
- Gatlinburg
- outdoor recreation

This section should support the team-trip feeling without overwhelming the camp information.

--------------------------------------------------

PAST PARTICIPATING PROGRAMS

The current site lists programs that have attended over the years.

Do not clutter the primary page with a giant sentence.

Instead create a subtle section:

TEAMS THAT HAVE JOINED US

Display names as small pills or logos if permission/assets exist.

Current website mentions programs including:

Franklin
Farragut
Alcoa
Webb
Maryville
Cookeville
Sprayberry
Pope
Bearden
Station Camp
Lenoir City
McMinn
Hardin Valley
Heritage

Clearly present this as historical participation rather than current registration.

--------------------------------------------------

PRICING

DAY CAMPER
$210

OVERNIGHT CAMPER
$375

Optional Mountain Challenge:
$30 per player

NCAA regulations prohibit discounts.

==================================================
13. FAQ PAGE
==================================================

Create a dedicated FAQ page AND show the most important questions on the homepage.

This section is extremely important because the purpose of the redesign is to reduce the number of repetitive questions received by coaches.

Use accordion components.

Suggested categories:

REGISTRATION

How do I register?

When should I register?

Can I register at camp?

How do I pay?

--------------------------------------------------

ELITE CAMP

Who can attend?

Can my child attend as a day camper?

Can my child stay overnight?

Where do overnight campers stay?

Are meals included?

What does my child need to bring?

Is goalkeeper training available?

--------------------------------------------------

ID CAMP

Who should attend?

Is there a men's and women's session?

Is lunch included?

Will players be evaluated?

--------------------------------------------------

TEAM CAMP

Is registration individual or by team?

What is Mountain Challenge?

Is Mountain Challenge included?

Do teams play games?

--------------------------------------------------

LOCATION

Where is Maryville College?

Where is the soccer complex?

Where should we check in?

--------------------------------------------------

PAYMENT

The current site contains a large PayPal/browser warning.

Do NOT put technical payment warnings in the homepage content.

Instead create a small:

PAYMENT HELP

accordion.

Example:

Having trouble with online payment?

Then show troubleshooting information only when needed.

The site should support an easily replaceable payment URL.

Do not hardcode a payment system architecture until the coach confirms whether PayPal remains the preferred provider.

==================================================
14. REGISTER PAGE
==================================================

Create a dedicated registration hub.

Heading:

REGISTER FOR CAMP

Subtitle:

Choose your camp to begin registration.

Show three large cards:

ID & PROSPECT CAMP
[REGISTER]

ELITE CAMP
[REGISTER]

HS GIRLS TEAM CAMP
[REGISTER]

Each button should use the current registration URL for that particular camp.

Do not assume all camps use the same form.

Create variables:

registrationLinks = {
  prospect: "",
  elite: "",
  team: ""
};

This makes updates easy each year.

==================================================
15. CONTACT SECTION
==================================================

Make contact information impossible to miss.

Use a clean contact card.

MARYVILLE SOCCER CAMP

Email:
maryvillesoccercamp@gmail.com

Phone:
865-256-4070

Buttons:

EMAIL US

CALL NOW

On mobile:

tel: links should be clickable.

Email should use:

mailto:

Include:

Questions? We’re happy to help.

Do not place the mailing address here unless needed for check payment instructions.

==================================================
16. PAYMENT BY CHECK
==================================================

The current website provides a check payment option.

Create a dedicated accordion or information card:

PAYING BY CHECK?

Make checks payable to:

Maryville Soccer Camp

Current mailing recipient:

Pepe Fernandez
2101 Chippendale Drive
Maryville, TN 37803

IMPORTANT:

Put a developer note in the code:

VERIFY MAILING ADDRESS WITH COACH BEFORE PUBLISHING FUTURE VERSIONS.

Do not place this mailing address in ten different locations.

Store it once in the site configuration.

==================================================
17. WHY MARYVILLE SECTION
==================================================

Create a homepage section called:

WHY MARYVILLE SOCCER CAMP?

Use four feature cards.

COLLEGE-LEVEL COACHING

Train with experienced college and high school coaches.

PLAYER DEVELOPMENT

Technical, tactical and competitive training environments.

BEAUTIFUL CAMPUS

Experience Maryville College and East Tennessee.

MORE THAN A CAMP

Develop as a player while experiencing the culture and values of the Maryville soccer program.

Do not make exaggerated claims.

==================================================
18. CAMPUS / LOCATION FEATURE
==================================================

Create a strong visual section using:

- Maryville College campus imagery
- MC Soccer Complex imagery
- Great Smoky Mountains imagery

Heading:

TRAIN IN THE HEART OF EAST TENNESSEE

Copy should mention Maryville, Tennessee and its proximity to Knoxville and the Smokies.

Include buttons:

VIEW CAMPUS

GET DIRECTIONS

==================================================
19. FOOTER
==================================================

Create a substantial footer.

LEFT:

Maryville Soccer Camp logo / Maryville Scots logo

Maryville College
Maryville, Tennessee

CENTER:

Camps

ID & Prospect Camp
Elite Camp
HS Girls Team Camp

CENTER:

Information

FAQ
Registration
Contact
Directions

RIGHT:

Contact

maryvillesoccercamp@gmail.com
865-256-4070

Bottom line:

Maryville Soccer Camp

Add a separate subtle link:

Maryville College Athletics

Do not imply that this redesigned site is the official Maryville College institutional website unless the coach/college formally approves that language.

==================================================
20. MOBILE DESIGN
==================================================

Mobile usability is the highest priority.

Many parents will reach the site from:

- text messages
- social media
- email
- QR codes

Therefore:

- no tiny text
- no hover-only interactions
- no horizontal scrolling
- buttons should be minimum 44px high
- registration CTA should always be obvious
- camp dates should be visible without opening hidden menus
- phone numbers should be tappable
- address should open maps
- cards should stack cleanly
- accordions should be touch friendly

Consider adding a mobile sticky bottom bar:

[CALL]
[CAMPS]
[REGISTER]

Do not show it on desktop.

==================================================
21. DESKTOP DESIGN
==================================================

Use:

max-width: approximately 1280–1400px

Large imagery
Generous whitespace
Clear visual hierarchy
Rounded cards
Subtle shadows

Do not let sections become overly wide.

Body copy should generally remain around:

60–75 characters per line.

==================================================
22. TYPOGRAPHY
==================================================

Use a strong collegiate display font for:

MARYVILLE SOCCER CAMP

and major section headings.

Pair it with a modern sans-serif.

Possible structure:

Display:
Roboto Slab
Bitter
Arvo
or another collegiate serif

Body:
Inter
Manrope
DM Sans
or similar

Do not use difficult-to-read novelty fonts.

==================================================
23. BUTTON SYSTEM
==================================================

Primary CTA:

Orange background
White text

Example:

REGISTER NOW

Secondary CTA:

Garnet border
Garnet text

Example:

LEARN MORE

Dark CTA:

Garnet background
White text

All buttons should have:

- subtle hover lift
- accessible focus state
- approximately 12–16px horizontal padding
- rounded corners
- no extreme pill styling unless appropriate

==================================================
24. MICROINTERACTIONS
==================================================

Use subtle animations only.

Examples:

- cards move up 3–4px on hover
- navigation underline animates
- accordion smoothly expands
- buttons slightly brighten
- sections fade in gently while scrolling

Do not use:

- excessive parallax
- giant spinning animations
- bouncing elements
- unnecessary loaders
- distracting video backgrounds

==================================================
25. IMAGERY
==================================================

Prefer authentic Maryville College Soccer images.

Create an assets folder:

/assets
  /logos
  /camp
  /soccer
  /campus
  /icons

Use descriptive filenames.

Example:

maryville-scots-logo.png
mc-soccer-complex.jpg
elite-camp-training.jpg
goalkeeper-camp.jpg
maryville-campus.jpg

If an image is missing, use a tasteful placeholder and comment clearly:

<!-- Replace with official Maryville College Soccer photo -->

Never generate fake photographs of Maryville players.

==================================================
26. ACCESSIBILITY
==================================================

Use:

semantic HTML
proper heading hierarchy
alt text
keyboard navigation
visible focus styles
aria-expanded for FAQ accordions
aria-label where appropriate
high color contrast
reduced motion support

Example:

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

==================================================
27. SEO
==================================================

Add useful metadata.

Suggested title:

Maryville Soccer Camp | Maryville College Soccer Camps

Description:

Soccer camps hosted at Maryville College in Maryville, Tennessee, including ID & Prospect Camp, Elite Camp and High School Girls Team Camp.

Include relevant structured data where appropriate.

Use clean page titles:

Maryville Soccer Camp
ID & Prospect Camp | Maryville Soccer Camp
Elite Camp | Maryville Soccer Camp
HS Girls Team Camp | Maryville Soccer Camp
FAQ | Maryville Soccer Camp

==================================================
28. SITE DATA ARCHITECTURE
==================================================

Make yearly updates easy.

Create one central configuration object.

Example:

const siteData = {

  contact: {
    email: "maryvillesoccercamp@gmail.com",
    phone: "865-256-4070"
  },

  prospectCamp: {
    menDate: "February 14, 2026",
    womenDate: "February 15, 2026",
    price: "$110",
    registrationUrl: ""
  },

  eliteCamp: {
    dates: "May 31 – June 4, 2026",
    ages: "8–17",
    dayPrice: "$235",
    overnightPrice: "$440",
    registrationUrl: ""
  },

  teamCamp: {
    dates: "July 12 – July 15, 2026",
    dayPrice: "$210",
    overnightPrice: "$375",
    mountainChallengePrice: "$30",
    registrationUrl: ""
  }

};

The coach should be able to update dates and prices each year without searching through dozens of files.

==================================================
29. TECH STACK
==================================================

Keep the first version simple.

Use:

HTML
CSS
Vanilla JavaScript

Recommended files:

index.html
id-prospect.html
elite-camp.html
hs-team-camp.html
faq.html
contact.html
register.html

styles.css
script.js
data.js

/assets

Do not require:

React
Next.js
Node server
database
complex package manager
build system

unless I later explicitly ask for those.

The site should be easy to host on:

Netlify
GitHub Pages
Cloudflare Pages
or another static host.

==================================================
30. SHARED COMPONENTS
==================================================

Because this is plain HTML, avoid manually maintaining seven completely different headers.

Use JavaScript or another simple reusable method for:

- header
- navigation
- footer

Or structure the files so updating navigation is straightforward.

Do not overengineer this.

==================================================
31. IMPORTANT CONTENT CLEANUP
==================================================

The current website has several presentation issues.

Fix these during migration.

Examples include:

- “Febuary” should be “February.”
- inconsistent date spacing
- inconsistent punctuation
- inconsistent heading hierarchy
- long paragraphs
- payment warnings embedded awkwardly
- repetitive registration language
- inconsistent capitalization
- duplicated information
- unclear schedule formatting

Do NOT silently invent missing information.

If something is unclear, insert a comment:

<!-- VERIFY WITH COACH -->

==================================================
32. INFORMATION THAT SHOULD BE VERIFIED
==================================================

Before the final site is considered production-ready, clearly flag the following for confirmation:

- upcoming camp year
- all dates
- prices
- registration links
- PayPal/payment method
- check mailing address
- overnight meal details
- Thursday Elite Camp awards timing
- current Mountain Challenge pricing
- staff information
- phone number
- email
- official Maryville branding approval
- current camp photography

Create:

CONTENT-CHECKLIST.md

List every item that needs human verification.

==================================================
33. OPTIONAL STAFF SECTION
==================================================

Prepare a reusable staff section but do not populate unverified coach biographies.

Possible structure:

MEET THE STAFF

Cards:

Photo
Name
Role
Short biography

Only add actual coaches once official information is supplied or verified.

==================================================
34. OPTIONAL TESTIMONIAL SECTION
==================================================

Create the layout for testimonials but DO NOT fabricate testimonials.

If no real testimonials are supplied, hide the section.

Never invent parent quotes.

==================================================
35. FAQ-FIRST DESIGN PHILOSOPHY
==================================================

Whenever deciding whether information should be buried inside paragraph text or surfaced visually, prioritize surfacing it.

Examples:

BAD:

“The camp begins Monday at nine and campers should…”

GOOD:

CHECK-IN
8:00–9:00 AM

FIRST SESSION
9:00 AM

BAD:

“Day campers cost 235 dollars while overnight…”

GOOD:

DAY CAMPER
$235

OVERNIGHT
$440

The redesigned site should dramatically reduce cognitive load.

==================================================
36. FINAL HOMEPAGE FLOW
==================================================

The final homepage should approximately follow:

ANNOUNCEMENT BAR

NAVIGATION

HERO
Maryville Soccer Camp
Train. Compete. Develop.
[Explore Camps] [Register Now]

QUICK CAMP SELECTOR
Find Your Camp

THREE CAMP CARDS

WHY MARYVILLE

GOALKEEPER SCHOOL FEATURE

TRAIN IN EAST TENNESSEE
campus imagery

FAQ PREVIEW

NEED HELP?
phone + email

FINAL CTA
Ready to Join Us?
[Register Now]

FOOTER

==================================================
37. FINAL QUALITY TARGET
==================================================

The final site should feel like a professional NCAA college soccer camp website rather than a personal Google Site.

However, simplicity is essential.

The experience should feel:

- trustworthy
- collegiate
- athletic
- modern
- polished
- warm
- easy
- clear
- mobile-first

A parent should never wonder:

“Where do I click?”

“Where is the price?”

“When is camp?”

“Is this overnight?”

“Where is camp?”

“What does my child bring?”

“Who do I call?”

All of those answers should be obvious.

==================================================
38. BUILD PROCESS
==================================================

First:

1. Inspect the existing website thoroughly.
2. Build a list of all current pages, content and links.
3. Identify duplicated or conflicting information.
4. Identify missing data.
5. Create the new site architecture.
6. Build the shared design system.
7. Build the homepage.
8. Build each camp page.
9. Build FAQ.
10. Build registration hub.
11. Build contact page.
12. Build responsive navigation and footer.
13. Test desktop.
14. Test tablet.
15. Test mobile.
16. Check every registration link.
17. Check every phone/email link.
18. Check all accessibility states.
19. Create CONTENT-CHECKLIST.md.
20. Return the complete working website.

Do not stop after creating a wireframe.

Actually build the working HTML/CSS/JavaScript project.

==================================================
39. IMPORTANT FINAL RULE
==================================================

Preserve the INFORMATION from the current Maryville Soccer Camp site.

Do not preserve its UX problems.

This is a redesign, not a reskin.

The goal is to make registration and camp information dramatically easier to understand while giving Maryville Soccer Camp a visual identity that matches the quality of the soccer program and Maryville College.