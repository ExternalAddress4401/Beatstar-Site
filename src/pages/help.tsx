import Link from "next/link";
import styles from "./help.module.scss";

export default function Help() {
  return (
    <div className={styles.content}>
      <h2>Help</h2>
      <Link href="/help/speeds">
        <a className={styles.link}>How do I change the speed of a chart?</a>
      </Link>
      <Link href="/help/perfects">
        <a className={styles.link}>
          How do I change the perfect sizes of a chart?
        </a>
      </Link>
      <Link href="/help/long">
        <a className={styles.link}>
          Why can't I place notes next to long notes?
        </a>
      </Link>
      <Link href="/help/sections">
        <a className={styles.link}>How do I add sections?</a>
      </Link>
      <Link href="/help/swipes">
        <a className={styles.link}>How do I add swipes?</a>
      </Link>
      <Link href="/help/extract-chart">
        <a className={styles.link}>
          Can I get my chart back after encrypting it?
        </a>
      </Link>
      <Link href="/help/perfect-bar">
        <a className={styles.link}>
          How do I change the size of the pefect bar?
        </a>
      </Link>
    </div>
  );
}
