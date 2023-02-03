import styles from "./Tabs.module.scss";

interface TabProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function Tabs({ options, selected, onSelect }: TabProps) {
  return (
    <div className={styles.tabs}>
      {options.map((el) => (
        <span
          key={el}
          className={el === selected ? styles.selected : ""}
          onClick={() => onSelect(el)}
        >
          {el}
        </span>
      ))}
    </div>
  );
}
