import CodeText from "../../components/CodeText";
import styles from "./help.module.scss";
import Link from "next/link";

export default function PerfectBar() {
  return (
    <div className={styles.content}>
      <h2>How do I change the size of the perfect bar?</h2>
      <p>
        The size of the perfect bar is determined by the{" "}
        <Link href="/help/perfects">
          <a className={styles.link}>perfect size multiplier</a>
        </Link>{" "}
        at offset 0. The bigger the value the larger the perfect bar.
      </p>
      <p>
        If you would like a big perfect bar but a small multiplier you can place
        an event such as <CodeText text="p1" /> at the beginning of a chart and
        then place another event such as <CodeText text="p036" /> right after it
        to overwrite the change.
      </p>
    </div>
  );
}
