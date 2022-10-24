import styles from "./TextArea.module.scss";

interface TextAreaProps {
  text: string;
}

export default function TextArea({ text }: TextAreaProps) {
  return (
    <div className={styles.container}>
      <textarea className={styles.textArea} value={text} disabled={true} />
    </div>
  );
}
