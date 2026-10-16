import type { ImageKey } from "@/content/images";
import type { FactStatus } from "@/lib/facts";

/**
 * Services: summaries for navigation/cards plus unique page copy
 * (PROMPT.md §7). Every service is `pending` until the client confirms it
 * (CLAUDE.md §3). Armed security stays `missing` until PSARA and arms
 * licences are confirmed (CLAUDE.md §2.5) and has no page copy.
 */
export type ServiceSummary = {
  slug: string;
  title: string;
  summary: string;
  icon: "factory" | "building" | "home" | "users" | "shield";
  image: ImageKey;
  status: FactStatus;
};

export type ServiceDetail = ServiceSummary & {
  metaTitle: string;
  metaDescription: string;
  intro: string;
  overview: string[];
  requirements: string[];
  capabilities: { title: string; body: string }[];
  benefits: { title: string; body: string }[];
  facilities: string[];
  faqs: { question: string; answer: string }[];
  related: string[];
};

export const services: readonly ServiceDetail[] = [
  {
    slug: "industrial-security",
    title: "Industrial Security",
    summary: "Gate, material and visitor control for factories, plants and warehouses.",
    icon: "factory",
    image: "serviceIndustrial",
    status: "pending",
    metaTitle: "Factory & Industrial Security in Chennai",
    metaDescription:
      "Factory security guards in Chennai for gate control, material movement checks, contractor verification and night patrols. Request a site assessment.",
    intro:
      "Gate control, material checks and night patrols for factories, plants and warehouses, run to your shift pattern.",
    overview: [
      "A factory gate is where most losses start and most incidents can be stopped. Trucks, contract labour, visitors and finished goods all pass through the same few points, often at shift change when attention is lowest.",
      "Our industrial deployments focus on those points. Officers check what goes in and out against your documents, keep registers your stores and HR teams can actually use, and patrol the perimeter and sheds after production stops.",
    ],
    requirements: [
      "Inward and outward material checks against gate passes, delivery challans and invoices",
      "Vehicle entry, exit and weighbridge coordination for trucks and tempos",
      "Contract-labour attendance and identity checks at the start of each shift",
      "Night and weekend cover when the plant is running a skeleton crew or is shut",
      "Fire-watch and hazard reporting in stores, scrap yards and utility areas",
    ],
    capabilities: [
      {
        title: "Gate and material control",
        body: "Every outbound load is matched to an approved pass; returnable items are tracked until they come back.",
      },
      {
        title: "Vehicle and visitor logs",
        body: "Time-stamped entry and exit records for vehicles, drivers and visitors, kept in the format your auditors ask for.",
      },
      {
        title: "Shift handovers",
        body: "Written handover at every shift change so open issues, keys and pending vehicles are passed on, not forgotten.",
      },
      {
        title: "Fire-watch rounds",
        body: "Scheduled checks of extinguishers, exits and hot-work areas, with problems reported to your safety officer.",
      },
      {
        title: "Contractor checks",
        body: "Verification of contract workers against the approved list before they enter the shop floor.",
      },
      {
        title: "Night patrols",
        body: "Perimeter, shed and yard rounds at varied times when production is down.",
      },
    ],
    benefits: [
      {
        title: "Fewer stock surprises",
        body: "Material that leaves the gate is accounted for, which makes shortages easier to trace.",
      },
      {
        title: "Records that stand up",
        body: "Clear registers help with internal audits, insurance claims and statutory inspections.",
      },
      {
        title: "Production stays the priority",
        body: "Checks are planned around your shift timings so they do not hold up trucks or workers.",
      },
      {
        title: "Early warning on hazards",
        body: "Night rounds catch leaks, open doors and electrical faults before the morning shift arrives.",
      },
    ],
    facilities: [
      "Manufacturing plants",
      "Engineering and fabrication units",
      "Warehouses and distribution centres",
      "Industrial estates and SIDCO units",
      "Construction and project sites",
      "Utility and processing facilities",
    ],
    faqs: [
      {
        question: "Can your officers work with our existing gate-pass system?",
        answer:
          "Yes. We follow the passes, challans and approval rules you already use. If you do not have a written procedure, we can suggest a simple one during the site assessment.",
      },
      {
        question: "How do you handle shift changes at the factory gate?",
        answer:
          "Officers hand over in writing at each change, covering vehicles still inside, keys issued and anything that needs follow-up, so the incoming shift starts with the full picture.",
      },
      {
        question: "Do you check contract labour as well as visitors?",
        answer:
          "We can check contract workers against the approved list you or your contractor provides, and record their entry and exit times at the gate.",
      },
      {
        question: "What happens if an officer finds a discrepancy in an outgoing load?",
        answer:
          "The vehicle is held at the gate and the person you nominate is informed immediately. Officers do not release the load until it is cleared by your team.",
      },
    ],
    related: ["corporate-commercial-security", "event-security"],
  },
  {
    slug: "corporate-commercial-security",
    title: "Corporate & Commercial Security",
    summary: "Front-of-house and access control for offices, IT parks and commercial buildings.",
    icon: "building",
    image: "serviceCorporate",
    status: "pending",
    metaTitle: "Corporate & Office Security Services in Chennai",
    metaDescription:
      "Office and commercial security in Chennai: reception security, visitor management, access-card discipline and after-hours patrols for offices and IT parks.",
    intro:
      "Courteous, alert front-of-house security for offices, IT parks and commercial buildings—the first face your visitors meet.",
    overview: [
      "In an office or commercial building, security is also hospitality. The officer at the lobby desk sets the tone for every client, candidate and courier who walks in, and still has to stop the people who should not get past.",
      "We brief our teams on your building’s access rules, tenant lists and escalation contacts, and on how you want visitors greeted. During the day the focus is on smooth, polite access control; after hours it shifts to patrols and locking up.",
    ],
    requirements: [
      "Reception and lobby desks staffed during business hours",
      "Visitor registration, badges and host confirmation",
      "Enforcement of access-card use at turnstiles and lift lobbies",
      "Parking and basement control for employee and visitor vehicles",
      "Locking, lights-off and patrol checks after the last employee leaves",
    ],
    capabilities: [
      {
        title: "Lobby and reception security",
        body: "Smart, well-groomed officers who greet visitors, confirm appointments and direct them correctly.",
      },
      {
        title: "Visitor management",
        body: "Registration, ID checks and visitor badges, using your digital system or a clear manual register.",
      },
      {
        title: "Access-card discipline",
        body: "Polite but firm checks that stop tailgating and lent cards at entrances and turnstiles.",
      },
      {
        title: "After-hours patrols",
        body: "Floor-by-floor rounds to check doors, windows, server rooms and pantry equipment once the building empties.",
      },
      {
        title: "Floor and common-area coverage",
        body: "Officers posted across food courts, lift lobbies and common areas in IT parks and malls.",
      },
      {
        title: "Mailroom and courier control",
        body: "Deliveries logged and held at the desk so couriers do not wander into work areas.",
      },
    ],
    benefits: [
      {
        title: "A professional first impression",
        body: "Visitors meet a calm, courteous officer rather than an unattended desk.",
      },
      {
        title: "Fewer strangers on your floors",
        body: "Consistent card and visitor checks keep work areas limited to people who should be there.",
      },
      {
        title: "Support for compliance",
        body: "Visitor and access records help with client audits and information-security requirements.",
      },
      {
        title: "Nothing left open overnight",
        body: "Closing checks catch unlocked doors, running equipment and lights left on.",
      },
    ],
    facilities: [
      "Corporate offices",
      "IT parks and tech campuses",
      "Co-working spaces",
      "Shopping malls and retail stores",
      "Banks and financial offices",
      "Hospitals and clinics",
    ],
    faqs: [
      {
        question: "Can your officers use our visitor-management software?",
        answer:
          "Yes. We train the deployed team on your system during onboarding. Where there is no software, we keep a bound register in the format you approve.",
      },
      {
        question: "How do you stop tailgating without upsetting employees?",
        answer:
          "Officers are briefed to be polite and consistent: everyone taps their own card, every time. Repeat issues are reported to your admin team rather than argued at the gate.",
      },
      {
        question: "Can you provide security for a single floor in a shared building?",
        answer:
          "Yes. We can post officers at your own reception or floor entry and coordinate with the building’s main security team.",
      },
      {
        question: "What do officers do after office hours?",
        answer:
          "They follow a closing checklist—doors, windows, equipment, lights—and then patrol at set intervals, recording each round.",
      },
      {
        question: "Can officers wear a dress code that suits our office?",
        answer: "Uniform and grooming standards can be agreed with you before deployment.",
      },
    ],
    related: ["residential-security", "industrial-security"],
  },
  {
    slug: "residential-security",
    title: "Residential Security",
    summary: "Gate control and visitor logs for apartments and gated communities.",
    icon: "home",
    image: "serviceResidential",
    status: "pending",
    metaTitle: "Apartment & Gated Community Security in Chennai",
    metaDescription:
      "Apartment security in Chennai: gate control, visitor and delivery logs, domestic-staff registers and night rounds, coordinated with your association.",
    intro:
      "Gate control and night rounds for apartments and gated communities, run in step with your residents’ association.",
    overview: [
      "Residents want two things from their security team: a gate that strangers cannot simply walk through, and officers who know the families, the domestic staff and the regular delivery riders by sight.",
      "We work with your association to agree the rules—visitor approval, delivery handling, move-in and move-out—and then apply them the same way on every shift. The association gets one point of contact for complaints and changes.",
    ],
    requirements: [
      "Main-gate control for residents, guests, cabs and delivery riders",
      "Registers for domestic help, drivers and maintenance workers",
      "Parking discipline, including visitor and two-wheeler areas",
      "Night rounds of blocks, basements, terraces and the perimeter",
      "Move-in, move-out and contractor work permissions",
    ],
    capabilities: [
      {
        title: "Gate control",
        body: "Visitors are confirmed with the resident before entry, using intercom, phone or your community app.",
      },
      {
        title: "Visitor and delivery logs",
        body: "Every guest, cab and delivery recorded with time in and out; parcels held at the gate if the resident prefers.",
      },
      {
        title: "Staff and domestic-help registers",
        body: "Daily entry and exit records for maids, cooks, drivers and maintenance staff.",
      },
      {
        title: "Night rounds",
        body: "Checks of block entrances, basements, terraces and boundary walls through the night.",
      },
      {
        title: "Association coordination",
        body: "Regular check-ins with the committee and a clear route for residents’ feedback.",
      },
      {
        title: "Common-area watch",
        body: "Attention to clubhouses, play areas and pools during busy hours.",
      },
    ],
    benefits: [
      {
        title: "Residents know who is inside",
        body: "Confirmed visitors and logged deliveries mean fewer unknown faces in the corridors.",
      },
      {
        title: "Consistent rules on every shift",
        body: "The same procedure is followed by day and night teams, which reduces arguments at the gate.",
      },
      {
        title: "A simpler life for the committee",
        body: "One contact person handles staffing, complaints and changes.",
      },
      {
        title: "Safer nights",
        body: "Regular rounds deter trespass and spot problems such as water leaks or open gates.",
      },
    ],
    facilities: [
      "Apartment complexes",
      "Gated villa communities",
      "Plotted layouts",
      "Senior-living communities",
      "Hostels and service apartments",
      "Individual bungalows",
    ],
    faqs: [
      {
        question: "Can your guards use our community’s visitor app?",
        answer:
          "Yes. Officers are trained on the app your association uses. Where there is no app, they confirm visitors with residents by intercom or phone.",
      },
      {
        question: "How do you manage domestic staff who come every day?",
        answer:
          "We keep a register with their names and the flats they work in, and record entry and exit. The association can decide whether ID cards are required.",
      },
      {
        question: "Who should residents contact with a complaint about security?",
        answer:
          "We agree a single point of contact with your committee at the start. Residents raise issues through the association, and we respond to them directly.",
      },
      {
        question: "Do you handle move-ins and move-outs?",
        answer:
          "Officers check move-in and move-out permissions issued by the association and record the vehicles and items involved.",
      },
    ],
    related: ["corporate-commercial-security", "event-security"],
  },
  {
    slug: "event-security",
    title: "Event & Personal Security",
    summary: "Entry screening, crowd flow and planned deployment for events.",
    icon: "users",
    image: "serviceEvent",
    status: "pending",
    metaTitle: "Event Security Services in Chennai",
    metaDescription:
      "Event security in Chennai for weddings, corporate events, festivals and functions: entry screening, crowd flow, VIP movement and temporary deployment.",
    intro:
      "Planned, temporary security for functions, corporate events and festivals—from entry screening to the last guest out.",
    overview: [
      "Events compress a lot of risk into a few hours: large numbers arriving at once, valuables on display, VIPs who need space, and a venue that may be unfamiliar to everyone involved.",
      "We plan these deployments before the day. We walk the venue with the organiser, agree entry points, guest-list rules and emergency routes, and brief every officer on their post and the people they report to.",
    ],
    requirements: [
      "Entry screening and guest-list or pass checks",
      "Crowd flow at entrances, stages, dining and exit points",
      "Protection for stage equipment, gifts and cash counters",
      "Escort and clear movement routes for VIPs and speakers",
      "Parking direction and vehicle marshalling",
    ],
    capabilities: [
      {
        title: "Deployment planning",
        body: "A written post plan agreed with the organiser: headcount, positions, timings and reporting lines.",
      },
      {
        title: "Entry screening",
        body: "Pass, ticket or guest-list checks at the door, with a clear process for people not on the list.",
      },
      {
        title: "Crowd flow",
        body: "Officers positioned to keep queues moving and walkways and exits clear.",
      },
      {
        title: "VIP movement",
        body: "Planned arrival and departure routes and personal escort where required.",
      },
      {
        title: "Asset watch",
        body: "Dedicated cover for gift tables, cash counters, equipment and green rooms.",
      },
      {
        title: "Venue close-down",
        body: "Officers stay until guests have left and the venue is handed back.",
      },
    ],
    benefits: [
      {
        title: "Hosts can focus on guests",
        body: "Entry, crowd and parking problems are handled without pulling the organiser away.",
      },
      {
        title: "Short-notice, short-term cover",
        body: "Deployment sized for the event, without a long-term contract.",
      },
      {
        title: "A plan everyone knows",
        body: "Organiser, venue staff and officers work from the same post plan.",
      },
      {
        title: "Valuables watched",
        body: "Gifts, cash and equipment have someone responsible for them throughout.",
      },
    ],
    facilities: [
      "Wedding and reception halls",
      "Corporate conferences and launches",
      "Exhibitions and trade shows",
      "Temple festivals and religious gatherings",
      "College and school events",
      "Private functions at homes",
    ],
    faqs: [
      {
        question: "How early should we book security for an event?",
        answer:
          "As early as you can. The deployment needs a venue visit and a briefing, so contact us once the date and venue are fixed.",
      },
      {
        question: "How do you decide how many officers we need?",
        answer:
          "We look at guest numbers, the number of entry and exit points, parking, and any VIPs or valuables, and propose a headcount for each post.",
      },
      {
        question: "Can you work alongside the venue’s own security staff?",
        answer:
          "Yes. We agree who covers which points and who reports to whom, so there are no gaps or overlaps on the day.",
      },
      {
        question: "Do you provide personal security for individuals?",
        answer:
          "Personal security is planned case by case. Tell us the person, the schedule and the concern, and we will discuss what is appropriate.",
      },
    ],
    related: ["residential-security", "corporate-commercial-security"],
  },
  {
    slug: "armed-ex-servicemen",
    title: "Armed Security & Ex-Servicemen",
    summary: "Licensed armed personnel for sites with specific risk requirements.",
    icon: "shield",
    image: "serviceArmed",
    status: "missing",
    metaTitle: "",
    metaDescription: "",
    intro: "",
    overview: [],
    requirements: [],
    capabilities: [],
    benefits: [],
    facilities: [],
    faqs: [],
    related: [],
  },
];

export function getService(slug: string): ServiceDetail | undefined {
  return services.find((s) => s.slug === slug);
}

/** Shared "how an enquiry works" steps, used on every service page. */
export const enquirySteps = [
  {
    title: "Tell us about your site",
    body: "Use the site assessment form or call us. A few details about the premises and your concerns are enough to start.",
  },
  {
    title: "We visit and assess",
    body: "Our team walks the site with you, looks at entry points, shifts and risks, and notes what you need.",
  },
  {
    title: "You receive a clear proposal",
    body: "Posts, headcount, duties and costs set out in writing, so you can decide with the full picture.",
  },
] as const;
