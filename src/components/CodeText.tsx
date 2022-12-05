import styles from "./CodeText.module.scss";

interface CodeTextProps {
  text: string;
}

export default function CodeText({ text }: CodeTextProps) {
  return <span className={styles.codeText}>{text}</span>;
}
