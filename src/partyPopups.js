import confetti from "canvas-confetti";

const PARTY_COLORS = [
  "#a78bfa",
  "#f472b6",
  "#fbbf24",
  "#34d399",
  "#faf5ff",
  "#f9a8d4",
  "#fde047",
];

const baseBurst = {
  spread: 70,
  ticks: 220,
  gravity: 0.95,
  decay: 0.92,
  colors: PARTY_COLORS,
  disableForReducedMotion: true,
  zIndex: 200,
};

/**
 * Fire confetti bursts for a few seconds (call when final screen mounts).
 * @returns cleanup to cancel pending timers
 */
export function runCelebrationConfetti() {
  const timeouts = [];

  const burst = (opts) => {
    confetti({ ...baseBurst, ...opts });
  };

  burst({ particleCount: 120, origin: { x: 0.5, y: 0.35 } });

  timeouts.push(
    setTimeout(() => {
      burst({ particleCount: 80, origin: { x: 0.2, y: 0.55 } });
      burst({ particleCount: 80, origin: { x: 0.8, y: 0.55 } });
    }, 350),
    setTimeout(() => {
      burst({
        particleCount: 60,
        origin: { x: 0.5, y: 0.65 },
        scalar: 0.95,
      });
    }, 700),
  );

  let n = 0;
  const intervalId = setInterval(() => {
    burst({
      particleCount: 28,
      origin: {
        x: Math.random() * 0.7 + 0.15,
        y: Math.random() * 0.4 + 0.2,
      },
      startVelocity: 38,
    });
    n += 1;
    if (n >= 10) {
      clearInterval(intervalId);
    }
  }, 420);

  return () => {
    timeouts.forEach((id) => clearTimeout(id));
    clearInterval(intervalId);
  };
}
