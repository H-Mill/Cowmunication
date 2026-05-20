import mooUrl from "../assets/moo.mp3";
import styles from "./CowLogo.module.css";

let audioCtx: AudioContext | null = null;
let bufferPromise: Promise<AudioBuffer> | null = null;

async function playMoo() {
  audioCtx ??= new AudioContext();
  if (audioCtx.state === "suspended") await audioCtx.resume();

  bufferPromise ??= fetch(mooUrl)
    .then((r) => r.arrayBuffer())
    .then((b) => audioCtx!.decodeAudioData(b));
  const buffer = await bufferPromise;

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  // Randomize pitch (and speed) each click so every moo sounds a little different.
  source.playbackRate.value = 0.7 + Math.random() * 0.9;

  const gain = audioCtx.createGain();
  gain.gain.value = 0.25;

  source.connect(gain);
  gain.connect(audioCtx.destination);
  source.start();
}

export function CowLogo() {
  return (
    <button
      type="button"
      className={styles.btn}
      onClick={() => void playMoo()}
      aria-label="Moo!"
      title="Moo!"
    >
    <svg
      className={styles.cow}
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ears */}
      <ellipse cx="13" cy="24" rx="8" ry="5" className={styles.ear} transform="rotate(-25 13 24)" />
      <ellipse cx="51" cy="24" rx="8" ry="5" className={styles.ear} transform="rotate(25 51 24)" />
      {/* horns */}
      <path d="M20 14 q-4 -6 -9 -5 q4 3 5 8 z" className={styles.horn} />
      <path d="M44 14 q4 -6 9 -5 q-4 3 -5 8 z" className={styles.horn} />
      {/* head */}
      <ellipse cx="32" cy="33" rx="20" ry="18" className={styles.head} />
      {/* spot */}
      <path d="M40 18 q9 1 8 9 q-6 3 -10 -2 q-2 -5 2 -7 z" className={styles.spotMark} />
      {/* muzzle */}
      <ellipse cx="32" cy="44" rx="13" ry="9" className={styles.muzzle} />
      <ellipse cx="27" cy="45" rx="2.1" ry="2.6" className={styles.nostril} />
      <ellipse cx="37" cy="45" rx="2.1" ry="2.6" className={styles.nostril} />
      {/* eyes */}
      <circle cx="24" cy="29" r="3.2" className={styles.eye} />
      <circle cx="40" cy="29" r="3.2" className={styles.eye} />
    </svg>
    </button>
  );
}
