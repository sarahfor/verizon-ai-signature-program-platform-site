# Participant Dashboard

Static participant dashboard for operating the Verizon AI Signature Program simulation.

Open with a local server (recommended):

```
cd "/Users/sarahforrest/Verizon Project/verizon-program-platform"
python3 -m http.server 4177
```

Then open: `http://127.0.0.1:4177`

Or open directly in your browser (file:// also works — taxonomy data is embedded as a fallback):

`/Users/sarahforrest/Verizon Project/verizon-program-platform/index.html`

## Included

- Cohort dashboard with readiness gates and artifact status
- Participant profile and workflow lane assignment
- Fillable assignment forms for workflow brief, data boundary, test packet, assistant setup, review rubric, risk controls, and pilot launch
- Generated sandbox testing plan
- Sandbox workspace for assistant, agent, automation, and review setup
- Simulated test runner
- KPI tracker and final packet builder
- Local browser persistence through `localStorage`

## Notes

Use **Load Sample** to populate a realistic participant example. The generated plan updates from the assignment fields.
