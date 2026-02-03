import useSound from "use-sound";

// Helper to determine base path
const getPath = (filename) => {
  const base = import.meta.env.BASE_URL; // This is '/' locally and '/PartyMind/' on prod
  return `${base}sounds/${filename}`;
};

export function useGameSounds() {
  const [playTick, { stop: stopTick }] = useSound(getPath("tick.mp3"), {
    volume: 0.5,
    interrupt: true,
  });
  const [playSuccess] = useSound(getPath("success.mp3"), { volume: 0.5 });
  const [playBuzzer] = useSound(getPath("buzzer.mp3"), { volume: 0.6 });
  const [playFanfare] = useSound(getPath("fanfare.mp3"), { volume: 0.5 });

  return {
    playTick,
    stopTick,
    playSuccess,
    playBuzzer,
    playFanfare,
  };
}
