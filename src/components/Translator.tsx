import { useCallback, useState } from "react";
import { MooCodec } from "../lib/MooCodec";
import { CopyButton } from "./CopyButton";
import styles from "./Translator.module.css";

type Mode = "encode" | "decode";

export function Translator() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");

  let output = "";
  let error = "";

  if (input.trim()) {
    try {
      output = mode === "encode"
        ? MooCodec.encode(input)
        : MooCodec.decode(input);
    } catch (e) {
      error = e instanceof Error ? e.message : "Translation failed.";
    }
  }

  const flip = useCallback(() => {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput(output);
  }, [output]);

  const inputLabel  = mode === "encode" ? "Human Text" : "Moo Language";
  const outputLabel = mode === "encode" ? "Moo Language" : "Human Text";
  const placeholder = mode === "encode"
    ? "Type something to translate into moo…"
    : "Paste moo tokens here to decode…";

  return (
    <>
      <div className={styles.modeBar}>
        <button
          className={`${styles.modeBtn} ${mode === "encode" ? styles.active : ""}`}
          onClick={() => { setMode("encode"); setInput(""); }}
        >
          Human → Cow
        </button>
        <button
          className={`${styles.modeBtn} ${mode === "decode" ? styles.active : ""}`}
          onClick={() => { setMode("decode"); setInput(""); }}
        >
          Cow → Human
        </button>
      </div>

      <div className={styles.panels}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>{inputLabel}</span>
            <button
              className={styles.clearBtn}
              onClick={() => setInput("")}
              disabled={!input}
            >
              Clear
            </button>
          </div>
          <textarea
            className={styles.textarea}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            spellCheck={mode === "encode"}
            autoFocus
          />
        </section>

        <div className={styles.controls}>
          <button
            className={styles.flipBtn}
            onClick={flip}
            title="Swap — use output as new input"
          >
            &#8644;
          </button>
        </div>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>{outputLabel}</span>
            <CopyButton text={output} />
          </div>
          <div className={`${styles.output} ${error ? styles.outputError : ""}`}>
            {error
              ? <span className={styles.errorText}>{error}</span>
              : output || <span className={styles.placeholder}>{outputLabel} will appear here…</span>
            }
          </div>
        </section>
      </div>
    </>
  );
}
