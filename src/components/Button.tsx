import styles from "./Button.module.scss";
import cn from "classnames";
import UnderlineText from "./UnderlineText";

interface ButtonProps {
  label: string;
  startIcon?: "upload";
  endIcon?: "circle-question" | "check" | "x" | "none";
  onClick: () => void;
}

export default function Button({
  label,
  startIcon,
  endIcon,
  onClick,
}: ButtonProps) {
  const classes = ["single", "double", "triple"];

  let childrenCount = 0;
  if (startIcon) {
    childrenCount++;
  }
  if (endIcon) {
    childrenCount++;
  }
  return (
    <div className={styles.button} onClick={onClick}>
      <div className={styles[classes[childrenCount]]}>
        {startIcon && (
          <i className={cn(`fa-solid fa-${startIcon}`, styles.icon)}></i>
        )}
        <UnderlineText text={label} />
        {endIcon && <i className={`fa-solid fa-${endIcon}`}></i>}
      </div>
    </div>
  );
}
