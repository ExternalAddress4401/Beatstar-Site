import CodeText from "../../components/CodeText";
import styles from "./help.module.scss";

export default function Perfects() {
  return (
    <div className={styles.content}>
      <h2>How do I change the perfect sizes of a chart?</h2>
      <p>
        As you progress through a song the perfect+ timings become stricter
        making it more difficult to hit a perfect+.
      </p>
      <p>
        You can change how strict a chart is using Moonscraper events such as{" "}
        <CodeText text="p036" /> which sets the multiplier to 0.36.
      </p>
      <p>Happier (normal) uses the following: </p>
      <div className={styles.grid}>
        <div>Stage 1:</div>
        <div>
          <CodeText text="p1" />
        </div>
        <div>Stage 2:</div>
        <div>
          <CodeText text="p090" />
        </div>
        <div>Stage 3:</div>
        <div>
          <CodeText text="p080" />
        </div>
        <div>Stage 4:</div>
        <div>
          <CodeText text="p070" />
        </div>
        <div>Stage 5:</div>
        <div>
          <CodeText text="p060" />
        </div>
      </div>
      <p>American Idiot (hard) uses the following: </p>
      <div className={styles.grid}>
        <div>Stage 1:</div>
        <div>
          <CodeText text="p090" />
        </div>
        <div>Stage 2:</div>
        <div>
          <CodeText text="p080" />
        </div>
        <div>Stage 3:</div>
        <div>
          <CodeText text="p070" />
        </div>
        <div>Stage 4:</div>
        <div>
          <CodeText text="p060" />
        </div>
        <div>Stage 5:</div>
        <div>
          <CodeText text="p060" />
        </div>
      </div>
      <p>Firestarter (extreme) uses the following: </p>
      <div className={styles.grid}>
        <div>Stage 1:</div>
        <div>
          <CodeText text="p090" />
        </div>
        <div>Stage 2:</div>
        <div>
          <CodeText text="p080" />
        </div>
        <div>Stage 3:</div>
        <div>
          <CodeText text="p070" />
        </div>
        <div>Stage 4:</div>
        <div>
          <CodeText text="p060" />
        </div>
        <div>Stage 5:</div>
        <div>
          <CodeText text="p060" />
        </div>
      </div>
      <p>
        If you do not place any pefect size events in your chart the above
        values will be used based on the difficulty you've chosen.
      </p>
      <div>
        If you place at least 1 event only the events you have placed will be
        used. This means you must place an event at the beginning and anywhere
        you want the perfect size to change.
      </div>
    </div>
  );
}
