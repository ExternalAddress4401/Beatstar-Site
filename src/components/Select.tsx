import styles from "./Select.module.scss";

interface SelectProps {
  label: string;
}

export default function Select({ label }: SelectProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <select className={styles.select}>
        <option>Extreme</option>
        <option>Hard</option>
        <option>Normal</option>
      </select>
    </div>
  );
}
