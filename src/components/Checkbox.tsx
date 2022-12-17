import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  label: string;
  onChange: (e) => void;
}

export default function Checkbox({ label, onChange }: CheckboxProps) {
  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        name={label.toLowerCase()}
        className={styles.checkbox}
        onChange={onChange}
      />
      <label>{label}</label>
    </div>
  );
}
