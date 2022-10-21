import styles from "./CoolInput.module.scss";
import cn from "classnames";

interface InputProps {
  type: "big" | "small";
  left: number;
  name: string;
  top: number;
  value?: string | number;
}

export default function CoolInput({
  type,
  value,
  left,
  top,
  name,
}: InputProps) {
  return (
    <div
      style={{ position: "absolute", left: left + "px", top: top + "px" }}
      className={styles.container}
    >
      <input
        className={cn(styles.input, styles[type])}
        value={value}
        name={name}
      ></input>
    </div>
  );
}
