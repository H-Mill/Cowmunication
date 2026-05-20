import { Billboard } from "./components/Billboard";
import { Translator } from "./components/Translator";
import { ThemeToggle } from "./components/ThemeToggle";
import { CowLogo } from "./components/CowLogo";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <CowLogo />
          <h1 className={styles.title}>Cowmunication</h1>
          <ThemeToggle />
        </div>
        <Billboard />
      </header>

      <main className={styles.main}>
        <Translator />
      </main>
    </div>
  );
}
