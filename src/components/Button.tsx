import styles from "./Button.module.scss";
import cn from "classnames";

interface ButtonProps {
  label: string;
}

export default function Button({ label }: ButtonProps) {
  return (
    <div className={styles.button}>
      <i className={cn("fa-solid fa-upload", styles.icon)}></i>
      {label}
    </div>
  );
}
