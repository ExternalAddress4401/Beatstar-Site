import styles from "./Select.module.scss";

interface SelectProps {
  label: string;
  onChange: (e) => void;
}

export default function Select({ label, onChange }: SelectProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <select
        className={styles.select}
        name={label.toLowerCase()}
        onChange={onChange}
      >
        <option>Extreme</option>
        <option>Hard</option>
        <option>Normal</option>
      </select>
    </div>
  );
}
