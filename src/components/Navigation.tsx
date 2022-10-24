import styles from "./Navigation.module.scss";
import Link from "next/link";

export default function Navigation() {
  return (
    <div className={styles.tabs}>
      <Link href="/">
        <img className={styles.logo} src="images/logo.png" />
      </Link>
      <Link href="/encrypt">
        <div className={styles.tab}>Encrypt</div>
      </Link>
      <Link href="/decrypt">
        <div className={styles.tab}>Decrypt</div>
      </Link>
      <Link href="/leaderboard">
        <div className={styles.tab}>Leaderboard</div>
      </Link>
      <Link href="/news">
        <div className={styles.tab}>News</div>
      </Link>
      <Link href="/cms">
        <div className={styles.tab}>CMS</div>
      </Link>
    </div>
  );
}
