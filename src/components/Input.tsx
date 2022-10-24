import React from "react";
import styles from "./Input.module.scss";

interface InputProps {
  label: string;
  type: "text" | "number";
  value?: string | number;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
}

export default function Input({ label, type, value, onChange }: InputProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        className={styles.input}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
