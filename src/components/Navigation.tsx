import styles from "./Navigation.module.scss";
import Link from "next/link";
import { useWindowSize } from "../hooks/useWindowSize";
import { useState } from "react";

export default function Navigation() {
  const { screen } = useWindowSize();
  const [expanded, setExpanded] = useState(false);

  if (screen === "mobile") {
    return (
      <div>
        <div className={styles.tabsMobile}>
          <Link href="/">
            <img className={styles.logo} src="/images/logo.png" />
          </Link>
          <div className={styles.center} onClick={() => setExpanded(!expanded)}>
            <i className="fa-solid fa-bars fa-xl"></i>
          </div>
        </div>
        {expanded && (
          <div className={styles.expanded} onClick={() => setExpanded(false)}>
            <Link href="/encrypt">
              <div className={styles.redTab}>Encrypt</div>
            </Link>
            <Link href="/decrypt">
              <div className={styles.yellowTab}>Decrypt</div>
            </Link>
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
        )}
      </div>
    );
  } else {
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
}
