import styles from "./encrypt.module.scss";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { getRandomBetween } from "../utils/getRandomBetween";
import { useState } from "react";
import FileUploadButton from "../components/FileUploadButton";
import { readChart } from "../lib/ChartReader";

interface UploadProps {
  name: string;
  data: any;
}

export default function Encrypt() {
  const [chart, setChart] = useState<UploadProps | null>(null);
  const [id, setId] = useState(getRandomBetween(2000, 10000));

  const openFileDialog = (type: "chart" | "audio" | "artwork") => {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = function (event) {
      const file = input.files[0];
      switch (type) {
        case "chart":
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            readChart(reader.result.toString());
          });
          reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className={styles.content}>
      <div className={styles.group}>
        <Input label="Title" />
        <Input label="Artist" />
        <Input label="ID" value={id} />
        <Select label="Difficulty" />
      </div>

      <div className={styles.group}>
        <Button label="Chart" onClick={() => openFileDialog("chart")} />
        <Button label="Audio" />
        <Button label="Artwork" />
      </div>
    </div>
  );
}
