/**
 * Short celebratory fanfare (Web Audio — no MP3 file).
 * Runs after a tap (e.g. Yes) so AudioContext can start on mobile.
 */
export function playWinFanfare() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;

  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = 0.2;
  master.connect(ctx.destination);

  const schedule = () => {
    const t0 = ctx.currentTime + 0.02;
    const freqs = [523.25, 659.25, 783.99, 1046.5];

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const start = t0 + i * 0.1;
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(0.9, start + 0.03);
      g.gain.exponentialRampToValueAtTime(0.01, start + 0.38);
      osc.connect(g);
      g.connect(master);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  };

  if (ctx.state === "suspended") {
    ctx.resume().then(schedule).catch(() => {});
  } else {
    schedule();
  }
}
