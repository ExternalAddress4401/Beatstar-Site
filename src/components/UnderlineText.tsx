import styles from "./UnderlineText.module.scss";

interface UnderlineTextProps {
  text: string;
}

export default function UnderlineText({ text }: UnderlineTextProps) {
  return <div className={styles.text}>{text}</div>;
}
