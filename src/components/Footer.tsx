import cn from "classnames";
import { useState } from "react";
import styles from "./Footer.module.scss";

interface FooterProps {
  errors: string | string[];
  onClose: () => void;
}

export default function Footer({ errors, onClose }: FooterProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  if (!errors) {
    return;
  }
  if (!Array.isArray(errors)) {
    errors = [errors];
  }
  return (
    <div className={styles.footer}>
      <div
        className={cn(styles.content, {
          [styles.center]: !isExpanded,
          [styles.expanded]: isExpanded,
        })}
      >
        <div className={styles.buttons}>
          <i className={cn("fa-solid fa-x", styles.icon)} onClick={onClose}></i>
          {errors.length > 1 && (
            <i
              className={`fa-solid fa-chevron-${isExpanded ? "down" : "up"}`}
              onClick={() => setIsExpanded(!isExpanded)}
            ></i>
          )}
          <p>
            {errors.length} error{errors.length > 1 ? "s" : ""} found.
          </p>
        </div>
        {isExpanded
          ? errors.map((error) => (
              <p key={error} className={styles.error}>
                {error}
              </p>
            ))
          : errors[0]}
      </div>
    </div>
  );
}
