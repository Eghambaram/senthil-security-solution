/**
 * Privacy policy and terms. Plain-language drafts covering the DPDP Act 2023
 * (notice, purpose, consent, retention, rights, grievance). Legal review is
 * required before launch — tracked in docs/CONTENT-GAPS.md, not on the page.
 *
 * Retention periods follow CLAUDE.md §10 defaults pending client policy.
 */

export type LegalSection = { heading: string; paragraphs?: string[]; list?: string[] };

export const LEGAL_UPDATED = "2026-10-16";

export const privacyPolicy: { title: string; intro: string; sections: LegalSection[] } = {
  title: "Privacy Policy",
  intro:
    "This policy explains what personal data Senthil Security Solutions collects through this website, why we collect it, how long we keep it and what rights you have. It is written to meet our obligations under India’s Digital Personal Data Protection Act, 2023.",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        "Senthil Security Solutions (“we”, “us”) is the data fiduciary for personal data collected through this website. Our office is at No. 2, Railway Station Road, Kamaraj Nagar, Tambaram Sanatorium, Chennai, Tamil Nadu 600047.",
      ],
    },
    {
      heading: "What we collect",
      paragraphs: ["We only collect what you choose to give us through our forms:"],
      list: [
        "Enquiry and site assessment forms: your name, organisation, phone number, email address, site location, type of premises, the service you are interested in and your message.",
        "Career application form: your name, phone number, email address, preferred role, years of experience, service in the armed or police forces (if you tell us), location and, if you upload one, your CV.",
        "Basic technical data needed to run and protect the website, such as your IP address, which is used to prevent spam and abuse.",
      ],
    },
    {
      heading: "Why we use it",
      list: [
        "To reply to your enquiry, arrange a site visit and prepare a proposal.",
        "To assess your job application and contact you about it.",
        "To keep the website secure and stop automated or abusive submissions.",
      ],
      paragraphs: [
        "We do not sell your personal data, and we do not use it for advertising. We do not use advertising or tracking cookies on this website.",
      ],
    },
    {
      heading: "Consent",
      paragraphs: [
        "We process the data you submit on the basis of your consent, which you give by ticking the consent box on our forms. You can withdraw consent at any time by contacting us; this will not affect processing already carried out.",
      ],
    },
    {
      heading: "How long we keep it",
      list: [
        "Enquiries: up to 12 months after our last contact with you, unless you become a client, in which case records are kept as needed for the contract.",
        "Job applications and CVs: up to 6 months after we receive them.",
      ],
      paragraphs: ["After these periods the data is deleted."],
    },
    {
      heading: "Who can see it",
      paragraphs: [
        "Only our staff who handle enquiries or recruitment. We use trusted service providers to host the website, store form submissions and send email notifications; they process data only on our instructions. CVs are stored privately and are never available through a public link.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: ["Under the DPDP Act, 2023 you can ask us to:"],
      list: [
        "tell you what personal data we hold about you and how we use it;",
        "correct, complete or update it;",
        "erase it, where we no longer need it for the purpose you gave it for;",
        "nominate another person to exercise your rights if you are unable to.",
      ],
    },
    {
      heading: "Grievances and contact",
      paragraphs: [
        "If you have a question or complaint about how we handle your personal data, call us on +91 44 4380 6837 or write to us at the office address above. We will respond as soon as possible. If you are not satisfied with our response, you may complain to the Data Protection Board of India.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: ["If we change this policy, we will update the date at the top of this page."],
    },
  ],
};

export const terms: { title: string; intro: string; sections: LegalSection[] } = {
  title: "Terms of Use",
  intro:
    "These terms apply to your use of senthilsecuritysolutions.com. By using the website you agree to them.",
  sections: [
    {
      heading: "About this website",
      paragraphs: [
        "This website gives general information about Senthil Security Solutions and lets you send us enquiries and job applications. It is operated by Senthil Security Solutions, No. 2, Railway Station Road, Kamaraj Nagar, Tambaram Sanatorium, Chennai, Tamil Nadu 600047.",
      ],
    },
    {
      heading: "Information on this site",
      paragraphs: [
        "We try to keep the information accurate and up to date, but it is general in nature. It is not an offer or a contract. The scope, staffing and price of any security service are agreed only in a written proposal or contract with us.",
      ],
    },
    {
      heading: "Enquiries and applications",
      paragraphs: [
        "Submitting an enquiry does not create an obligation for you or for us. Submitting a job application does not guarantee an interview or employment. Please make sure the information you send is accurate and that you have the right to share it.",
      ],
    },
    {
      heading: "Acceptable use",
      list: [
        "Do not use the website for anything unlawful, or to send spam, malicious code or false information.",
        "Do not attempt to gain unauthorised access to the website or the systems behind it.",
        "Do not copy or reuse our content, logo or images without permission.",
      ],
    },
    {
      heading: "Links to other websites",
      paragraphs: [
        "We may link to other websites, such as Google Maps or our Facebook page. We are not responsible for their content or privacy practices.",
      ],
    },
    {
      heading: "Liability",
      paragraphs: [
        "To the extent permitted by law, we are not liable for any loss arising from the use of this website or reliance on its content. Nothing in these terms limits liability that cannot be limited by law.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of India. Courts in Chennai, Tamil Nadu have jurisdiction over any dispute about them.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: ["Questions about these terms: call +91 44 4380 6837 or write to us at the address above."],
    },
  ],
};
