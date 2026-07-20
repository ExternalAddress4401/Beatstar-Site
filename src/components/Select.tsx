import styles from "./Select.module.scss";

interface SelectProps {
  label: string;
  defaultValue?: string;
  options?: string[];
  onChange: (e) => void;
}

export default function Select({
  label,
  defaultValue,
  options,
  onChange,
}: SelectProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <select
        className={styles.select}
        name={label.toLowerCase()}
        onChange={onChange}
        defaultValue={defaultValue}
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
