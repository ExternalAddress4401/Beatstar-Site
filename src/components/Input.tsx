import styles from "./Input.module.scss";

interface InputProps {
  label: string;
  value?: string | number;
}

export default function Input({ label, value }: InputProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input className={styles.input} value={value}></input>
    </div>
  );
}
