import CodeText from "../../components/CodeText";
import Image from "next/image";
import styles from "./help.module.scss";

export default function Sections() {
  return (
    <div className={styles.content}>
      <h2>How do I add sections?</h2>
      <p>
        To add a section use the section tool in Moonscraper and place it where
        you would like a section.
      </p>
      <p>
        The names of the sections do not matter. You may wish to leave them as{" "}
        <CodeText text="Default" /> or name them something more descriptive like{" "}
        <CodeText text="stage 1" />.
      </p>
      <Image src="/images/sections.png" width="270px" height="525px" />
    </div>
  );
}
