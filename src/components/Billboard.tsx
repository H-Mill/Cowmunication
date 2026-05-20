import { useState } from "react";
import { SAYINGS } from "../data/sayings";
import styles from "./Billboard.module.css";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Billboard() {
  const [shuffled] = useState(() => shuffle(SAYINGS));
  const [index, setIndex] = useState(0);

  return (
    <div className={styles.billboard}>
      <span
        key={index}
        className={styles.billboardText}
        onAnimationEnd={() => setIndex((i) => (i + 1) % shuffled.length)}
      >
        {shuffled[index]}
      </span>
    </div>
  );
}
