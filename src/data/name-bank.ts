import type { Niche } from "./types";

export interface CountryInfo {
  name: string;
  code: string;
  languages: string[];
}

export const COUNTRIES: CountryInfo[] = [
  { name: "United States", code: "US", languages: ["English"] },
  { name: "United Kingdom", code: "GB", languages: ["English"] },
  { name: "Germany", code: "DE", languages: ["German", "English"] },
  { name: "France", code: "FR", languages: ["French", "English"] },
  { name: "Netherlands", code: "NL", languages: ["Dutch", "English"] },
  { name: "Ireland", code: "IE", languages: ["English"] },
  { name: "Spain", code: "ES", languages: ["Spanish", "English"] },
  { name: "Sweden", code: "SE", languages: ["Swedish", "English"] },
  { name: "Poland", code: "PL", languages: ["Polish", "English"] },
  { name: "India", code: "IN", languages: ["English", "Hindi"] },
  { name: "Canada", code: "CA", languages: ["English", "French"] },
  { name: "Australia", code: "AU", languages: ["English"] },
  { name: "Brazil", code: "BR", languages: ["Portuguese", "English"] },
  { name: "Portugal", code: "PT", languages: ["Portuguese", "English"] },
  { name: "United Arab Emirates", code: "AE", languages: ["English", "Arabic"] },
  { name: "Singapore", code: "SG", languages: ["English"] },
  { name: "Italy", code: "IT", languages: ["Italian", "English"] },
  { name: "Belgium", code: "BE", languages: ["Dutch", "French", "English"] },
];

export const FIRST_NAMES: string[] = [
  "Sofia", "Liam", "Amara", "Noah", "Elif", "Lucas", "Priya", "Mateo",
  "Freya", "Ethan", "Zainab", "Oliver", "Chidi", "Emma", "Rohan", "Ava",
  "Kwame", "Isla", "Diego", "Mia", "Aisha", "Leon", "Nadia", "Marcus",
  "Ingrid", "Rafael", "Yusuf", "Camille", "Theo", "Anaya", "Felix", "Ines",
  "Sebastian", "Layla", "Jonas", "Meera", "Anders", "Fatima", "Owen", "Nora",
  "Kai", "Bianca", "Hugo", "Selin", "Milo", "Adaeze", "Erik", "Farrah",
  "Julian", "Wren", "Tariq", "Clara", "Dario", "Naledi", "Piotr", "Yasmin",
  "Rowan", "Celine", "Adrian", "Thandiwe",
];

export const LAST_NAMES: string[] = [
  "Larsen", "Okafor", "Bergström", "Alvarez", "Kowalski", "Fontaine", "Rao",
  "Novak", "Meyer", "Dubois", "Silva", "Haddad", "Andersson", "Costa",
  "Nakamura", "Osei", "Petrov", "Renner", "Marchetti", "Adeyemi", "Sørensen",
  "Kapoor", "Fischer", "Moreau", "Nilsson", "Diallo", "Ibrahim", "Castillo",
  "Vermeer", "Lindqvist", "Weber", "Bianchi", "Correia", "Hassan", "Ferreira",
  "Kristiansen", "Mensah", "Duarte", "Schmidt", "Novikov", "Laurent",
  "Eriksson", "Okonkwo", "Vasquez", "Riedel", "Girard", "Nowak", "Santos",
];

export const HEADLINE_TEMPLATES: Record<Niche, string[]> = {
  AI: [
    "Helping {topic} teams ship AI features that actually work",
    "AI product lead turned creator — {topic} for builders",
    "Writing the practical playbook for {topic} in the AI era",
    "Ex-{company} — now helping companies make sense of AI for {topic}",
  ],
  SaaS: [
    "Building in public: lessons from scaling {topic} SaaS",
    "SaaS growth advisor — {topic} for founders and operators",
    "Former {company} exec sharing what actually moves {topic}",
    "Helping SaaS teams fix {topic} before it becomes a fire drill",
  ],
  Sales: [
    "B2B sales leader writing about {topic} that closes deals",
    "Ex-{company} AE — teaching modern {topic} to sales teams",
    "Helping revenue teams fix their {topic}, one post at a time",
    "Sales coach for founders who hate {topic} but need it anyway",
  ],
  GTM: [
    "GTM strategist — {topic} frameworks for early-stage teams",
    "Former {company} — now helping startups nail {topic}",
    "Writing the field guide to {topic} for B2B go-to-market",
    "Fractional CMO sharing real {topic} playbooks, no fluff",
  ],
  Marketing: [
    "B2B marketing lead obsessed with {topic} that compounds",
    "Ex-{company} marketer — teaching {topic} without the buzzwords",
    "Content strategist writing about {topic} for demand gen teams",
    "Helping brands fix {topic} instead of chasing vanity metrics",
  ],
  Fintech: [
    "Fintech operator writing about {topic} for regulated markets",
    "Ex-{company} — payments and {topic} explained simply",
    "Helping fintech founders navigate {topic} without the jargon",
    "Banking-as-a-service veteran sharing {topic} lessons",
  ],
  HR: [
    "People leader writing about {topic} for modern teams",
    "Ex-{company} Head of People — {topic} without the corporate speak",
    "Helping HR teams rethink {topic} for hybrid work",
    "Talent strategist sharing what actually works in {topic}",
  ],
  Ops: [
    "Ops leader documenting {topic} systems that scale",
    "Former {company} COO — writing the playbook on {topic}",
    "Helping operators fix {topic} before it breaks at scale",
    "RevOps specialist sharing {topic} frameworks that stick",
  ],
};

export const NICHE_TOPICS: Record<Niche, string[]> = {
  AI: ["model evaluation", "AI adoption", "prompt workflows", "AI tooling", "applied ML"],
  SaaS: ["retention", "onboarding", "pricing", "churn", "product-led growth"],
  Sales: ["cold outreach", "pipeline hygiene", "discovery calls", "objection handling", "closing"],
  GTM: ["positioning", "launch planning", "market entry", "channel strategy", "ICP definition"],
  Marketing: ["content strategy", "demand generation", "brand positioning", "lifecycle marketing", "attribution"],
  Fintech: ["compliance", "risk", "embedded finance", "payments infrastructure", "underwriting"],
  HR: ["hiring", "performance reviews", "hybrid work", "employer branding", "compensation"],
  Ops: ["process design", "tooling stacks", "cross-functional alignment", "reporting", "automation"],
};

export const NICHE_COMPANIES: Record<Niche, string[]> = {
  AI: ["Anthropic", "Cohere", "Scale AI", "Hugging Face", "DeepMind"],
  SaaS: ["Salesforce", "HubSpot", "Notion", "Linear", "Atlassian"],
  Sales: ["Salesforce", "Gong", "Outreach", "Clari", "Apollo"],
  GTM: ["Stripe", "Segment", "Amplitude", "Figma", "Webflow"],
  Marketing: ["HubSpot", "Mailchimp", "Semrush", "Canva", "Hootsuite"],
  Fintech: ["Stripe", "Revolut", "Wise", "Adyen", "Plaid"],
  HR: ["Deel", "Rippling", "Workday", "Lattice", "Gusto"],
  Ops: ["Airtable", "Monday.com", "Asana", "Zapier", "Ramp"],
};

export const NICHE_POST_HOOKS: Record<Niche, string[]> = {
  AI: [
    "We audited 40 'AI-powered' features. 6 were actually using AI.",
    "The AI adoption curve inside enterprises looks nothing like the hype cycle.",
    "Every team asking for an 'AI strategy' actually needs a data strategy first.",
  ],
  SaaS: [
    "We cut onboarding from 9 steps to 3. Activation went up 41%.",
    "Churn isn't a support problem. It's a week-2 problem.",
    "Raised prices twice this year. Retention went up both times. Here's why.",
  ],
  Sales: [
    "I stopped cold calling on Mondays. Reply rates went up 22%.",
    "The best discovery call I ever ran had one question in it.",
    "Your pipeline isn't a forecasting problem. It's a qualification problem.",
  ],
  GTM: [
    "We launched in 3 markets at once. We should have picked one.",
    "Positioning isn't a tagline exercise. It's a 6-week research project.",
    "The ICP slide in your deck is probably three ICPs pretending to be one.",
  ],
  Marketing: [
    "We killed our blog for a quarter. Pipeline didn't move. Here's what we learned.",
    "Attribution models are mostly fiction. Here's what we track instead.",
    "The best-performing post we ran cost €0 and took 20 minutes.",
  ],
  Fintech: [
    "Compliance isn't the department that says no. It's the one that ships faster later.",
    "We processed our first regulated payment 11 months after we said we would.",
    "Underwriting models break the moment they meet a real edge case.",
  ],
  HR: [
    "We removed the performance review. Managers gave better feedback within a month.",
    "Hybrid work didn't kill culture. Bad meetings did.",
    "The best hire we made last year almost got filtered out by our ATS.",
  ],
  Ops: [
    "We deleted 14 tools last quarter. Nobody noticed. That's the point.",
    "The dashboard nobody looks at is costing you more than the outage will.",
    "Automation didn't save us headcount. It saved us a Tuesday every week.",
  ],
};
