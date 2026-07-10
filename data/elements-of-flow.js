// ─── FLOW SCHOOL — ELEMENTS OF FLOW (canonical checklist data) ───────────────
//
// Single source for the Elements of Flow checklist. Consumed by:
//   · elements-of-flow.html  (the standalone checker, archived from the nav)
//   · your-flows.html        (the Peak Flow checklist inside the editor)
// Edit here; both surfaces follow. 28 items total: 13 + 4 + 6 + 5.
// ─────────────────────────────────────────────────────────────────────────────

window.EOF_DATA = {

  BODY_POSITIONS: [
    { id: 'single-leg',   label: 'Single Leg',                      sub: 'Tree · Warrior 3 · Revolved Half Moon' },
    { id: 'double-same',  label: 'Double Leg, Same Direction',      sub: 'Chair · Tadasana · Wide Leg Forward Fold' },
    { id: 'diff-dir',     label: 'Double Leg, Different Direction', sub: 'Skandasana · Triangle · Warrior 2' },
    { id: 'squat',        label: 'Squat / Bent Leg',                sub: 'Chair · Skandasana · Lunge' },
    { id: 'hinge',        label: 'Hinge / Fold / Spine Flexion',    sub: 'Pyramid · Forward Fold · Triangle' },
    { id: 'straight-leg', label: 'Straight Leg',                    sub: 'Tadasana · Half Moon · Low Boat' },
    { id: 'square-hip',   label: 'Square Hip / Neutral Hip',        sub: 'Crescent Lunge · Camel · Chair' },
    { id: 'open-hip',     label: 'Open Hip / External Rotation',    sub: 'Half Moon · Warrior 2 · Extended Side Angle' },
    { id: 'twist',        label: 'Twist',                           sub: 'Revolved Chair · Dancing Anjaneyasana' },
    { id: 'lean',         label: 'Lean',                            sub: 'Wild Thing · Runner\'s Lean · Reverse Triangle' },
    { id: 'single-arm',   label: 'Single Arm',                      sub: 'Side Plank · Funky Side Plank · Gate' },
    { id: 'double-arm',   label: 'Double Arm',                      sub: 'Down Dog · Crow · Chaturanga · Handstand' },
    { id: 'backbend',     label: 'Spine Extension / Backbend',      sub: 'Bridge · Wild Thing · Up Dog' },
  ],

  // presented as the directions a flow travels; the anatomical plane rides
  // underneath (sagittal appears twice — split by direction, 4 items total)
  PLANES: [
    { id: 'sagittal-fb', label: 'Forward + Back',   sub: 'Sagittal' },
    { id: 'sagittal-ud', label: 'Up + Down',        sub: 'Sagittal' },
    { id: 'frontal',     label: 'Side to Side',     sub: 'Frontal' },
    { id: 'transverse',  label: 'Twist / Rotation', sub: 'Transverse' },
  ],

  GAIT: [
    { id: 'bent-straight', label: 'Bent → Straight',          sub: 'Do both legs alternate between bent and straight?' },
    { id: 'square-open',   label: 'Square Hip → Open Hip',    sub: 'Do your hips rotate between square and open?' },
    { id: 'arms-ud',       label: 'Arms Up → Arms Down',      sub: 'Do your arms move in multiple directions, not just up?' },
    { id: 'twist-lr',      label: 'Twist Left → Twist Right', sub: 'Does your flow twist in both directions?' },
    { id: 'back-fwd',      label: 'Backbend → Forward Fold',  sub: 'Does your spine both extend and flex?' },
    { id: 'fwd-bwd',       label: 'Forward → Backward',       sub: 'Does your flow move both forward and backward on the mat?' },
  ],

  BIG_FIVE: [
    { id: 'mobility',     label: 'Mobility',     sub: 'Joint control and strength in range of motion' },
    { id: 'stability',    label: 'Stability',    sub: 'Ability to control movement' },
    { id: 'strength',     label: 'Strength',     sub: 'Power, endurance, and exertion of effort' },
    { id: 'conditioning', label: 'Conditioning', sub: 'Rhythmic movement of the heart and lungs' },
    { id: 'flow',         label: 'Flow',         sub: 'Transitions and postures sequenced across planes' },
  ],

};
