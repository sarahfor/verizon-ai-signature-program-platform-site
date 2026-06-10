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
  workflowFitAnswers: {
    objective: "",
    systems: "",
    dataAccess: "",
    reviewer: "",
    risk: "",
    change: "",
  },
  recommendedTaxonomyWorkflow: "",
  runCount: 0,
  runLog: [],
};

const state = loadState();
let taxonomyData = { workflows: [], lanes: [], formula: "" };

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
    if (!state.selectedTaxonomyLane) {
      state.selectedTaxonomyLane = fieldValue("workflowLane") || taxonomyData.lanes?.[0]?.lane || "";
    }
    if (!state.selectedTaxonomyWorkflow) {
      const first = workflowsForLane(state.selectedTaxonomyLane)[0] || taxonomyData.workflows?.[0];
      state.selectedTaxonomyWorkflow = first?.workflow || "";
    }
    saveState();
  } catch (error) {
    console.warn("Taxonomy data unavailable", error);
    taxonomyData = { workflows: [], lanes: [], formula: "" };
  }
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

const workflowFitQuestions = [
  {
    key: "objective",
    label: "What improvement matters most?",
    options: [
      ["", "Select one"],
      ["demand", "Create more demand or marketing output"],
      ["revenue", "Respond to leads and convert customers faster"],
      ["operations", "Make internal work more repeatable"],
      ["insights", "Make decisions with better reporting or visibility"],
    ],
  },
  {
    key: "systems",
    label: "Where does the work live today?",
    options: [
      ["", "Select one"],
      ["content", "Docs, website, email, social, or marketing tools"],
      ["crm", "CRM, email, SMS, forms, or sales notes"],
      ["ops", "Project tools, shared files, SOPs, scheduling, invoices"],
      ["data", "Spreadsheets, reports, dashboards, analytics, finance data"],
      ["manual", "Mostly manual or in people's heads"],
    ],
  },
  {
    key: "dataAccess",
    label: "How easy is the information to access?",
    options: [
      ["", "Select one"],
      ["easy", "Easy: organized and easy to find"],
      ["some", "Somewhat easy: exists but takes time"],
      ["hard", "Difficult: spread across tools or people"],
      ["head", "Mostly in someone's head"],
    ],
  },
  {
    key: "reviewer",
    label: "Who can review AI output?",
    options: [
      ["", "Select one"],
      ["named", "Named owner or department lead"],
      ["team", "Customer-facing or operations team member"],
      ["external", "External advisor or consultant"],
      ["none", "No reviewer identified yet"],
    ],
  },
  {
    key: "risk",
    label: "What is the highest-risk output?",
    options: [
      ["", "Select one"],
      ["low", "Internal draft, summary, or content"],
      ["customer", "Customer-facing message or proposal"],
      ["financial", "Pricing, financial, private, or contractual info"],
      ["regulated", "Legal, medical, hiring, safety, or autonomous decisioning"],
    ],
  },
  {
    key: "change",
    label: "How much team behavior must change?",
    options: [
      ["", "Select one"],
      ["little", "Very little"],
      ["some", "Some habits or steps"],
      ["several", "Several roles, handoffs, or tools"],
      ["major", "Major change across the team"],
    ],
  },
];

function priorityBand(score) {
  if (score >= 80) return "Default first-cohort";
  if (score >= 65) return "Selective first-cohort";
  if (score >= 50) return "Clinic / later cohort";
  return "Exclude by default";
}

function laneFromAnswers(answers = state.workflowFitAnswers || {}) {
  const objectiveMap = {
    demand: "Growth, Content, and Demand",
    revenue: "Revenue Response and Client Conversion",
    operations: "Operations and Process Reliability",
    insights: "Insights and Decision Support",
  };
  const systemMap = {
    content: "Growth, Content, and Demand",
    crm: "Revenue Response and Client Conversion",
    ops: "Operations and Process Reliability",
    data: "Insights and Decision Support",
  };
  return objectiveMap[answers.objective] || systemMap[answers.systems] || state.selectedTaxonomyLane || "";
}

function fitPenalty(item, answers = state.workflowFitAnswers || {}) {
  let penalty = 0;
  if (answers.dataAccess === "hard") penalty += item.readiness < 3.5 ? 8 : 3;
  if (answers.dataAccess === "head") penalty += item.readiness < 4 ? 14 : 6;
  if (answers.reviewer === "none") penalty += item.risk >= 3 ? 18 : 8;
  if (answers.risk === "customer") penalty += item.risk >= 3.5 ? 10 : 0;
  if (answers.risk === "financial") penalty += item.risk >= 3 ? 16 : 6;
  if (answers.risk === "regulated") penalty += 40;
  if (answers.change === "several") penalty += item.complexity >= 3 ? 10 : 3;
  if (answers.change === "major") penalty += item.complexity >= 2.5 ? 18 : 8;
  if (answers.systems === "manual") penalty += item.complexity >= 3 ? 12 : 4;
  return penalty;
}

function workflowFitScore(item, answers = state.workflowFitAnswers || {}) {
  const targetLane = laneFromAnswers(answers);
  let boost = item.lane === targetLane ? 12 : 0;
  if (answers.dataAccess === "easy" && item.readiness >= 4) boost += 4;
  if (answers.reviewer && answers.reviewer !== "none" && item.risk <= 2.5) boost += 3;
  if (answers.change === "little" && item.complexity <= 2) boost += 4;
  if (answers.systems === "crm" && /CRM|email|SMS|forms/i.test(item.baseline + " " + item.stack)) boost += 4;
  if (answers.systems === "content" && /CMS|email|social|Canva|Shopify|website/i.test(item.baseline + " " + item.stack)) boost += 4;
  if (answers.systems === "ops" && /project|shared|SOP|invoice|scheduling|docs/i.test(item.baseline + " " + item.workflow)) boost += 4;
  if (answers.systems === "data" && /spreadsheet|dashboard|analytics|report|finance/i.test(item.baseline + " " + item.workflow)) boost += 4;
  return Math.min(100, Math.max(0, Math.round(item.score + boost - fitPenalty(item, answers))));
}

function workflowFitRecommendation() {
  const answers = state.workflowFitAnswers || {};
  if (!Object.values(answers).some(Boolean)) return null;
  return taxonomyData.workflows
    .filter((item) => item.lane !== "OUT OF SCOPE")
    .map((item) => ({ ...item, fitScore: workflowFitScore(item, answers) }))
    .sort((a, b) => b.fitScore - a.fitScore || b.score - a.score || a.complexity - b.complexity)[0];
}

function assignmentExplainerFor(item = selectedTaxonomyWorkflow()) {
  if (!item) return [];
  return [
    ["Workflow Brief", `Define the exact ${item.workflow} process, owner, reviewer, input, output, and baseline metric. This keeps the pilot focused on one workflow instead of a broad AI idea.`],
    ["Data Boundary", `List the systems and source material that support this workflow: ${item.baseline}. Also name what is off-limits before sandbox testing.`],
    ["Test Packet", `Build three messy scenarios from the pain pattern: ${item.pain}. Include edge cases and stop conditions.`],
    ["Assistant", `Turn the representative AI use into instructions: ${item.useCases}. The assistant should support the work, not make final decisions.`],
    ["Review Rubric", `Use these guardrails as the first review standard: ${item.guardrails}. Add accuracy, completeness, tone, and escalation checks.`],
    ["Risk Controls", `Score risk at ${item.risk}/5 and complexity at ${item.complexity}/5. If the output touches customers, pricing, private data, or compliance, require human approval.`],
    ["Pilot Launch", `Measure value with: ${item.kpis}. Keep the pilot small enough to run within normal SMB capacity.`],
  ];
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
  bindGlobalInputs();
  renderAll();
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
  const fitTest = document.getElementById("workflowFitTest");
  const explainer = document.getElementById("assignmentExplainer");
  const detail = document.getElementById("taxonomyDetail");
  const shortlist = document.getElementById("taxonomyShortlist");
  const band = document.getElementById("taxonomyBand");
  if (!laneSelect || !workflowSelect || !detail || !shortlist || !band) return;

  if (!taxonomyData.workflows.length) {
    band.textContent = "Unavailable";
    if (fitTest) fitTest.innerHTML = "";
    if (explainer) explainer.innerHTML = "";
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
  renderWorkflowFitTest(fitTest);
  renderAssignmentExplainer(explainer, item);
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

function renderWorkflowFitTest(container) {
  if (!container) return;
  const recommendation = workflowFitRecommendation();
  const answers = state.workflowFitAnswers || {};
  const answered = Object.values(answers).filter(Boolean).length;
  container.innerHTML = `
    <div class="fit-test-head">
      <div>
        <span>Workflow Fit Test</span>
        <strong>Answer six questions to get a recommended workflow.</strong>
      </div>
      <div class="fit-test-status">${answered}/${workflowFitQuestions.length} answered</div>
    </div>
    <div class="fit-test-grid">
      ${workflowFitQuestions.map((question) => `
        <label>${escapeHtml(question.label)}
          <select data-fit-question="${escapeHtml(question.key)}">
            ${question.options.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("")}
          </select>
        </label>
      `).join("")}
    </div>
    <div class="fit-result ${recommendation ? "" : "empty"}">
      ${recommendation ? `
        <div>
          <span>Recommended workflow</span>
          <strong>${escapeHtml(recommendation.workflow)}</strong>
          <p>${escapeHtml(recommendation.lane)} · Fit ${recommendation.fitScore} · Taxonomy ${recommendation.score}</p>
        </div>
        <button id="useRecommendationBtn" class="icon-btn" type="button"><i data-lucide="sparkles"></i><span>Use Recommendation</span></button>
      ` : `
        <div>
          <span>Recommended workflow</span>
          <strong>Complete the test to generate a recommendation.</strong>
          <p>The test uses lane fit, data access, review capacity, risk, and change burden on top of the Week 3 taxonomy score.</p>
        </div>
      `}
    </div>
  `;
  container.querySelectorAll("[data-fit-question]").forEach((select) => {
    select.value = answers[select.dataset.fitQuestion] || "";
    select.onchange = (event) => {
      state.workflowFitAnswers = { ...(state.workflowFitAnswers || {}), [event.target.dataset.fitQuestion]: event.target.value };
      const next = workflowFitRecommendation();
      if (next) {
        state.recommendedTaxonomyWorkflow = next.workflow;
        state.selectedTaxonomyLane = next.lane;
        state.selectedTaxonomyWorkflow = next.workflow;
      }
      saveState();
      renderAll();
    };
  });
  const useButton = document.getElementById("useRecommendationBtn");
  if (useButton && recommendation) {
    useButton.onclick = () => applyTaxonomyWorkflow(recommendation);
  }
}

function renderAssignmentExplainer(container, item) {
  if (!container || !item) return;
  const explainers = assignmentExplainerFor(item);
  container.innerHTML = `
    <div class="assignment-explainer-head">
      <span>Assignment Explainer</span>
      <strong>What this participant needs to complete for ${escapeHtml(item.workflow)}</strong>
    </div>
    <div class="assignment-explainer-grid">
      ${explainers.map(([title, body]) => `
        <div class="assignment-explainer-item">
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(body)}</p>
        </div>
      `).join("")}
    </div>
  `;
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
  const taxonomyItem = selectedTaxonomyWorkflow();
  const explainer = assignmentExplainerFor(taxonomyItem).find(([title]) => assignment.label.includes(title) || title.includes(assignment.label));
  const wrap = document.getElementById("assignmentForm");
  wrap.innerHTML = "";
  const section = document.createElement("section");
  section.className = "form-section";
  section.innerHTML = `<h3>${assignment.title}<span>${progress.count}/${progress.total} complete</span></h3>`;
  if (explainer) {
    const explain = document.createElement("div");
    explain.className = "inline-assignment-explainer";
    explain.innerHTML = `<strong>${escapeHtml(explainer[0])}</strong><p>${escapeHtml(explainer[1])}</p>`;
    section.appendChild(explain);
  }
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
  bindGlobalInputs();
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
    bindGlobalInputs();
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
