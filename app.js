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
  runCount: 0,
  runLog: [],
};

const state = loadState();

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
  renderJourney();
  renderParticipantGuide();
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
    workflowName: "Lead follow-up and proposal drafting",
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

function init() {
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
