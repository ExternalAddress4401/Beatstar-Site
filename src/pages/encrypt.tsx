import styles from "./encrypt.module.scss";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { getRandomBetween } from "../utils/getRandomBetween";
import { useState } from "react";
import FileUploadButton from "../components/FileUploadButton";

interface UploadProps {
  name: string;
  data: any;
}

export default function Encrypt() {
  const [chart, setChart] = useState<UploadProps | null>(null);
  const [id, setId] = useState(getRandomBetween(2000, 10000));

  return (
    <div className={styles.content}>
      <div className={styles.group}>
        <Input label="Title" />
        <Input label="Artist" />
        <Input label="ID" value={id} />
        <Select label="Difficulty" />
      </div>

      <div className={styles.group}>
        <FileUploadButton label="Chart" onUpload={() => null} />
        <Button label="Audio" />
        <Button label="Artwork" />
      </div>
    </div>
  );
}
