import { useState } from "react";
import { SAYINGS } from "../data/sayings";
import styles from "./Billboard.module.css";

export function Billboard() {
  const [index, setIndex] = useState(0);

  return (
    <div className={styles.billboard}>
      <span
        key={index}
        className={styles.billboardText}
        onAnimationEnd={() => setIndex((i) => (i + 1) % SAYINGS.length)}
      >
        {SAYINGS[index]}
      </span>
    </div>
  );
}
