import styles from "./Navigation.module.scss";
import Link from "next/link";

export default function Navigation() {
  return (
    <div className={styles.tabs}>
      <Link href="/">
        <img className={styles.logo} src="/images/logo.png" />
      </Link>
      <Link href="/encrypt">
        <div className={styles.redTab}>Encrypt</div>
      </Link>
      <Link href="/decrypt">
        <div className={styles.yellowTab}>Decrypt</div>
      </Link>
      {/*<Link href="/leaderboard">
        <div className={styles.greenTab}>Leaderboard</div>
      </Link>*/}
      <Link href="/help">
        <div className={styles.greenTab}>Help</div>
      </Link>
      <Link href="/news">
        <div className={styles.blueTab}>News</div>
      </Link>
      <Link href="/cms">
        <div className={styles.purpleTab}>CMS</div>
      </Link>
      <Link href="/songs">
        <div className={styles.orangeTab}>Songs</div>
      </Link>
    </div>
  );
}
