import CodeText from "../../components/CodeText";
import styles from "./help.module.scss";

export default function Speeds() {
  return (
    <div className={styles.content}>
      <h2>How do I change the speed of a chart?</h2>
      <p>To change the speed of a chart you can use events in Moonscraper.</p>
      <p>
        An example of this is <CodeText text="s036" />. This will set the speed
        to 0.36 where the event is placed.
      </p>
      <p>Happier (normal) uses the following: </p>
      <div className={styles.grid}>
        <div>Stage 1:</div>
        <div>
          <CodeText text="s080" />
        </div>
        <div>Stage 2:</div>
        <div>
          <CodeText text="s070" />
        </div>
        <div>Stage 3:</div>
        <div>
          <CodeText text="s060" />
        </div>
        <div>Stage 4:</div>
        <div>
          <CodeText text="s055" />
        </div>
        <div>Stage 5:</div>
        <div>
          <CodeText text="s050" />
        </div>
      </div>
      <p>American Idiot (hard) uses the following: </p>
      <div className={styles.grid}>
        <div>Stage 1:</div>
        <div>
          <CodeText text="s070" />
        </div>
        <div>Stage 2:</div>
        <div>
          <CodeText text="s060" />
        </div>
        <div>Stage 3:</div>
        <div>
          <CodeText text="s055" />
        </div>
        <div>Stage 4:</div>
        <div>
          <CodeText text="s050" />
        </div>
        <div>Stage 5:</div>
        <div>
          <CodeText text="s045" />
        </div>
      </div>
      <p>Firestarter (extreme) uses the following: </p>
      <div className={styles.grid}>
        <div>Stage 1:</div>
        <div>
          <CodeText text="s060" />
        </div>
        <div>Stage 2:</div>
        <div>
          <CodeText text="s055" />
        </div>
        <div>Stage 3:</div>
        <div>
          <CodeText text="s050" />
        </div>
        <div>Stage 4:</div>
        <div>
          <CodeText text="s050" />
        </div>
        <div>Stage 5:</div>
        <div>
          <CodeText text="s045" />
        </div>
      </div>
      <p>
        If you do not place any speed events in your chart the above values will
        be used based on the difficulty you've chosen.
      </p>
      <div>
        If you place at least 1 event only the events you have placed will be
        used. This means you must place an event at the beginning and anywhere
        you want the speed to change.
      </div>
    </div>
  );
}
