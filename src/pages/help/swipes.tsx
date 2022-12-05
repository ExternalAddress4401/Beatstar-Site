import CodeText from "../../components/CodeText";
import styles from "./help.module.scss";

export default function Swipes() {
  return (
    <div className={styles.content}>
      <h2>How do I add swipes?</h2>
      <p>To add a swipe use the event tool with the relevant name.</p>
      <div className={styles.grid}>
        <div>
          <CodeText text="u1" />
        </div>
        <div>Up swipe on the left lane</div>
        <div>
          <CodeText text="d2" />
        </div>
        <div>Down swipe on the middle lane</div>
        <div>
          <CodeText text="l3" />
        </div>
        <div>Left swipe on the right lane</div>
        <div>
          <CodeText text="r1" />
        </div>
        <div>Right swipe on the left lane</div>
        <div>
          <CodeText text="u1,r2" />
        </div>
        <div>Up swipe on the left lane, right swipe on the second lane</div>
      </div>
      <p>
        You can also place 2 different events on the same note to produce the
        same effect. <CodeText text="u1" /> and <CodeText text="r2" /> placed on
        the same note will function the same as <CodeText text="u1,r2" />.
      </p>
    </div>
  );
}
