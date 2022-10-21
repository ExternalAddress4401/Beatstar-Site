import styles from "./Button.module.scss";
import cn from "classnames";

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return (
    <div className={styles.button} onClick={onClick}>
      <i className={cn("fa-solid fa-upload", styles.icon)}></i>
      {label}
    </div>
  );
}
