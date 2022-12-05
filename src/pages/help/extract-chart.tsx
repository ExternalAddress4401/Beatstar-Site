import CodeText from "../../components/CodeText";
import styles from "./help.module.scss";

export default function ExtractChart() {
  return (
    <div className={styles.content}>
      <h2>Can I get my chart back after encrypting it?</h2>
      <p>
        Yes. Upload your <CodeText text="chart.bundle" /> in the{" "}
        <CodeText text="Decrypt" /> tab and click the{" "}
        <CodeText text="Download" /> button to get a chart in a Moonscraper
        format.
      </p>
    </div>
  );
}
