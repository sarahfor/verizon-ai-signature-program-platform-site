const assignments = [
  {
    id: "workflow",
    label: "Workflow Brief",
    title: "Workflow opportunity brief",
    fields: [
      ["businessGoal", "Business goal", "Reduce proposal turnaround time and improve lead follow-up consistency.", "textarea"],
      ["workflowTrigger", "Workflow trigger", "New qualified lead submits intake form.", "input"],
      ["workflowInput", "Primary input", "Lead intake notes, CRM record, service package, past proposal examples.", "textarea"],
      ["workflowOutput", "Expected output", "Draft follow-up email, proposal outline, next-step task list.", "textarea"],
      ["workflowOwner", "Workflow owner", "Sales operations lead", "input"],
      ["workflowReviewer", "Human reviewer", "Business owner or revenue lead", "input"],
      ["baselineMetric", "Baseline metric", "Average proposal turnaround time is 3 business days.", "input"],
    ],
  },
  {
    id: "data",
    label: "Data Boundary",
    title: "Data and tool boundary",
    fields: [
      ["systemOfRecord", "System of record", "HubSpot CRM", "input"],
      ["allowedData", "Allowed sandbox data", "Sanitized CRM notes, sample customer scenarios, public service descriptions.", "textarea"],
      ["blockedData", "Off-limits data", "Payment details, private customer files, passwords, health/legal information.", "textarea"],
      ["toolRoute", "Preferred tool route", "ChatGPT custom assistant for drafting and HubSpot for source records.", "textarea"],
      ["budgetOwner", "Budget approver", "Founder", "input"],
      ["monthlyCost", "Estimated recurring cost", "$20-$60/month for AI workspace access.", "input"],
    ],
  },
  {
    id: "test",
    label: "Test Packet",
    title: "Sandbox test packet",
    fields: [
      ["testCase1", "Test case 1", "Lead asks for a standard service package with a two-week timeline.", "textarea"],
      ["testCase2", "Test case 2", "Lead has an unclear need and requires a clarifying reply.", "textarea"],
      ["testCase3", "Test case 3", "Lead asks for pricing but does not match ideal customer profile.", "textarea"],
      ["desiredFormat", "Desired output format", "Email draft, proposal bullets, CRM follow-up task, reviewer checklist.", "textarea"],
      ["edgeCases", "Known edge cases", "Missing budget, vague request, urgent timeline, sensitive customer details.", "textarea"],
      ["stopConditions", "Stop conditions", "AI invents pricing, uses sensitive data, skips review, or sends customer-ready language without approval.", "textarea"],
    ],
  },
  {
    id: "assistant",
    label: "Assistant",
    title: "Assistant and agent instructions",
    fields: [
      ["assistantName", "Assistant name", "Lead Response Drafting Assistant", "input"],
      ["assistantRole", "Role", "Draft first-pass lead follow-up and proposal notes for human review.", "textarea"],
      ["assistantRules", "Operating rules", "Use only provided source material. Ask for missing facts. Flag uncertainty. Never invent pricing or customer commitments.", "textarea"],
      ["assistantTone", "Tone", "Clear, warm, concise, service-oriented, not overly polished.", "input"],
      ["agentTasks", "Agent task list", "Read sanitized intake, classify request, draft response, create proposal outline, produce reviewer checklist.", "textarea"],
      ["humanHandoff", "Human handoff", "Reviewer approves all customer-facing copy and pricing before use.", "textarea"],
    ],
  },
  {
    id: "review",
    label: "Review Rubric",
    title: "Output review rubric",
    fields: [
      ["accuracyStandard", "Accuracy standard", "Output matches provided facts and does not add unsupported claims.", "textarea"],
      ["completenessStandard", "Completeness standard", "Output includes customer need, recommended next step, missing information, and reviewer notes.", "textarea"],
      ["brandStandard", "Tone and brand standard", "Helpful, direct, clear, and appropriate for a small business customer.", "textarea"],
      ["reviewBurden", "Review burden target", "Reviewer can approve or revise within 10 minutes.", "input"],
      ["escalationPath", "Escalation path", "Escalate to owner if pricing, legal, customer complaint, or unusual commitment appears.", "textarea"],
    ],
  },
  {
    id: "risk",
    label: "Risk Controls",
    title: "Governance and risk controls",
    fields: [
      ["permittedUse", "Permitted use", "Drafting, summarizing, structuring follow-up, creating internal task lists.", "textarea"],
      ["offLimitsUse", "Off-limits use", "Final pricing, legal commitments, automated customer sending, regulated advice.", "textarea"],
      ["privacyRules", "Privacy rules", "Use sanitized data for tests; remove unnecessary personal and financial details.", "textarea"],
      ["failureResponse", "Failure response", "Stop the workflow, log the issue, revise instructions, and retest before another live run.", "textarea"],
      ["goNoGo", "Go/no-go rule", "At least three successful test cases, named reviewer, approved data boundary, and monitoring log ready.", "textarea"],
    ],
  },
  {
    id: "pilot",
    label: "Pilot Launch",
    title: "Pilot launch plan",
    fields: [
      ["pilotScope", "Pilot scope", "Use assistant for 10 new qualified leads over two weeks; no automated sending.", "textarea"],
      ["pilotUsers", "Pilot users", "Sales operations lead drafts; founder reviews.", "input"],
      ["runFrequency", "Run frequency", "Every new qualified lead during pilot window.", "input"],
      ["monitoringLog", "Monitoring log fields", "Input, output, reviewer edits, time spent, issue category, accept/revise/stop decision.", "textarea"],
      ["successMetric", "Success metric", "Reduce proposal turnaround from 3 business days to 1 business day without increasing rework.", "textarea"],
      ["nextDecision", "Post-pilot decision", "Continue, revise, simplify, or stop based on value and review burden.", "textarea"],
    ],
  },
];

const initialState = {
  businessName: "",
  participantName: "",
  teamSize: "",
  budget: "",
  workflowLane: "",
  workflowName: "",
  activeAssignment: "workflow",
  activeBuilder: "assistant",
  participantStep: 0,
  activeScenario: "testCase1",
  selectedTaxonomyLane: "",
  selectedTaxonomyWorkflow: "",
  runCount: 0,
  runLog: [],
};

const state = loadState();
let taxonomyData = { workflows: [], lanes: [], formula: "" };

const TAXONOMY_FALLBACK = {
  "source": "Workflow Taxonomy and Use-Case Matrix - Revised Workflow Lanes.xlsx",
  "formula": "Priority Score = (0.35 * Value + 0.25 * Readiness + 0.20 * (6 - Complexity) + 0.20 * (6 - Risk)) * 20",
  "workflows": [
    { "lane": "Growth, Content, and Demand", "workflow": "Content repurposing", "outcome": "Increase content output without adding headcount", "pain": "Long-form content is underused; owners lack time to turn source material into campaigns", "friction": "Manual rewriting across email, social, web, and sales collateral", "useCases": "Turn webinars, blogs, founder notes, podcasts, and customer stories into social posts, email copy, blog snippets, FAQs, and short-form video scripts", "baseline": "Shared docs, website CMS, email platform, social scheduler", "kpis": "Content output volume; time to publish; campaign cadence; engagement rate", "notes": "Strong first-cohort quick win", "score": 88, "value": 4.0, "complexity": 1.0, "readiness": 4.0, "risk": 1.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "Google/Canva/HubSpot/Shopify/ChatGPT/Claude", "guardrails": "Human review for brand voice, claims, and accuracy" },
    { "lane": "Growth, Content, and Demand", "workflow": "Email campaign production", "outcome": "Improve campaign consistency and send cadence", "pain": "Newsletters, nurture emails, and follow-ups are inconsistent or delayed", "friction": "Repeated manual drafting and formatting across campaign types", "useCases": "Draft newsletters, promotional emails, nurture sequences, event follow-ups, reactivation emails, and segmented variants", "baseline": "Email platform, CRM, shared docs, customer list", "kpis": "Send frequency; open rate; click rate; response rate; time saved", "notes": "Strong first-cohort fit if list hygiene exists", "score": 88, "value": 4.0, "complexity": 1.0, "readiness": 4.0, "risk": 1.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "Google/HubSpot/Klaviyo/Mailchimp/ChatGPT/Claude", "guardrails": "Human approval before send; no unsupported claims" },
    { "lane": "Growth, Content, and Demand", "workflow": "Social media production", "outcome": "Reduce repetitive content production work", "pain": "Owners or small teams struggle to maintain regular posting", "friction": "Manual caption writing, calendar planning, and channel-specific adaptation", "useCases": "Generate captions, post calendars, creative briefs, platform-specific variants, hashtag sets, and response drafts", "baseline": "Social platforms, Canva, shared docs, content calendar", "kpis": "Posting cadence; time saved; engagement rate; content backlog reduced", "notes": "Good low-risk starter workflow", "score": 84, "value": 3.5, "complexity": 1.0, "readiness": 4.0, "risk": 1.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "Canva/Google/HubSpot/ChatGPT/Claude", "guardrails": "Review brand tone and sensitive responses" },
    { "lane": "Growth, Content, and Demand", "workflow": "Campaign planning and segmentation", "outcome": "Improve targeting and campaign planning discipline", "pain": "Campaign ideas are ad hoc; audiences and messages are not clearly segmented", "friction": "Planning lives in founder memory, spreadsheets, or scattered notes", "useCases": "Build campaign briefs, audience-message matrices, channel plans, campaign timelines, and test plans", "baseline": "CRM, email tool, spreadsheet, shared docs", "kpis": "Campaign launch speed; segment coverage; qualified lead volume; test velocity", "notes": "Best where basic customer list hygiene exists", "score": 80, "value": 4.0, "complexity": 2.0, "readiness": 4.0, "risk": 2.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "HubSpot/Google/Microsoft/Shopify/ChatGPT/Claude", "guardrails": "Review segmentation logic and customer data use" },
    { "lane": "Growth, Content, and Demand", "workflow": "Customer education content", "outcome": "Help customers understand products, services, and next steps", "pain": "Teams answer recurring education questions manually", "friction": "Repeated explanation work across onboarding, support, and sales", "useCases": "Create onboarding guides, how-to content, explainer emails, service FAQs, and educational mini-guides", "baseline": "Website CMS, shared docs, support docs, email platform", "kpis": "FAQ deflection; onboarding time; support questions; customer satisfaction", "notes": "Good fit for services, ecommerce, education, and coaching", "score": 84, "value": 4.0, "complexity": 1.0, "readiness": 4.0, "risk": 2.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "Google/Canva/Shopify/HubSpot/ChatGPT/Claude", "guardrails": "Review technical accuracy and customer promises" },
    { "lane": "Growth, Content, and Demand", "workflow": "Product or service page copy", "outcome": "Improve clarity and conversion on web/product pages", "pain": "Pages are stale, inconsistent, or too time-consuming to update", "friction": "Manual copy updates across product, service, and landing pages", "useCases": "Draft landing pages, ecommerce product descriptions, service descriptions, local SEO pages, and comparison pages", "baseline": "Website CMS, Shopify, Wix, Squarespace, shared docs", "kpis": "Page update cycle time; conversion rate; search visibility; content completeness", "notes": "Strong stack-native fit for ecommerce and services", "score": 80, "value": 4.0, "complexity": 2.0, "readiness": 4.0, "risk": 2.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "Shopify/Wix/Google/Canva/ChatGPT/Claude", "guardrails": "Review claims, pricing, legal/compliance language" },
    { "lane": "Growth, Content, and Demand", "workflow": "Testimonial and case study workflow", "outcome": "Turn proof points into usable sales and marketing assets", "pain": "Customer stories exist but are not packaged for sales or marketing", "friction": "Manual interview synthesis and copy drafting", "useCases": "Convert customer feedback or interviews into case study drafts, testimonial snippets, proof points, and sales enablement copy", "baseline": "CRM, review platforms, interview notes, shared docs", "kpis": "Case study cycle time; proof assets created; sales usage; conversion support", "notes": "Good if consent and source material are clear", "score": 74, "value": 3.5, "complexity": 2.0, "readiness": 3.5, "risk": 2.0, "guidance": "Tier 2 selective / use with controls", "stack": "Google/HubSpot/Canva/ChatGPT/Claude", "guardrails": "Confirm customer permission and factual accuracy" },
    { "lane": "Growth, Content, and Demand", "workflow": "Brand voice and messaging system", "outcome": "Create consistent brand language across channels", "pain": "Content varies by writer; brand voice is informal or undocumented", "friction": "No reusable voice guide, approved claims list, or review criteria", "useCases": "Create a reusable brand voice guide, prompt library, approved claims list, and content review checklist", "baseline": "Existing content library, shared docs, website, sales materials", "kpis": "Consistency score; review time; rewrite cycles; approved prompt reuse", "notes": "Useful foundation for content-heavy businesses", "score": 76, "value": 3.5, "complexity": 2.0, "readiness": 4.0, "risk": 2.0, "guidance": "Tier 1 or Tier 2 with SME review", "stack": "Google/Canva/HubSpot/ChatGPT/Claude", "guardrails": "Maintain approved claims and final human review" },
    { "lane": "Growth, Content, and Demand", "workflow": "Marketing performance recap", "outcome": "Convert marketing activity into next-step decisions", "pain": "Campaign data exists but is not reviewed consistently", "friction": "Metrics live across tools and are interpreted inconsistently", "useCases": "Summarize campaign results, extract learnings, identify best-performing messages, and draft next-test recommendations", "baseline": "Email platform, web analytics, Shopify, CRM, spreadsheet", "kpis": "Report cycle time; next tests identified; decision speed; campaign ROI", "notes": "Bridge between marketing and data/insights lane", "score": 72, "value": 3.5, "complexity": 2.0, "readiness": 3.0, "risk": 2.0, "guidance": "Tier 2 selective / use with controls", "stack": "HubSpot/Shopify/Google/Microsoft/ChatGPT/Claude", "guardrails": "Use source data references; avoid unsupported causality claims" },
    { "lane": "Growth, Content, and Demand", "workflow": "Market and competitor scan", "outcome": "Support campaign planning with faster external research", "pain": "Owners lack time to monitor competitors, reviews, and market trends", "friction": "Research is fragmented and inconsistent", "useCases": "Summarize competitor messaging, pricing claims, customer reviews, and market signals for campaign planning", "baseline": "Web research, review platforms, CRM notes, shared docs", "kpis": "Research time saved; insight quality; campaign inputs created", "notes": "Useful but less direct ROI than production workflows", "score": 68, "value": 3.0, "complexity": 2.0, "readiness": 3.0, "risk": 2.0, "guidance": "Tier 2 selective / use with controls", "stack": "Google/ChatGPT/Claude/Perplexity-style research tools", "guardrails": "Cite sources; review for hallucinations and outdated information" },
    { "lane": "Revenue Response and Client Conversion", "workflow": "Lead follow-up drafting", "outcome": "Improve conversion and reduce dropped leads", "pain": "Leads are not followed up quickly or consistently", "friction": "Manual email/SMS follow-up with inconsistent cadence", "useCases": "Draft first-response emails, SMS follow-ups, missed-call replies, quote follow-ups, and reactivation messages", "baseline": "CRM or spreadsheet, email, SMS tool, website forms", "kpis": "Lead response time; meeting-booked rate; conversion rate; follow-up completion", "notes": "One of the strongest first-cohort defaults", "score": 87, "value": 5.0, "complexity": 2.0, "readiness": 4.0, "risk": 2.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "HubSpot/Microsoft/Google/Square/Jobber/ChatGPT/Claude", "guardrails": "Human approval before send; avoid pricing or service promises without review" },
    { "lane": "Revenue Response and Client Conversion", "workflow": "Lead intake summarization", "outcome": "Create cleaner lead briefs and faster triage", "pain": "Inquiry details arrive across forms, calls, emails, and chats", "friction": "Manual review and retyping of scattered lead information", "useCases": "Summarize intake forms, inquiries, voicemails, chat transcripts, and call notes into lead briefs", "baseline": "Website forms, inbox, CRM, call notes, chat logs", "kpis": "Triage time; lead completeness; follow-up quality; handoff speed", "notes": "Good if source inputs are accessible", "score": 80, "value": 4.0, "complexity": 2.0, "readiness": 4.0, "risk": 2.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "HubSpot/Google/Microsoft/ChatGPT/Claude", "guardrails": "Remove sensitive details not needed for the next step" },
    { "lane": "Revenue Response and Client Conversion", "workflow": "CRM notes and meeting summaries", "outcome": "Improve pipeline hygiene and follow-up discipline", "pain": "Notes are incomplete; tasks and context fall through the cracks", "friction": "Information captured after meetings is fragmented or skipped", "useCases": "Convert meeting notes into CRM updates, next steps, contact summaries, deal notes, and follow-up tasks", "baseline": "CRM, calendar, meeting transcripts, notes", "kpis": "CRM completeness; admin time saved; task completion; follow-up SLA", "notes": "Practical and champion-friendly", "score": 80, "value": 4.0, "complexity": 2.0, "readiness": 4.0, "risk": 2.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "HubSpot/Microsoft/Google/Zoom/ChatGPT/Claude", "guardrails": "Review summaries before CRM entry if customer-sensitive" },
    { "lane": "Revenue Response and Client Conversion", "workflow": "Proposal, quote, and estimate drafting", "outcome": "Shorten sales cycle and improve consistency", "pain": "Proposals and estimates are time-consuming and inconsistent", "friction": "Manual copy/paste and rework across similar requests", "useCases": "Draft proposals, scopes of work, project summaries, pricing narratives, and client-specific recommendations", "baseline": "Docs, proposal templates, CRM, spreadsheet, estimate tool", "kpis": "Turnaround time; proposal volume; win rate; revision cycles", "notes": "High value if templates and examples already exist", "score": 81, "value": 4.5, "complexity": 2.0, "readiness": 3.5, "risk": 2.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "Google/Microsoft/HubSpot/Jobber/ServiceTitan/ChatGPT/Claude", "guardrails": "Final human review for scope, price, exclusions, and commitments" },
    { "lane": "Revenue Response and Client Conversion", "workflow": "Discovery call preparation", "outcome": "Improve sales conversations and qualification", "pain": "Teams enter calls without consistent prep or question structure", "friction": "Manual account research and scattered CRM context", "useCases": "Generate account briefs, suggested questions, known pain points, and meeting prep based on CRM/history", "baseline": "CRM, website, notes, LinkedIn, calendar", "kpis": "Prep time saved; qualification quality; next-step conversion", "notes": "Useful support workflow for advisory and B2B services", "score": 78, "value": 3.5, "complexity": 1.5, "readiness": 4.0, "risk": 2.0, "guidance": "Tier 1 or Tier 2 with SME review", "stack": "HubSpot/Google/Microsoft/ChatGPT/Claude", "guardrails": "Source-check research and avoid assumptions about prospect needs" },
    { "lane": "Revenue Response and Client Conversion", "workflow": "Objection handling support", "outcome": "Improve consistency in sales responses", "pain": "Common objections are handled unevenly by different team members", "friction": "Responses are improvised and not captured as reusable assets", "useCases": "Create response snippets for objections around price, timing, scope, implementation, or comparison shopping", "baseline": "Sales notes, CRM, proposal templates, shared docs", "kpis": "Response quality; sales cycle time; objection-to-next-step rate", "notes": "Good when reviewed and paired with approved messaging", "score": 74, "value": 3.5, "complexity": 2.0, "readiness": 3.5, "risk": 2.0, "guidance": "Tier 2 selective / use with controls", "stack": "HubSpot/Google/Microsoft/ChatGPT/Claude", "guardrails": "Review tone and avoid unsupported promises" },
    { "lane": "Revenue Response and Client Conversion", "workflow": "Customer response drafting and FAQ support", "outcome": "Improve response speed without fully automating service", "pain": "Teams answer the same questions repeatedly; quality and tone vary", "friction": "Customer replies are manual and inconsistent", "useCases": "Draft responses to common service questions, support inquiries, status updates, and post-purchase questions", "baseline": "Inbox, help desk, docs, CRM, Shopify", "kpis": "Response time; first-response SLA; CSAT; support backlog", "notes": "Keep human approval in place; avoid fully autonomous bots by default", "score": 71, "value": 4.0, "complexity": 2.0, "readiness": 3.0, "risk": 3.0, "guidance": "Tier 2 selective / use with controls", "stack": "HubSpot/Zendesk/Shopify/Google/Microsoft/ChatGPT/Claude", "guardrails": "Human approval for customer-facing responses" },
    { "lane": "Revenue Response and Client Conversion", "workflow": "Renewal or upsell outreach", "outcome": "Increase retention and expansion follow-up", "pain": "Renewals and expansion opportunities are missed or inconsistent", "friction": "Manual account review and outreach drafting", "useCases": "Draft renewal reminders, service expansion emails, cross-sell language, and check-in sequences", "baseline": "CRM, billing/subscription tool, email platform", "kpis": "Renewal rate; upsell pipeline; outreach completion; churn reduction", "notes": "Good when customer history is accessible and reviewed", "score": 78, "value": 4.0, "complexity": 2.0, "readiness": 3.5, "risk": 2.0, "guidance": "Tier 1 or Tier 2 with SME review", "stack": "HubSpot/Google/Microsoft/Shopify/ChatGPT/Claude", "guardrails": "Review eligibility, pricing, and customer context" },
    { "lane": "Revenue Response and Client Conversion", "workflow": "Sales-to-delivery handoff", "outcome": "Reduce dropped context after a sale closes", "pain": "Delivery teams lack clear context from sales conversations", "friction": "Manual handoff summaries and inconsistent kickoff notes", "useCases": "Convert closed-won notes into onboarding summaries, internal handoff briefs, kickoff agendas, and delivery checklists", "baseline": "CRM, docs, project management tool, email", "kpis": "Handoff completeness; kickoff speed; rework reduction; client satisfaction", "notes": "Strong workflow for service businesses", "score": 80, "value": 4.0, "complexity": 2.0, "readiness": 4.0, "risk": 2.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "HubSpot/Google/Microsoft/Asana/Monday/ChatGPT/Claude", "guardrails": "Review for scope accuracy and sensitive customer details" },
    { "lane": "Revenue Response and Client Conversion", "workflow": "Review and reputation response support", "outcome": "Respond consistently to public reviews and customer feedback", "pain": "Reviews are ignored or handled inconsistently", "friction": "Manual public response drafting with reputation risk", "useCases": "Draft review responses, categorize sentiment, identify escalation cases, and summarize recurring themes", "baseline": "Google Business Profile, review platforms, CRM, inbox", "kpis": "Response time; review coverage; sentiment themes; escalation resolution", "notes": "Useful but requires brand/reputation review", "score": 64, "value": 3.0, "complexity": 2.0, "readiness": 3.0, "risk": 3.0, "guidance": "Tier 3 advanced clinic / data-dependent", "stack": "Google/ChatGPT/Claude/CRM/review platforms", "guardrails": "Human review before public posting" },
    { "lane": "Operations and Process Reliability", "workflow": "SOP creation", "outcome": "Reduce tribal knowledge and improve repeatability", "pain": "Processes live in people’s heads; onboarding is inconsistent", "friction": "Instructions are scattered or undocumented", "useCases": "Turn process notes, Loom videos, meeting transcripts, or staff instructions into step-by-step SOPs", "baseline": "Docs, shared drive, notes, videos, messaging threads", "kpis": "Documentation coverage; onboarding time; error reduction; owner dependency", "notes": "Low-risk, high-utility starter workflow", "score": 81, "value": 3.0, "complexity": 1.0, "readiness": 4.0, "risk": 1.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "Google/Microsoft/Notion/ChatGPT/Claude", "guardrails": "Review with actual process owner before publishing" },
    { "lane": "Operations and Process Reliability", "workflow": "Internal documentation and knowledge base", "outcome": "Improve internal access to repeatable information", "pain": "Employees ask the same internal questions repeatedly", "friction": "Knowledge lives across docs, chats, emails, and owner memory", "useCases": "Create team FAQs, knowledge base articles, role guides, checklists, and how-to documents", "baseline": "Shared drive, SharePoint, Drive, Notion, messaging tools", "kpis": "Search time reduced; repeated questions reduced; doc usage", "notes": "Strong internal implementation use case", "score": 84, "value": 3.5, "complexity": 1.0, "readiness": 4.0, "risk": 1.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "Google/Microsoft/Notion/ChatGPT/Claude", "guardrails": "Keep source-of-truth owner and update cadence" },
    { "lane": "Operations and Process Reliability", "workflow": "Onboarding checklists", "outcome": "Standardize employee, client, or vendor onboarding", "pain": "Onboarding varies by person and misses steps", "friction": "Manual checklist creation and inconsistent handoffs", "useCases": "Build employee onboarding, client onboarding, vendor onboarding, and project kickoff checklists", "baseline": "Docs, project management tool, HR/client onboarding materials", "kpis": "Onboarding time; missed steps; completion rate; new-hire/client satisfaction", "notes": "Good fit across many verticals", "score": 84, "value": 3.5, "complexity": 1.0, "readiness": 4.0, "risk": 1.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "Google/Microsoft/Asana/Monday/ChatGPT/Claude", "guardrails": "Review legal, HR, and customer-specific requirements" },
    { "lane": "Operations and Process Reliability", "workflow": "Meeting-to-task workflow", "outcome": "Convert conversations into accountable next steps", "pain": "Meetings create notes but not clear ownership or follow-through", "friction": "Manual summarization and task creation after meetings", "useCases": "Convert meeting transcripts into summaries, decisions, owners, deadlines, and follow-up tasks", "baseline": "Calendar, meeting transcripts, docs, project management tool", "kpis": "Task completion; admin time saved; decision capture; follow-up speed", "notes": "Strong productivity workflow with low technical burden", "score": 81, "value": 3.0, "complexity": 1.0, "readiness": 4.0, "risk": 1.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "Microsoft Teams/Google Meet/Zoom/Asana/ChatGPT/Claude", "guardrails": "Review decisions and assigned owners before sharing" },
    { "lane": "Operations and Process Reliability", "workflow": "Recurring admin summaries", "outcome": "Free owner/admin time from repeated status work", "pain": "Weekly updates and status reports consume time", "friction": "Repeating low-leverage documentation tasks", "useCases": "Summarize weekly operations updates, inbox themes, project status notes, or client activity", "baseline": "Email, docs, project management tool, shared drive", "kpis": "Admin time saved; report cycle time; completion rate", "notes": "Good supporting use case but less strategic than revenue workflows", "score": 81, "value": 3.0, "complexity": 1.0, "readiness": 4.0, "risk": 1.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "Google/Microsoft/Asana/Monday/ChatGPT/Claude", "guardrails": "Review for accuracy and omitted context" },
    { "lane": "Operations and Process Reliability", "workflow": "Scheduling support", "outcome": "Reduce coordination burden and missed prep", "pain": "Scheduling and reminder messages are repetitive", "friction": "Manual back-and-forth communication and prep instructions", "useCases": "Draft scheduling emails, appointment confirmations, prep instructions, and reminder templates", "baseline": "Calendar, email, scheduling tool, CRM", "kpis": "Scheduling cycle time; no-show rate; admin time saved", "notes": "Useful but often a supporting workflow", "score": 70, "value": 3.0, "complexity": 2.0, "readiness": 3.5, "risk": 2.0, "guidance": "Tier 2 selective / use with controls", "stack": "Google/Microsoft/Calendly/Square/Jobber/ChatGPT/Claude", "guardrails": "Human review before calendar commitments if automated" },
    { "lane": "Operations and Process Reliability", "workflow": "Invoice follow-up", "outcome": "Reduce outstanding receivables and admin burden", "pain": "Invoices go out late or follow-up is inconsistent", "friction": "Manual reminders and inconsistent collections discipline", "useCases": "Draft payment reminders, past-due follow-ups, installment notices, and collections escalation language", "baseline": "QuickBooks, accounting system, spreadsheet, email", "kpis": "Days sales outstanding; overdue invoice count; follow-up completion; cash collected", "notes": "Good fit when accounting records are clean", "score": 76, "value": 4.0, "complexity": 2.0, "readiness": 4.0, "risk": 3.0, "guidance": "Tier 1 or Tier 2 with SME review", "stack": "QuickBooks/Intuit/Microsoft/Google/ChatGPT/Claude", "guardrails": "Review tone, customer history, and payment facts" },
    { "lane": "Operations and Process Reliability", "workflow": "Bookkeeping prep and categorization support", "outcome": "Reduce manual finance prep and improve visibility", "pain": "Owners spend time organizing receipts, transactions, and month-end notes", "friction": "Repetitive categorization and cleanup work", "useCases": "Generate categorization suggestions, receipt summaries, missing-document lists, transaction explanations, and accountant prep packets", "baseline": "QuickBooks, Xero, bank export, receipt capture, spreadsheet", "kpis": "Close time; reconciliation time; missing docs; reporting turnaround", "notes": "Use only with human review and data boundaries", "score": 63, "value": 4.0, "complexity": 3.0, "readiness": 3.0, "risk": 4.0, "guidance": "Tier 3 advanced clinic / data-dependent", "stack": "QuickBooks/Intuit/Xero/Microsoft/Claude/ChatGPT", "guardrails": "Do not automate accounting judgment; accountant/bookkeeper review required" },
    { "lane": "Operations and Process Reliability", "workflow": "Vendor communication", "outcome": "Improve consistency in vendor follow-up and issue handling", "pain": "Vendor updates are informal and scattered", "friction": "Manual follow-up and issue summarization", "useCases": "Draft vendor follow-ups, order status requests, issue summaries, and procurement/admin emails", "baseline": "Email, procurement docs, inventory/order systems", "kpis": "Response time; issue closure; admin time saved", "notes": "Good supporting workflow for operations-heavy businesses", "score": 70, "value": 3.0, "complexity": 2.0, "readiness": 3.5, "risk": 2.0, "guidance": "Tier 2 selective / use with controls", "stack": "Google/Microsoft/ChatGPT/Claude", "guardrails": "Review commitments, quantities, and payment terms" },
    { "lane": "Operations and Process Reliability", "workflow": "Quality assurance checklists", "outcome": "Improve consistency before work leaves the business", "pain": "Review criteria are informal or vary by person", "friction": "Manual QA and subjective approval steps", "useCases": "Build review checklists for proposals, content, client deliverables, invoices, onboarding, or service delivery", "baseline": "Docs, templates, project management tool, shared drive", "kpis": "Error reduction; review time; revision cycles; approval consistency", "notes": "Strong complement to every workflow lane", "score": 82, "value": 3.5, "complexity": 1.5, "readiness": 4.0, "risk": 1.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "Google/Microsoft/Notion/ChatGPT/Claude", "guardrails": "Assign reviewer and keep checklist updated" },
    { "lane": "Operations and Process Reliability", "workflow": "Internal training materials", "outcome": "Turn SOPs into practical enablement assets", "pain": "Training is informal and dependent on owners or senior staff", "friction": "Manual conversion of processes into learning materials", "useCases": "Convert SOPs into training guides, quick-reference sheets, role instructions, and quiz/check questions", "baseline": "SOPs, docs, LMS, shared drive", "kpis": "Training time; completion rate; support questions; process adherence", "notes": "Useful for sustainment after the pilot", "score": 82, "value": 3.5, "complexity": 1.5, "readiness": 4.0, "risk": 1.0, "guidance": "Tier 1 default / strong first-cohort fit", "stack": "Google/Microsoft/Canva/LMS/ChatGPT/Claude", "guardrails": "Review with process owner and update as workflow changes" },
    { "lane": "Operations and Process Reliability", "workflow": "File and knowledge organization", "outcome": "Improve findability and source-of-truth discipline", "pain": "Files are hard to locate; duplicate versions create confusion", "friction": "Information architecture is informal or inconsistent", "useCases": "Create naming conventions, folder structures, document inventories, and source-of-truth maps", "baseline": "Google Drive, SharePoint, Dropbox, Notion", "kpis": "Search time; duplicate files reduced; source-of-truth adoption", "notes": "Useful foundation before knowledge-heavy AI workflows", "score": 74, "value": 3.0, "complexity": 2.0, "readiness": 3.5, "risk": 1.0, "guidance": "Tier 1 or Tier 2 with SME review", "stack": "Google/Microsoft/Notion/ChatGPT/Claude", "guardrails": "Assign ownership and update cadence" },
    { "lane": "Insights and Decision Support", "workflow": "Weekly KPI digest", "outcome": "Help owners act on business data faster", "pain": "Reports exist but are underused or too hard to interpret", "friction": "Data is spread across dashboards, exports, and spreadsheets", "useCases": "Turn dashboard exports or spreadsheets into plain-English weekly performance summaries", "baseline": "Spreadsheet, BI dashboard, accounting export, CRM export", "kpis": "Reporting frequency; decision cycle time; action completion", "notes": "Good bridge case when data is already accessible", "score": 71, "value": 4.0, "complexity": 3.0, "readiness": 3.0, "risk": 2.0, "guidance": "Tier 2 selective / use with controls", "stack": "Google Sheets/Microsoft Excel/CRM/QuickBooks/ChatGPT/Claude", "guardrails": "Reference source data and avoid unsupported recommendations" },
    { "lane": "Insights and Decision Support", "workflow": "Dashboard interpretation", "outcome": "Explain trends, anomalies, and likely drivers", "pain": "Owners see metrics but lack time or confidence to interpret them", "friction": "Manual review of charts and exports without consistent commentary", "useCases": "Explain trends, anomalies, changes, and likely drivers from sales, marketing, finance, or ops dashboards", "baseline": "CRM dashboard, Shopify analytics, QuickBooks, spreadsheet, BI tool", "kpis": "Insight cycle time; actions identified; reporting adoption", "notes": "Selective if data source is clear and trusted", "score": 71, "value": 4.0, "complexity": 3.0, "readiness": 3.0, "risk": 2.0, "guidance": "Tier 2 selective / use with controls", "stack": "Excel/Sheets/Shopify/HubSpot/QuickBooks/ChatGPT/Claude", "guardrails": "Keep human decision-maker; require source references" },
    { "lane": "Insights and Decision Support", "workflow": "Campaign performance analysis", "outcome": "Improve marketing decisions from actual results", "pain": "Campaign results are not converted into next actions", "friction": "Metrics are reviewed inconsistently across channels", "useCases": "Summarize results, compare channels, identify best segments, and suggest next tests", "baseline": "Email platform, CRM, web analytics, Shopify, spreadsheet", "kpis": "Next tests created; campaign ROI; decision speed; learning velocity", "notes": "Strong fit for data-ready marketing teams", "score": 74, "value": 3.5, "complexity": 2.0, "readiness": 3.5, "risk": 2.0, "guidance": "Tier 2 selective / use with controls", "stack": "HubSpot/Shopify/Google Analytics/Sheets/ChatGPT/Claude", "guardrails": "Avoid overclaiming causality from weak data" },
    { "lane": "Insights and Decision Support", "workflow": "Customer feedback analysis", "outcome": "Find patterns in reviews, surveys, and support messages", "pain": "Feedback exists but is not synthesized into action", "friction": "Qualitative data is scattered across reviews, tickets, calls, and surveys", "useCases": "Analyze reviews, surveys, support tickets, call notes, or emails to identify recurring themes and pain points", "baseline": "Review platforms, help desk, CRM, surveys, inbox", "kpis": "Themes identified; support/product actions; response time; CSAT movement", "notes": "Good fit if data can be de-identified or reviewed safely", "score": 78, "value": 4.0, "complexity": 2.0, "readiness": 3.5, "risk": 2.0, "guidance": "Tier 1 or Tier 2 with SME review", "stack": "HubSpot/Zendesk/Google/ChatGPT/Claude", "guardrails": "De-identify sensitive customer data where possible" },
    { "lane": "Insights and Decision Support", "workflow": "Sales pipeline insight", "outcome": "Improve visibility into pipeline health and follow-up gaps", "pain": "Stalled deals and follow-up gaps are hard to spot", "friction": "CRM data exists but is not reviewed consistently", "useCases": "Summarize pipeline movement, stalled deals, lead sources, conversion patterns, and follow-up gaps", "baseline": "CRM, spreadsheet, sales dashboard", "kpis": "Pipeline hygiene; stalled deal count; follow-up completion; forecast confidence", "notes": "Useful where CRM hygiene is strong enough", "score": 67, "value": 4.0, "complexity": 3.0, "readiness": 3.0, "risk": 3.0, "guidance": "Tier 2 selective / use with controls", "stack": "HubSpot/Salesforce/Excel/Sheets/ChatGPT/Claude", "guardrails": "Do not automate deal decisions; review assumptions" },
    { "lane": "Insights and Decision Support", "workflow": "Cash-flow scenario summary", "outcome": "Improve financial planning and resilience", "pain": "Cash-flow surprises create stress; planning is reactive", "friction": "Forecasting is manual or absent", "useCases": "Create plain-English summaries of cash-flow scenarios, receivables, payables, and short-term risks", "baseline": "QuickBooks, accounting data, spreadsheet, invoicing data", "kpis": "Planning cadence; forecast visibility; cash risk flagged; DSO movement", "notes": "Valuable but sensitive; selective only", "score": 63, "value": 4.0, "complexity": 3.0, "readiness": 3.0, "risk": 4.0, "guidance": "Tier 3 advanced clinic / data-dependent", "stack": "QuickBooks/Excel/Sheets/ChatGPT/Claude", "guardrails": "Financial owner/accountant review required" },
    { "lane": "Insights and Decision Support", "workflow": "AR aging insight", "outcome": "Prioritize receivables follow-up and collections work", "pain": "Overdue invoices are reviewed inconsistently", "friction": "Manual aging review and follow-up prioritization", "useCases": "Summarize overdue invoices, customer payment patterns, collection priorities, and follow-up categories", "baseline": "QuickBooks, accounting system, spreadsheet", "kpis": "DSO; overdue balance; follow-up completion; cash collected", "notes": "Selective finance-adjacent insight workflow", "score": 72, "value": 4.0, "complexity": 2.5, "readiness": 3.5, "risk": 3.0, "guidance": "Tier 2 selective / use with controls", "stack": "QuickBooks/Excel/Sheets/ChatGPT/Claude", "guardrails": "Review customer context and financial facts before action" },
    { "lane": "Insights and Decision Support", "workflow": "Inventory and demand insight", "outcome": "Reduce stockouts, overordering, and manual planning", "pain": "Inventory decisions rely on intuition; data is fragmented", "friction": "Forecasting needs multiple data sources and exception handling", "useCases": "Summarize product demand, stockout patterns, seasonal trends, reorder risks, and sales velocity", "baseline": "POS, Shopify, inventory tool, spreadsheet", "kpis": "Stockout rate; excess inventory; forecast variance; reorder accuracy", "notes": "Usually too data-dependent for default first cohort", "score": 58, "value": 4.0, "complexity": 4.0, "readiness": 2.0, "risk": 3.0, "guidance": "Tier 3 advanced clinic / data-dependent", "stack": "Shopify/POS/Inventory tool/Excel/Sheets/ChatGPT/Claude", "guardrails": "Human review before purchasing or inventory commitments" },
    { "lane": "Insights and Decision Support", "workflow": "Market and customer research synthesis", "outcome": "Support strategy with faster external and internal research", "pain": "Owners lack time to synthesize market and customer signals", "friction": "Research and customer signals are fragmented", "useCases": "Summarize segments, competitor positioning, market signals, and opportunity areas", "baseline": "Web research, reviews, CRM notes, survey data", "kpis": "Research time saved; decision confidence; opportunity list created", "notes": "Useful for planning but not always measurable in 12 weeks", "score": 68, "value": 3.0, "complexity": 2.0, "readiness": 3.0, "risk": 2.0, "guidance": "Tier 2 selective / use with controls", "stack": "Google/ChatGPT/Claude/research tools", "guardrails": "Cite sources and verify claims" },
    { "lane": "Insights and Decision Support", "workflow": "Board or advisor update memo", "outcome": "Improve communication of business performance and decisions", "pain": "Updates are inconsistent or take too long to prepare", "friction": "Manual synthesis of KPIs, risks, and operating notes", "useCases": "Convert KPI data and operating notes into a monthly business update, risks section, and decision list", "baseline": "Spreadsheet, CRM, accounting export, project notes", "kpis": "Prep time saved; update cadence; decision clarity; advisor engagement", "notes": "Good for more mature SMB operators", "score": 74, "value": 3.5, "complexity": 2.0, "readiness": 3.5, "risk": 2.0, "guidance": "Tier 2 selective / use with controls", "stack": "Google/Microsoft/Excel/Sheets/ChatGPT/Claude", "guardrails": "Review financials, strategy claims, and sensitive details" },
    { "lane": "Insights and Decision Support", "workflow": "Data quality audit", "outcome": "Identify reporting gaps before advanced AI use", "pain": "Data is incomplete, duplicated, or inconsistent", "friction": "Reporting issues are hidden until analysis fails", "useCases": "Identify missing fields, inconsistent tracking, duplicate records, unclear sources of truth, and reporting gaps", "baseline": "CRM, spreadsheet, QuickBooks, Shopify, BI tool", "kpis": "Data completeness; duplicate reduction; source-of-truth clarity; audit findings resolved", "notes": "Important prerequisite for data-heavy workflows", "score": 68, "value": 3.5, "complexity": 3.0, "readiness": 3.0, "risk": 2.0, "guidance": "Tier 2 selective / use with controls", "stack": "Excel/Sheets/CRM/QuickBooks/Shopify/ChatGPT/Claude", "guardrails": "Do not infer missing facts; document data limitations" },
    { "lane": "Insights and Decision Support", "workflow": "Staffing or workload forecast", "outcome": "Support planning around capacity and service volume", "pain": "Staffing decisions rely on intuition and reactive scheduling", "friction": "Workload data is fragmented or informal", "useCases": "Summarize workload patterns, service volume, scheduling pressure, and staffing pinch points", "baseline": "Scheduling tool, CRM, time tracking, spreadsheet", "kpis": "Forecast accuracy; overtime; service backlog; staffing decisions", "notes": "Advanced and data-dependent", "score": 54, "value": 3.5, "complexity": 4.0, "readiness": 2.0, "risk": 3.0, "guidance": "Tier 3 advanced clinic / data-dependent", "stack": "Excel/Sheets/Scheduling tool/ChatGPT/Claude", "guardrails": "Human management review; avoid automated employment decisions" },
    { "lane": "OUT OF SCOPE", "workflow": "High-risk financial or regulated decision automation", "outcome": "Automate sensitive decisions", "pain": "Interest in automating approvals or decisions touching sensitive data", "friction": "High exposure with unclear controls or auditability", "useCases": "Autonomous credit, payment, legal, hiring, insurance, tax, or regulated decisions", "baseline": "Accounting, HR, legal, regulated systems", "kpis": "N/A", "notes": "Exclude unless a separate governance-heavy program exists", "score": 50, "value": 4.0, "complexity": 4.0, "readiness": 2.0, "risk": 5.0, "guidance": "Exclude from default cohort", "stack": "None - out of scope", "guardrails": "Do not pilot in default cohort" },
    { "lane": "OUT OF SCOPE", "workflow": "Autonomous customer-facing bot with no reviewer", "outcome": "Reduce service workload through full automation", "pain": "Teams want 24/7 coverage but lack governance and QA", "friction": "High autonomy in live customer interactions", "useCases": "Full autonomous chat or messaging without approval, escalation, or monitoring", "baseline": "Help desk, chatbot platform, website chat", "kpis": "N/A", "notes": "Too much reputational and quality risk for initial pilot", "score": 47, "value": 3.0, "complexity": 3.0, "readiness": 2.0, "risk": 5.0, "guidance": "Exclude from default cohort", "stack": "None - out of scope", "guardrails": "Human review/escalation required before any customer automation" },
    { "lane": "OUT OF SCOPE", "workflow": "Unreviewed agentic action across systems", "outcome": "Execute multi-step work without human approval", "pain": "Interest in agents that change records, send messages, or trigger transactions independently", "friction": "High autonomy across multiple systems with unclear rollback or auditability", "useCases": "Agents that update CRM, send emails, create invoices, change inventory, or trigger workflows without approval", "baseline": "CRM, email, accounting, ecommerce, automation tools", "kpis": "N/A", "notes": "Defer until workflow, permissions, logs, and approval gates are mature", "score": 46, "value": 4.0, "complexity": 5.0, "readiness": 2.0, "risk": 5.0, "guidance": "Exclude from default cohort", "stack": "None - out of scope", "guardrails": "Require explicit approval gates, logs, and rollback path" }
  ],
  "lanes": [
    { "lane": "Growth, Content, and Demand", "value": 3.75, "readiness": 3.65, "complexity": 1.75, "risk": 1.75, "score": 82, "role": "Standing Group A / Tier 1 default", "why": "Broad SMB demand signal; strong low-risk content and campaign use cases; clear measurable outputs.", "sme": "Growth marketing, lifecycle, ecommerce retention, content systems", "contentFit": "Google, OpenAI, Anthropic, Shopify, HubSpot, Canva" },
    { "lane": "Revenue Response and Client Conversion", "value": 4.1, "readiness": 3.65, "complexity": 2.15, "risk": 2.35, "score": 78, "role": "Standing Group B / Tier 1 default", "why": "Strong revenue linkage through lead response, proposals, CRM hygiene, and customer communication.", "sme": "Revenue ops, sales enablement, customer success, CRM process", "contentFit": "Microsoft, OpenAI, Anthropic, HubSpot, Square, Google" },
    { "lane": "Operations and Process Reliability", "value": 3.4, "readiness": 3.7, "complexity": 1.9, "risk": 1.9, "score": 78, "role": "Standing Group C / Tier 1 with finance controls", "why": "Strong implementation value through SOPs, documentation, admin summaries, and repeatable internal workflows.", "sme": "Business ops, finance ops, SOP/process improvement", "contentFit": "Microsoft, Google, Anthropic, Intuit, Zapier" },
    { "lane": "Insights and Decision Support", "value": 3.65, "readiness": 2.9, "complexity": 3.0, "risk": 2.7, "score": 67, "role": "Selective clinic / Tier 2-3", "why": "Strategically useful, but data quality, source-of-truth clarity, and sensitivity determine fit.", "sme": "Business analytics, ops analytics, finance planning, lightweight BI", "contentFit": "Google, Microsoft, AWS, Shopify, HubSpot, Intuit" },
    { "lane": "OUT OF SCOPE", "value": 3.7, "readiness": 2.0, "complexity": 4.0, "risk": 5.0, "score": 48, "role": "Exclude from default cohort", "why": "Autonomous or sensitive decisioning creates governance, reputation, compliance, and quality risk beyond first-cohort scope.", "sme": "N/A", "contentFit": "N/A" }
  ]
};

const participantSteps = [
  {
    title: "Set up your participant profile",
    detail: "Enter the business, participant, team size, budget, lane, and workflow you want to improve.",
    view: "dashboard",
    complete: () => ["businessName", "participantName", "teamSize", "budget", "workflowLane", "workflowName"].every(complete),
    nextLabel: "Open assignments",
    action: () => {
      state.activeAssignment = "workflow";
      goToView("assignments");
    },
  },
  {
    title: "Complete the workflow brief",
    detail: "Define the goal, trigger, inputs, expected output, owner, reviewer, and baseline metric.",
    view: "assignments",
    assignment: "workflow",
    complete: () => assignmentComplete(assignments[0]),
    nextLabel: "Fill data boundary",
    action: () => {
      state.activeAssignment = "data";
      goToView("assignments");
    },
  },
  {
    title: "Set the data boundary",
    detail: "Document source records, allowed sandbox material, off-limits data, tool route, and cost owner.",
    view: "assignments",
    assignment: "data",
    complete: () => assignmentComplete(assignments[1]),
    nextLabel: "Build test packet",
    action: () => {
      state.activeAssignment = "test";
      goToView("assignments");
    },
  },
  {
    title: "Create the sandbox test packet",
    detail: "Add realistic test cases, edge cases, output format, and stop conditions before you build.",
    view: "assignments",
    assignment: "test",
    complete: () => assignmentComplete(assignments[2]),
    nextLabel: "Draft assistant setup",
    action: () => {
      state.activeAssignment = "assistant";
      goToView("assignments");
    },
  },
  {
    title: "Draft assistant and review rules",
    detail: "Write assistant instructions, review rubric, risk controls, and the pilot launch plan.",
    view: "assignments",
    assignment: "assistant",
    complete: () => ["assistant", "review", "risk", "pilot"].every((id) => assignmentComplete(assignments.find((item) => item.id === id))),
    nextLabel: "Generate testing plan",
    action: () => goToView("plan"),
  },
  {
    title: "Review the generated testing plan",
    detail: "Confirm the plan has enough detail for a safe sandbox gate decision.",
    view: "plan",
    complete: () => gateScore() >= 7,
    nextLabel: "Open sandbox",
    action: () => goToView("sandbox"),
  },
  {
    title: "Run sandbox tests",
    detail: "Run each test case, check the simulated output, and use the results to decide whether the workflow is pilot-ready.",
    view: "sandbox",
    complete: () => state.runCount >= 3 && gateScore() >= 7,
    nextLabel: "Review outcomes",
    action: () => goToView("outcomes"),
  },
  {
    title: "Build the final packet",
    detail: "Use the outcome tracker to package the AI Action Plan, testing evidence, controls, and next decision.",
    view: "outcomes",
    complete: () => completionScore() >= 95 && state.runCount >= 3,
    nextLabel: "Stay on packet",
    action: () => goToView("outcomes"),
  },
];

function loadState() {
  const saved = localStorage.getItem("verizonPlatformState");
  return saved ? { ...initialState, ...JSON.parse(saved) } : { ...initialState };
}

function saveState() {
  localStorage.setItem("verizonPlatformState", JSON.stringify(state));
}

function fieldValue(key) {
  return state[key] || "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setState(key, value) {
  state[key] = value;
  syncParticipantStep();
  saveState();
  renderAll();
}

function valueOrDash(key) {
  return fieldValue(key) || "Not entered";
}

function complete(key) {
  return Boolean(String(fieldValue(key)).trim());
}

const gateChecks = [
  ["Specific workflow", () => complete("workflowName"), "Workflow is named at business-process level."],
  ["Named owner", () => complete("workflowOwner"), "Owner can run or maintain the workflow."],
  ["Named reviewer", () => complete("workflowReviewer"), "Human review path exists before use."],
  ["Baseline metric", () => complete("baselineMetric"), "Value can be compared later."],
  ["Source of truth", () => complete("systemOfRecord"), "Data or records can be located."],
  ["Data boundary", () => complete("allowedData") && complete("blockedData"), "Allowed and off-limits data are documented."],
  ["Stop condition", () => complete("stopConditions"), "Unsafe or poor outputs have a stop rule."],
];

function completionScore() {
  const keys = [
    "workflowName", "businessGoal", "workflowOwner", "workflowReviewer", "baselineMetric",
    "systemOfRecord", "allowedData", "blockedData", "testCase1", "testCase2", "testCase3",
    "assistantRules", "humanHandoff", "reviewBurden", "privacyRules", "goNoGo", "pilotScope",
  ];
  const done = keys.filter(complete).length;
  return Math.round((done / keys.length) * 100);
}

function gateScore() {
  return gateChecks.filter(([, test]) => test()).length;
}

function assignmentComplete(assignment) {
  const count = assignment.fields.filter(([key]) => complete(key)).length;
  return count === assignment.fields.length;
}

function assignmentProgress(assignment) {
  const count = assignment.fields.filter(([key]) => complete(key)).length;
  return { count, total: assignment.fields.length };
}

function stepStatus(index) {
  if (participantSteps[index].complete()) return "done";
  if (index === state.participantStep) return "active";
  return index < state.participantStep ? "done" : "";
}

function syncParticipantStep() {
  const nextOpen = participantSteps.findIndex((step) => !step.complete());
  state.participantStep = nextOpen === -1 ? participantSteps.length - 1 : nextOpen;
}

function goToView(view) {
  document.querySelectorAll(".nav-item").forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle("active", active);
  });
  document.querySelectorAll(".view").forEach((panel) => {
    panel.classList.toggle("active", panel.id === view);
  });
  saveState();
}

function continueParticipant() {
  syncParticipantStep();
  const step = participantSteps[state.participantStep];
  if (step.assignment) state.activeAssignment = step.assignment;
  step.action();
  saveState();
  renderAll();
}

async function loadTaxonomyData() {
  try {
    const response = await fetch("./taxonomy.json");
    if (!response.ok) throw new Error(`Taxonomy request failed: ${response.status}`);
    taxonomyData = await response.json();
  } catch {
    taxonomyData = TAXONOMY_FALLBACK;
  }
  if (!state.selectedTaxonomyLane) {
    state.selectedTaxonomyLane = fieldValue("workflowLane") || taxonomyData.lanes?.[0]?.lane || "";
  }
  if (!state.selectedTaxonomyWorkflow) {
    const first = workflowsForLane(state.selectedTaxonomyLane)[0] || taxonomyData.workflows?.[0];
    state.selectedTaxonomyWorkflow = first?.workflow || "";
  }
  saveState();
}

function workflowsForLane(lane) {
  return taxonomyData.workflows
    .filter((item) => item.lane === lane)
    .sort((a, b) => b.score - a.score || b.value - a.value || a.complexity - b.complexity);
}

function selectedTaxonomyWorkflow() {
  const byName = taxonomyData.workflows.find((item) => item.workflow === state.selectedTaxonomyWorkflow);
  if (byName) return byName;
  const first = workflowsForLane(state.selectedTaxonomyLane)[0] || taxonomyData.workflows[0];
  if (first) {
    state.selectedTaxonomyLane = first.lane;
    state.selectedTaxonomyWorkflow = first.workflow;
  }
  return first;
}

function selectedLaneSummary(lane) {
  return taxonomyData.lanes.find((item) => item.lane === lane);
}

function priorityBand(score) {
  if (score >= 80) return "Default first-cohort";
  if (score >= 65) return "Selective first-cohort";
  if (score >= 50) return "Clinic / later cohort";
  return "Exclude by default";
}

function applyTaxonomyWorkflow(item) {
  if (!item) return;
  Object.assign(state, {
    selectedTaxonomyLane: item.lane,
    selectedTaxonomyWorkflow: item.workflow,
    workflowLane: item.lane,
    workflowName: item.workflow,
    businessGoal: state.businessGoal || item.outcome,
    workflowInput: state.workflowInput || item.baseline,
    workflowOutput: state.workflowOutput || item.useCases,
    baselineMetric: state.baselineMetric || item.kpis,
    systemOfRecord: state.systemOfRecord || item.baseline,
    stopConditions: state.stopConditions || item.guardrails,
  });
  syncParticipantStep();
  saveState();
  syncInputValues();
  renderAll();
}

function syncInputValues() {
  document.querySelectorAll("[data-state]").forEach((el) => {
    el.value = fieldValue(el.dataset.state);
  });
}

function bindGlobalInputs() {
  document.querySelectorAll("[data-state]").forEach((el) => {
    el.value = fieldValue(el.dataset.state);
    el.addEventListener("input", (event) => setState(event.target.dataset.state, event.target.value));
    el.addEventListener("change", (event) => setState(event.target.dataset.state, event.target.value));
  });
}

function renderNav() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      goToView(button.dataset.view);
    });
  });
}

function renderDashboard() {
  syncParticipantStep();
  document.getElementById("laneBadge").textContent = fieldValue("workflowLane") || "Lane unassigned";
  const score = completionScore();
  document.getElementById("overallProgress").style.width = `${score}%`;
  const artifactsDone = assignments.filter(assignmentComplete).length;
  document.getElementById("artifactCount").textContent = `${artifactsDone}/${assignments.length}`;
  const gateText = gateScore() >= 7 ? "Week 6 gate ready" : gateScore() >= 5 ? "Week 3 gate likely" : "Week 3 gate pending";
  document.getElementById("gateStatus").textContent = gateText;
  const weekMap = [1, 2, 3, 3, 4, 5, 6, 6];
  document.getElementById("currentWeek").textContent = weekMap[Math.min(state.participantStep, weekMap.length - 1)] || 1;
  document.getElementById("workflowCardStatus").textContent = complete("workflowName") && complete("businessGoal") ? "Drafted" : "Incomplete";
  document.getElementById("dataStatus").textContent = complete("allowedData") && complete("blockedData") ? "Defined" : "Incomplete";
  document.getElementById("testStatus").textContent = complete("testCase1") && complete("testCase2") && complete("testCase3") ? "Ready" : "Incomplete";
  document.getElementById("assistantStatus").textContent = complete("assistantRules") ? "Drafted" : "Incomplete";
  document.getElementById("riskStatus").textContent = complete("goNoGo") ? "Defined" : "Incomplete";

  const gateList = document.getElementById("gateList");
  gateList.innerHTML = "";
  gateChecks.forEach(([name, test, description]) => {
    const item = document.createElement("div");
    item.className = `gate-item ${test() ? "complete" : ""}`;
    item.innerHTML = `<span class="gate-check"></span><div><strong>${name}</strong><span>${description}</span></div>`;
    gateList.appendChild(item);
  });
  renderTaxonomySimulator();
  renderJourney();
  renderParticipantGuide();
}

function renderTaxonomySimulator() {
  const laneSelect = document.getElementById("taxonomyLane");
  const workflowSelect = document.getElementById("taxonomyWorkflow");
  const detail = document.getElementById("taxonomyDetail");
  const shortlist = document.getElementById("taxonomyShortlist");
  const band = document.getElementById("taxonomyBand");
  if (!laneSelect || !workflowSelect || !detail || !shortlist || !band) return;

  if (!taxonomyData.workflows.length) {
    band.textContent = "Unavailable";
    detail.innerHTML = `<div class="taxonomy-empty">Taxonomy data could not be loaded.</div>`;
    shortlist.innerHTML = "";
    return;
  }

  const lanes = taxonomyData.lanes.filter((item) => item.lane !== "OUT OF SCOPE");
  if (!state.selectedTaxonomyLane || !lanes.some((item) => item.lane === state.selectedTaxonomyLane)) {
    state.selectedTaxonomyLane = fieldValue("workflowLane") || lanes[0]?.lane || "";
  }
  const laneWorkflows = workflowsForLane(state.selectedTaxonomyLane);
  if (!state.selectedTaxonomyWorkflow || !laneWorkflows.some((item) => item.workflow === state.selectedTaxonomyWorkflow)) {
    state.selectedTaxonomyWorkflow = laneWorkflows[0]?.workflow || "";
  }

  laneSelect.innerHTML = lanes
    .map((item) => `<option value="${escapeHtml(item.lane)}">${escapeHtml(item.lane)}</option>`)
    .join("");
  laneSelect.value = state.selectedTaxonomyLane;
  workflowSelect.innerHTML = laneWorkflows
    .map((item) => `<option value="${escapeHtml(item.workflow)}">${escapeHtml(item.workflow)} (${item.score})</option>`)
    .join("");
  workflowSelect.value = state.selectedTaxonomyWorkflow;

  laneSelect.onchange = (event) => {
    state.selectedTaxonomyLane = event.target.value;
    const first = workflowsForLane(state.selectedTaxonomyLane)[0];
    state.selectedTaxonomyWorkflow = first?.workflow || "";
    saveState();
    renderAll();
  };
  workflowSelect.onchange = (event) => {
    state.selectedTaxonomyWorkflow = event.target.value;
    saveState();
    renderAll();
  };

  const item = selectedTaxonomyWorkflow();
  const lane = selectedLaneSummary(item?.lane);
  if (!item) return;
  const scoreBand = priorityBand(item.score);
  band.textContent = scoreBand;
  detail.innerHTML = `
    <div class="taxonomy-score-card">
      <div>
        <span>Priority score</span>
        <strong>${item.score}</strong>
        <em>${escapeHtml(scoreBand)}</em>
      </div>
      <div class="taxonomy-metrics">
        <span>Value ${item.value}</span>
        <span>Readiness ${item.readiness}</span>
        <span>Complexity ${item.complexity}</span>
        <span>Risk ${item.risk}</span>
      </div>
    </div>
    <div class="taxonomy-copy">
      <div><span>Primary outcome</span><p>${escapeHtml(item.outcome)}</p></div>
      <div><span>Pain pattern</span><p>${escapeHtml(item.pain)}</p></div>
      <div><span>Representative AI use</span><p>${escapeHtml(item.useCases)}</p></div>
      <div><span>Likely system baseline</span><p>${escapeHtml(item.baseline)}</p></div>
      <div><span>Measurable KPIs</span><p>${escapeHtml(item.kpis)}</p></div>
      <div><span>Human review / guardrails</span><p>${escapeHtml(item.guardrails)}</p></div>
    </div>
    <div class="taxonomy-routing">
      <div><strong>Cohort guidance</strong><span>${escapeHtml(item.guidance)}</span></div>
      <div><strong>Stack routing</strong><span>${escapeHtml(item.stack)}</span></div>
      <div><strong>SME track</strong><span>${escapeHtml(lane?.sme || "Not specified")}</span></div>
      <div><strong>Lane role</strong><span>${escapeHtml(lane?.role || "Not specified")}</span></div>
    </div>
    <button id="applyTaxonomyBtn" class="icon-btn" type="button"><i data-lucide="check-circle-2"></i><span>Use This Workflow</span></button>
  `;
  document.getElementById("applyTaxonomyBtn").onclick = () => applyTaxonomyWorkflow(item);

  shortlist.innerHTML = `
    <h3>Top workflows in this lane</h3>
    <div class="taxonomy-shortlist-grid">
      ${laneWorkflows.slice(0, 5).map((workflow) => `
        <button class="taxonomy-shortlist-item ${workflow.workflow === item.workflow ? "active" : ""}" data-taxonomy-workflow="${escapeHtml(workflow.workflow)}">
          <strong>${escapeHtml(workflow.workflow)}</strong>
          <span>${workflow.score} · ${escapeHtml(priorityBand(workflow.score))}</span>
        </button>
      `).join("")}
    </div>
  `;
  shortlist.querySelectorAll("[data-taxonomy-workflow]").forEach((button) => {
    button.onclick = () => {
      state.selectedTaxonomyWorkflow = button.dataset.taxonomyWorkflow;
      saveState();
      renderAll();
    };
  });
}

function renderJourney() {
  const journey = document.getElementById("journey");
  const items = [
    ["Foundations", "Profile"],
    ["Scope", "Workflow brief"],
    ["Boundary", "Data rules"],
    ["Sandbox", "Test packet"],
    ["Controls", "Review path"],
    ["Pilot", "Monitoring log"],
  ];
  journey.innerHTML = items.map(([title, label], index) => {
    const status = index < state.participantStep ? "done" : index === state.participantStep ? "active" : "";
    return `<button class="journey-step ${status}" data-step-jump="${index}"><span>${index + 1}</span><strong>${title}</strong><em>${label}</em></button>`;
  }).join("");
  journey.querySelectorAll("[data-step-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      const stepIndex = Math.min(Number(button.dataset.stepJump), participantSteps.length - 1);
      state.participantStep = stepIndex;
      const step = participantSteps[stepIndex];
      if (step.assignment) state.activeAssignment = step.assignment;
      goToView(step.view);
      saveState();
      renderAll();
    });
  });
}

function renderParticipantGuide() {
  const guide = document.getElementById("participantGuide");
  const current = participantSteps[state.participantStep];
  const completed = participantSteps.filter((step) => step.complete()).length;
  guide.innerHTML = `
    <div class="guide-current">
      <span>Step ${state.participantStep + 1} of ${participantSteps.length}</span>
      <strong>${current.title}</strong>
      <p>${current.detail}</p>
      <div class="progress-track light"><div class="progress-fill" style="width:${Math.round((completed / participantSteps.length) * 100)}%"></div></div>
    </div>
    <div class="guide-list">
      ${participantSteps.map((step, index) => `
        <button class="guide-row ${stepStatus(index)}" data-guide-step="${index}">
          <span>${step.complete() ? "Ready" : index === state.participantStep ? "Now" : "Next"}</span>
          <strong>${step.title}</strong>
        </button>
      `).join("")}
    </div>
  `;
  document.getElementById("guideNextBtn").querySelector("span").textContent = current.nextLabel;
  guide.querySelectorAll("[data-guide-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const stepIndex = Number(button.dataset.guideStep);
      state.participantStep = stepIndex;
      const step = participantSteps[stepIndex];
      if (step.assignment) state.activeAssignment = step.assignment;
      goToView(step.view);
      saveState();
      renderAll();
    });
  });
}

function renderAssignmentTabs() {
  const tabs = document.getElementById("assignmentTabs");
  tabs.innerHTML = "";
  assignments.forEach((assignment) => {
    const progress = assignmentProgress(assignment);
    const button = document.createElement("button");
    button.className = `assignment-tab ${state.activeAssignment === assignment.id ? "active" : ""}`;
    button.innerHTML = `<span>${assignment.label}</span><em>${progress.count}/${progress.total}</em>`;
    button.addEventListener("click", () => {
      state.activeAssignment = assignment.id;
      saveState();
      renderAll();
    });
    tabs.appendChild(button);
  });
}

function renderAssignmentForm() {
  const assignment = assignments.find((item) => item.id === state.activeAssignment) || assignments[0];
  const progress = assignmentProgress(assignment);
  const wrap = document.getElementById("assignmentForm");
  wrap.innerHTML = "";
  const section = document.createElement("section");
  section.className = "form-section";
  section.innerHTML = `<h3>${assignment.title}<span>${progress.count}/${progress.total} complete</span></h3>`;
  const body = document.createElement("div");
  body.className = "form-section-body";
  assignment.fields.forEach(([key, label, placeholder, type]) => {
    const field = document.createElement("label");
    field.className = "form-field";
    const control = type === "textarea" ? document.createElement("textarea") : document.createElement("input");
    control.value = fieldValue(key);
    control.placeholder = placeholder;
    control.addEventListener("input", (event) => setState(key, event.target.value));
    field.innerHTML = `<span>${label}</span>`;
    field.appendChild(control);
    body.appendChild(field);
  });
  section.appendChild(body);
  const footer = document.createElement("div");
  footer.className = "form-actions";
  footer.innerHTML = `
    <button class="icon-btn secondary" id="fillAssignmentBtn" type="button"><i data-lucide="wand-sparkles"></i><span>Use Example</span></button>
    <button class="icon-btn" id="nextAssignmentBtn" type="button"><i data-lucide="arrow-right"></i><span>${assignmentComplete(assignment) ? "Next Form" : "Save Draft"}</span></button>
  `;
  section.appendChild(footer);
  wrap.appendChild(section);
  document.getElementById("fillAssignmentBtn").addEventListener("click", () => {
    assignment.fields.forEach(([key, , placeholder]) => {
      if (!complete(key)) state[key] = placeholder;
    });
    syncParticipantStep();
    saveState();
    renderAll();
  });
  document.getElementById("nextAssignmentBtn").addEventListener("click", () => {
    const index = assignments.findIndex((item) => item.id === assignment.id);
    const next = assignments[index + 1];
    if (next) {
      state.activeAssignment = next.id;
      if (state.participantStep < 5) syncParticipantStep();
      saveState();
      renderAll();
    } else {
      continueParticipant();
    }
  });
}

function renderWorkflowCard() {
  const rows = [
    ["Business", valueOrDash("businessName")],
    ["Workflow", valueOrDash("workflowName")],
    ["Lane", valueOrDash("workflowLane")],
    ["Owner", valueOrDash("workflowOwner")],
    ["Reviewer", valueOrDash("workflowReviewer")],
    ["Metric", valueOrDash("baselineMetric")],
    ["System of record", valueOrDash("systemOfRecord")],
    ["Tool route", valueOrDash("toolRoute")],
  ];
  document.getElementById("workflowCard").innerHTML = rows
    .map(([label, value]) => `<div class="workflow-card-row"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function planSections() {
  return [
    ["1. Workflow Card", [
      `Business: ${valueOrDash("businessName")}`,
      `Workflow: ${valueOrDash("workflowName")}`,
      `Business goal: ${valueOrDash("businessGoal")}`,
      `Owner: ${valueOrDash("workflowOwner")}`,
      `Reviewer: ${valueOrDash("workflowReviewer")}`,
      `Baseline metric: ${valueOrDash("baselineMetric")}`,
    ]],
    ["2. Data Boundary", [
      `System of record: ${valueOrDash("systemOfRecord")}`,
      `Allowed sandbox data: ${valueOrDash("allowedData")}`,
      `Off-limits data: ${valueOrDash("blockedData")}`,
      `Privacy rule: ${valueOrDash("privacyRules")}`,
    ]],
    ["3. Test Packet", [
      `Test case 1: ${valueOrDash("testCase1")}`,
      `Test case 2: ${valueOrDash("testCase2")}`,
      `Test case 3: ${valueOrDash("testCase3")}`,
      `Desired output: ${valueOrDash("desiredFormat")}`,
      `Edge cases: ${valueOrDash("edgeCases")}`,
    ]],
    ["4. Assistant / Agent Setup", [
      `Assistant: ${valueOrDash("assistantName")}`,
      `Role: ${valueOrDash("assistantRole")}`,
      `Rules: ${valueOrDash("assistantRules")}`,
      `Agent tasks: ${valueOrDash("agentTasks")}`,
      `Human handoff: ${valueOrDash("humanHandoff")}`,
    ]],
    ["5. Review and Risk Controls", [
      `Accuracy standard: ${valueOrDash("accuracyStandard")}`,
      `Review burden target: ${valueOrDash("reviewBurden")}`,
      `Escalation path: ${valueOrDash("escalationPath")}`,
      `Stop conditions: ${valueOrDash("stopConditions")}`,
      `Go/no-go rule: ${valueOrDash("goNoGo")}`,
    ]],
    ["6. Pilot Launch", [
      `Scope: ${valueOrDash("pilotScope")}`,
      `Users: ${valueOrDash("pilotUsers")}`,
      `Frequency: ${valueOrDash("runFrequency")}`,
      `Monitoring log: ${valueOrDash("monitoringLog")}`,
      `Success metric: ${valueOrDash("successMetric")}`,
      `Post-pilot decision: ${valueOrDash("nextDecision")}`,
    ]],
  ];
}

function renderTestingPlan() {
  const html = planSections().map(([title, items]) => `
    <section class="doc-section">
      <h3>${title}</h3>
      <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
    </section>
  `).join("");
  document.getElementById("testingPlan").innerHTML = html;

  const score = completionScore();
  document.getElementById("readinessMeter").innerHTML = `<div class="meter-ring" style="--score:${score}%"><span>${score}%</span></div>`;
  const missing = gateChecks.filter(([, test]) => !test()).map(([name, , description]) => `<div><strong>${name}</strong><br>${description}</div>`);
  document.getElementById("missingItems").innerHTML = missing.length ? missing.join("") : "<div><strong>Ready for sandbox gate review</strong><br>All required gate signals are present.</div>";
}

function renderBuilderTabs() {
  document.querySelectorAll(".builder-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.builder === state.activeBuilder);
    button.onclick = () => {
      state.activeBuilder = button.dataset.builder;
      saveState();
      renderAll();
    };
  });
}

function renderBuilder() {
  const content = document.getElementById("builderContent");
  if (state.activeBuilder === "assistant") {
    content.innerHTML = `
      <div class="builder-card"><h3>${valueOrDash("assistantName")}</h3>
        <label>System instructions<textarea data-builder-key="assistantRules">${fieldValue("assistantRules")}</textarea></label>
      </div>
      <div class="builder-card"><h3>Context pack</h3>
        <label>Allowed source material<textarea data-builder-key="allowedData">${fieldValue("allowedData")}</textarea></label>
      </div>`;
  } else if (state.activeBuilder === "agent") {
    content.innerHTML = `
      <div class="builder-card"><h3>Agent task chain</h3>
        <div class="flow">
          ${String(valueOrDash("agentTasks")).split(",").map((step, index) => `<div class="flow-step"><span>${index + 1}</span><strong>${step.trim()}</strong></div>`).join("")}
        </div>
      </div>
      <div class="builder-card"><h3>Human boundary</h3><p>${valueOrDash("humanHandoff")}</p></div>`;
  } else if (state.activeBuilder === "automation") {
    content.innerHTML = `
      <div class="builder-card"><h3>Automation route</h3>
        <div class="flow">
          <div class="flow-step"><span>1</span><strong>${valueOrDash("workflowTrigger")}</strong></div>
          <div class="flow-step"><span>2</span><strong>Pull approved source fields from ${valueOrDash("systemOfRecord")}</strong></div>
          <div class="flow-step"><span>3</span><strong>Generate draft output through assistant</strong></div>
          <div class="flow-step"><span>4</span><strong>Send to ${valueOrDash("workflowReviewer")} for approval</strong></div>
          <div class="flow-step"><span>5</span><strong>Log decision and next task</strong></div>
        </div>
      </div>`;
  } else {
    content.innerHTML = `
      <div class="builder-card"><h3>Review rubric</h3>
        <div class="review-grid">
          <div class="review-chip"><strong>Accuracy</strong><span>${valueOrDash("accuracyStandard")}</span></div>
          <div class="review-chip"><strong>Completeness</strong><span>${valueOrDash("completenessStandard")}</span></div>
          <div class="review-chip"><strong>Brand</strong><span>${valueOrDash("brandStandard")}</span></div>
          <div class="review-chip"><strong>Escalation</strong><span>${valueOrDash("escalationPath")}</span></div>
        </div>
      </div>`;
  }
  content.querySelectorAll("[data-builder-key]").forEach((el) => {
    el.addEventListener("input", (event) => setState(event.target.dataset.builderKey, event.target.value));
  });
}

function renderTestRunner() {
  const scenarios = ["testCase1", "testCase2", "testCase3"];
  const labels = {
    testCase1: "Case 1",
    testCase2: "Case 2",
    testCase3: "Case 3",
  };
  const activeScenario = state.activeScenario || "testCase1";
  const runLog = Array.isArray(state.runLog) ? state.runLog : [];
  const latest = runLog[runLog.length - 1];
  const output = latest ? `Run ${latest.run}

Scenario: ${latest.scenario}
Workflow: ${valueOrDash("workflowName")}
Input: ${latest.input}

Simulated participant output:
${latest.output}

Review checklist:
- Accuracy: ${latest.accuracy}
- Data boundary: ${latest.boundary}
- Human review: ${latest.review}
- Stop rule: ${latest.stop}
- Decision: ${latest.decision}` : `No sandbox runs yet.

Select a test case and click Run Test. Run all three cases before moving to outcomes.`;

  document.getElementById("testRunner").innerHTML = `
    <div class="scenario-tabs">
      ${scenarios.map((key) => `<button class="scenario-tab ${activeScenario === key ? "active" : ""}" data-scenario="${key}">${labels[key]}</button>`).join("")}
    </div>
    <div class="scenario-card">
      <span>Selected input</span>
      <strong>${valueOrDash(activeScenario)}</strong>
    </div>
    <div class="run-output">${output}</div>
    <div class="run-log">
      ${runLog.length ? runLog.map((run) => `<div><span>Run ${run.run}</span><strong>${run.scenario}</strong><em>${run.decision}</em></div>`).join("") : "<div><span>Waiting</span><strong>No evidence logged</strong><em>Run all three cases</em></div>"}
    </div>
  `;
  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeScenario = button.dataset.scenario;
      saveState();
      renderAll();
    });
  });
}

function renderOutcomes() {
  const kpis = [
    ["Artifact completion", assignments.filter(assignmentComplete).length / assignments.length],
    ["Workflow readiness", gateScore() / gateChecks.length],
    ["Sandbox setup", (complete("testCase1") + complete("testCase2") + complete("testCase3") + complete("assistantRules")) / 4],
    ["Governance readiness", (complete("privacyRules") + complete("stopConditions") + complete("goNoGo")) / 3],
    ["Pilot readiness", (complete("pilotScope") + complete("monitoringLog") + complete("successMetric")) / 3],
  ];
  document.getElementById("kpiList").innerHTML = kpis.map(([label, value]) => `
    <div class="kpi-row"><strong>${label}</strong><div class="kpi-track"><div class="kpi-fill" style="width:${Math.round(value * 100)}%"></div></div><span>${Math.round(value * 100)}%</span></div>
  `).join("");
  const packet = [
    ["AI Action Plan", complete("businessGoal")],
    ["Workflow card", complete("workflowName") && complete("workflowOwner")],
    ["Sandbox testing plan", gateScore() >= 5],
    ["Governance controls", complete("goNoGo")],
    ["Pilot value story", complete("successMetric")],
    ["90-day roadmap", complete("nextDecision")],
  ];
  document.getElementById("packetBuilder").innerHTML = packet.map(([label, done]) => `
    <div class="packet-row"><span>${done ? "Ready" : "Draft"}</span><strong>${label}</strong></div>
  `).join("") + `
    <button id="downloadPacketBtn" class="icon-btn"><i data-lucide="download"></i><span>Download Final Packet</span></button>
  `;
  document.getElementById("downloadPacketBtn").addEventListener("click", () => downloadText("verizon-ai-final-packet.txt", finalPacketText()));
}

function planText() {
  return planSections().map(([title, items]) => `${title}\n${items.map((item) => `- ${item}`).join("\n")}`).join("\n\n");
}

function finalPacketText() {
  const runLog = Array.isArray(state.runLog) ? state.runLog : [];
  return `Verizon AI Signature Program Final Packet

Participant
- Business: ${valueOrDash("businessName")}
- Participant: ${valueOrDash("participantName")}
- Workflow lane: ${valueOrDash("workflowLane")}
- Selected workflow: ${valueOrDash("workflowName")}

Readiness
- Completion score: ${completionScore()}%
- Gate score: ${gateScore()}/${gateChecks.length}
- Sandbox runs: ${state.runCount || 0}

${planText()}

Sandbox Evidence
${runLog.length ? runLog.map((run) => `Run ${run.run}: ${run.scenario}
- Input: ${run.input}
- Decision: ${run.decision}
- Output: ${run.output}`).join("\n\n") : "- No sandbox runs logged."}`;
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function runSandboxTest() {
  const scenarioKey = state.activeScenario || "testCase1";
  const input = valueOrDash(scenarioKey);
  const gatesReady = gateScore() >= 7;
  const output = [
    `Draft ${valueOrDash("desiredFormat").toLowerCase()} for ${valueOrDash("workflowName")}.`,
    "Use only the approved source material and mark any missing facts for the reviewer.",
    `Route customer-facing language to ${valueOrDash("workflowReviewer")} before use.`,
    `Log outcome against: ${valueOrDash("successMetric")}.`,
  ].join(" ");
  const run = {
    run: (state.runCount || 0) + 1,
    scenario: scenarioKey.replace("testCase", "Test case "),
    input,
    output,
    accuracy: complete("accuracyStandard") ? "review rubric available" : "rubric missing",
    boundary: complete("allowedData") && complete("blockedData") ? "documented" : "incomplete",
    review: complete("humanHandoff") ? "required before use" : "handoff missing",
    stop: complete("stopConditions") ? "available" : "missing",
    decision: gatesReady ? "pass for controlled pilot" : "revise before pilot",
  };
  state.runCount = run.run;
  state.runLog = [...(Array.isArray(state.runLog) ? state.runLog : []), run].slice(-8);
  syncParticipantStep();
  saveState();
  renderAll();
}

function loadSample() {
  assignments.forEach((assignment) => assignment.fields.forEach(([key, , placeholder]) => { state[key] = placeholder; }));
  Object.assign(state, {
    businessName: "Northstar Services",
    participantName: "Avery Lee",
    teamSize: "14",
    budget: "$250/month",
    workflowLane: "Revenue Response and Client Conversion",
    workflowName: "Lead follow-up drafting",
    selectedTaxonomyLane: "Revenue Response and Client Conversion",
    selectedTaxonomyWorkflow: "Lead follow-up drafting",
  });
  syncParticipantStep();
  saveState();
  syncInputValues();
  renderAll();
}

function renderAll() {
  renderDashboard();
  renderAssignmentTabs();
  renderAssignmentForm();
  renderWorkflowCard();
  renderTestingPlan();
  renderBuilderTabs();
  renderBuilder();
  renderTestRunner();
  renderOutcomes();
  if (window.lucide) window.lucide.createIcons();
}

async function init() {
  await loadTaxonomyData();
  renderNav();
  bindGlobalInputs();
  renderAll();
  document.getElementById("continueParticipantBtn").addEventListener("click", continueParticipant);
  document.getElementById("guideNextBtn").addEventListener("click", continueParticipant);
  document.getElementById("loadSampleBtn").addEventListener("click", loadSample);
  document.getElementById("resetBtn").addEventListener("click", () => {
    localStorage.removeItem("verizonPlatformState");
    Object.keys(state).forEach((key) => delete state[key]);
    Object.assign(state, initialState);
    syncInputValues();
    renderAll();
  });
  document.getElementById("generatePlanBtn").addEventListener("click", () => {
    document.querySelector('[data-view="plan"]').click();
  });
  document.getElementById("copyPlanBtn").addEventListener("click", async () => {
    await navigator.clipboard.writeText(planText());
  });
  document.getElementById("downloadPlanBtn").addEventListener("click", () => {
    downloadText("sandbox-testing-plan.txt", planText());
  });
  document.getElementById("runTestBtn").addEventListener("click", () => {
    runSandboxTest();
  });
}

init();
