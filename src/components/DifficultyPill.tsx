import styles from "./DifficultyPill.module.scss";
import cn from "classnames";

interface DifficultyPillProps {
  left: number;
  top: number;
  type: "normal" | "hard" | "extreme";
  onChangeType: () => void;
}

export default function DifficultyPill({
  left,
  top,
  type,
  onChangeType,
}: DifficultyPillProps) {
  return (
    <div
      style={{ left: left + "px", top: top + "px" }}
      className={cn(styles.pill, styles[type])}
      onClick={onChangeType}
    >
      <div className={styles.circle}>
        <img src={`images/${type}.png`} />
      </div>
      <div className={styles.content}>{type}</div>
    </div>
  );
}
