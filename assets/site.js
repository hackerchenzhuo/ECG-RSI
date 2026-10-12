"use strict";

(() => {
  const demo = document.getElementById("ecg-demo");
  if (!demo) return;

  const duration = 18000;
  const stepDuration = 3000;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const byId = id => document.getElementById(id);
  const ui = {
    title: byId("demo-title"), count: byId("phase-count"), caption: byId("phase-caption"),
    wave: byId("edited-wave"), comparison: byId("wave-comparison"), nextBatch: byId("next-batch"),
    region: byId("pr-region"), prBracket: byId("pr-bracket"), prLabel: byId("pr-label"),
    rrBracket: byId("rr-bracket"), rrLabel: byId("rr-label"), scan: byId("scan-line"),
    target: byId("target-check"), protect: byId("protect-check"), answer: byId("answer-check"),
    construction: byId("construction-feedback"), admission: byId("admission-label"),
    examplePacket: byId("example-packet"), feedbackPacket: byId("feedback-packet"),
    operator: byId("operator-rule"), recipe: byId("prompt-rule"), sampling: byId("sampling-rule"),
    operatorValue: byId("operator-value"), recipeValue: byId("prompt-value"), samplingValue: byId("sampling-value"),
    agent: byId("agent-state"), version: byId("agent-version"), student: byId("student-status"),
    learnerReturn: demo.querySelector(".learner-return"), branches: [...demo.querySelectorAll(".branch-node")],
    pairCards: [0, 1, 2].map(i => byId(`candidate-${i}`)),
    play: byId("play-toggle"), steps: [...demo.querySelectorAll("[data-step-to]")],
    progress: byId("animation-progress"), progressBar: demo.querySelector("[role=progressbar]")
  };
  const titles = [
    "Edit the waveform.", "Repair the construction rule.", "Admit verified supervision.",
    "Propose three interventions.", "Compare, then retain.", "Generate contrasting examples."
  ];
  const captions = [
    "A requested PR contrast changes the waveform.",
    "Construction feedback repairs the operator while preserving R–R.",
    "Waveform and answer checks admit the example for training.",
    "Learner errors propose A / B / C from the same parent.",
    "A separate selection set chooses which recipe to retain.",
    "The retained recipe produces a different next batch."
  ];
  const studentLabels = [
    "Current learner", "Current learner", "Verified examples → SFT",
    "Diagnose · propose A/B/C", "Same parent · separate selection", "Retained recipe → next batch"
  ];
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { const p = clamp(x); return p * p * (3 - 2 * p); };
  let position = reducedMotion.matches ? duration - 1 : 0;
  let playing = !reducedMotion.matches;
  let lastTick = null;
  let request = null;

  // Symbolic ECG geometry: the P wave moves while QRS/T shapes remain intact.
  // R–R drift in the first attempt is repaired through TP compensation.
  function waveform(pr, rr) {
    const y = 213;
    const parts = [`M22 ${y}`];
    for (let i = 0; i < 3; i += 1) {
      const r = 154 + i * rr;
      const p = r - pr;
      parts.push(
        `L${p - 16} ${y}`,
        `C${p - 10} ${y} ${p - 11} ${y - 12} ${p - 2} ${y - 14}`,
        `C${p + 6} ${y - 16} ${p + 12} ${y} ${p + 16} ${y}`,
        `L${r - 12} ${y} L${r - 7} ${y + 10} L${r} ${y - 48} L${r + 6} ${y + 20} L${r + 13} ${y}`,
        `L${r + 30} ${y} C${r + 44} ${y} ${r + 47} ${y - 22} ${r + 61} ${y - 24}`,
        `C${r + 77} ${y - 25} ${r + 87} ${y} ${r + 96} ${y}`
      );
    }
    return parts.join(" ");
  }

  function check(node, status) {
    node.classList.toggle("pass", status === "pass");
    node.classList.toggle("fail", status === "fail");
    node.querySelector("i").textContent = status === "pass" ? "✓" : status === "fail" ? "×" : "·";
  }

  function render(time) {
    position = ((time % duration) + duration) % duration;
    const step = Math.floor(position / stepDuration);
    const p = (position % stepDuration) / stepDuration;
    const stretch = step === 0 ? ease((p - 0.12) / 0.65) : 1;
    const repair = step === 1 ? ease((p - 0.1) / 0.64) : step > 1 ? 1 : 0;
    const pr = 46 + 46 * stretch;
    const rr = 210 + 26 * stretch * (1 - repair);
    const operatorChanged = step > 1 || (step === 1 && p > 0.23);
    const selected = step > 4 || (step === 4 && p > 0.62);
    const recipeChanged = step > 4 || (step === 4 && p > 0.8);
    const targetReady = step > 0 || p > 0.77;
    const protectedReady = step > 1 || (step === 1 && p > 0.76);
    const answerReady = step > 2 || (step === 2 && p > 0.4);
    const nextOpacity = step === 5 ? ease(p / 0.19) : 0;

    demo.dataset.step = String(step);
    ui.title.textContent = titles[step];
    ui.count.textContent = `${String(step + 1).padStart(2, "0")} / 06`;
    ui.caption.textContent = captions[step];
    ui.student.textContent = studentLabels[step];
    ui.wave.setAttribute("d", waveform(pr, rr));
    const prStart = 154 - pr - 16;
    ui.region.setAttribute("x", prStart.toFixed(3));
    ui.region.setAttribute("width", (142 - prStart).toFixed(3));
    ui.prBracket.setAttribute("d", `M${prStart} 251v7H142v-7`);
    ui.prLabel.setAttribute("x", ((prStart + 142) / 2).toFixed(3));
    ui.prLabel.textContent = stretch > 0.5 ? "Longer PR" : "PR";
    ui.rrBracket.setAttribute("d", `M154 163v-9H${154 + rr}v9`);
    ui.rrLabel.setAttribute("x", (154 + rr / 2).toFixed(3));
    ui.rrLabel.textContent = rr > 214 ? "R–R drift" : "R–R fixed";
    ui.rrLabel.style.fill = rr > 214 ? "var(--warn)" : "var(--muted)";
    ui.rrBracket.style.stroke = rr > 214 ? "var(--warn)" : "#8399a7";
    ui.comparison.style.opacity = String(1 - nextOpacity);
    ui.nextBatch.style.opacity = String(nextOpacity);
    ui.pairCards.forEach((card, i) => {
      card.style.opacity = String(step === 5 ? ease((p - i * 0.16) / 0.24) : 1);
    });
    ui.scan.setAttribute("x1", String(24 + 666 * clamp(p / 0.7)));
    ui.scan.setAttribute("x2", String(24 + 666 * clamp(p / 0.7)));
    ui.scan.style.opacity = step === 2 && p < 0.72 ? "0.8" : "0";

    check(ui.target, targetReady ? "pass" : "pending");
    check(ui.protect, protectedReady ? "pass" : targetReady ? "fail" : "pending");
    check(ui.answer, answerReady ? "pass" : "pending");
    ui.construction.classList.toggle("active", step === 1);
    ui.admission.textContent = answerReady ? "Verified Q/A" : "Candidate Q/A";
    ui.examplePacket.style.opacity = step === 2 && p > 0.43 ? "1" : "0";
    ui.examplePacket.setAttribute("cx", String(293 * ease((p - 0.43) / 0.46)));

    ui.operator.classList.toggle("changed", operatorChanged);
    ui.recipe.classList.toggle("changed", recipeChanged);
    ui.sampling.classList.toggle("changed", recipeChanged);
    ui.operatorValue.textContent = operatorChanged ? "PQ stretch + TP fix" : "Stretch PQ";
    ui.recipeValue.textContent = recipeChanged ? "Contrast pairs" : "Direct practice";
    ui.samplingValue.textContent = recipeChanged ? "Confusion pairs" : "Weak categories";
    ui.version.textContent = recipeChanged ? "Retained" : step === 3 || step === 4 ? "Proposing" : operatorChanged ? "Repaired" : "Current";
    ui.agent.classList.toggle("updated", recipeChanged);
    ui.branches.forEach((node, i) => {
      node.classList.toggle("active", (step === 3 && p > i / 3) || (step === 4 && !selected));
      node.classList.toggle("selected", selected && i === 1);
    });
    ui.learnerReturn.classList.toggle("active", step === 3 || step === 4 || step === 5);
    const travel = step === 3 ? ease(p) : step === 4 ? ease((p - 0.4) / 0.4) : 1;
    // Cubic return path from learner to generator; position is deterministic.
    const a = 1 - travel;
    const packetX = a*a*a*3 + 3*a*a*travel*44 + 3*a*travel*travel*44 + travel*travel*travel*3;
    const packetY = a*a*a*186 + 3*a*a*travel*186 + 3*a*travel*travel*18 + travel*travel*travel*18;
    ui.feedbackPacket.setAttribute("cx", packetX.toFixed(3));
    ui.feedbackPacket.setAttribute("cy", packetY.toFixed(3));
    ui.feedbackPacket.style.opacity = step === 3 || step === 4 ? "1" : "0";
    ui.steps.forEach((button, i) => {
      if (i === step) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    ui.progress.style.width = `${(position / duration) * 100}%`;
    ui.progressBar.setAttribute("aria-valuenow", String(Math.round((position / duration) * 100)));
    return { milliseconds: position, step, operatorChanged, selected, recipeChanged, pr, rr };
  }

  function syncPlayButton() {
    ui.play.textContent = playing ? "Pause" : "Play";
    ui.play.setAttribute("aria-label", playing ? "Pause animation" : "Play animation");
  }
  function tick(now) {
    request = null;
    if (!playing) return;
    if (lastTick !== null && !document.hidden) render(position + now - lastTick);
    lastTick = now;
    request = window.requestAnimationFrame(tick);
  }
  function pause() {
    playing = false;
    lastTick = null;
    if (request !== null) window.cancelAnimationFrame(request);
    request = null;
    syncPlayButton();
  }
  function play() {
    if (playing && request !== null) return;
    playing = true;
    lastTick = null;
    syncPlayButton();
    request = window.requestAnimationFrame(tick);
  }
  function seek(milliseconds) {
    pause();
    return render(Number.isFinite(Number(milliseconds)) ? Number(milliseconds) : 0);
  }
  function goToStep(step) {
    const index = ((step % 6) + 6) % 6;
    seek(index * stepDuration + stepDuration * 0.9);
  }
  ui.play.addEventListener("click", () => playing ? pause() : play());
  byId("previous-step").addEventListener("click", () => goToStep(Math.floor(position / stepDuration) - 1));
  byId("next-step").addEventListener("click", () => goToStep(Math.floor(position / stepDuration) + 1));
  ui.steps.forEach(button => button.addEventListener("click", () => goToStep(Number(button.dataset.stepTo))));
  document.addEventListener("visibilitychange", () => { lastTick = null; });
  reducedMotion.addEventListener("change", event => {
    if (event.matches) seek(duration - 1);
  });
  // Deterministic frame capture for the accompanying project animation.
  window.ecgEvolution = Object.freeze({ duration, seek, play, pause, getTime: () => position });
  render(position);
  syncPlayButton();
  if (playing) play();
})();

const copyButton = document.querySelector("[data-copy]");
if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const citation = document.getElementById(copyButton.dataset.copy);
    const status = document.getElementById("copy-status");
    if (!citation || !status) return;
    try {
      await navigator.clipboard.writeText(citation.textContent);
      status.textContent = "BibTeX copied.";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(citation);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = "Citation selected. Press Ctrl+C or Command+C to copy.";
    }
  });
}
