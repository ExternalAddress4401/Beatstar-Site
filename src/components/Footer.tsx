import cn from "classnames";
import styles from "./Footer.module.scss";

interface FooterProps {
  errors: string | string[];
  onClose: () => void;
}

export default function Footer({ errors, onClose }: FooterProps) {
  if (!errors) {
    return;
  }
  if (!Array.isArray(errors)) {
    errors = [errors];
  }
  return (
    <div className={styles.footer}>
      <div className={styles.content}>
        <i className={cn("fa-solid fa-x", styles.icon)} onClick={onClose}></i>
        {errors}
      </div>
    </div>
  );
}
