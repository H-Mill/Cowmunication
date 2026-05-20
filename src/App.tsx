import { Billboard } from "./components/Billboard";
import { Translator } from "./components/Translator";
import { ThemeToggle } from "./components/ThemeToggle";
import { CowLogo } from "./components/CowLogo";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <CowLogo />
        <div>
          <h1 className={styles.title}>Cowmunication</h1>
          <p className={styles.subtitle}>Bridging the gap between humans and cows since 2026</p>
        </div>
        <ThemeToggle />
      </header>

      <main className={styles.main}>
        <Translator />
      </main>

      <footer className={styles.footer}>
        <Billboard />
      </footer>
    </div>
  );
}
