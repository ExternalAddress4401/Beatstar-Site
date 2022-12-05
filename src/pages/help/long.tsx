import CodeText from "../../components/CodeText";
import styles from "./help.module.scss";

export default function Long() {
  return (
    <div className={styles.content}>
      <h2>Why can't I place notes next to long notes?</h2>
      <p>
        To enable Extended Sustains press the <CodeText text="E" /> key on your
        keyboard.
      </p>
    </div>
  );
}
