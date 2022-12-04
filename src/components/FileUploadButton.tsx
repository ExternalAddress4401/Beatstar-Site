import styles from "./FileUploadButton.module.scss";
import cn from "classnames";

interface ButtonProps {
  label: string;
  onUpload: () => void;
}

export default function FileUploadButton({ label }: ButtonProps) {
  const onClick = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.click();
  };
  return (
    <div className={styles.button} onClick={onClick}>
      <i className={cn("fa-solid fa-upload", styles.icon)}></i>
      {label}
    </div>
  );
}
