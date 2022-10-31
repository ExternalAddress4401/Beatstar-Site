import Button from "../components/Button";
import { ProtobufReader, ChartProto } from "@externaladdress4401/protobuf";
import { readFile } from "../utils/readFile";
import { useState } from "react";
import Footer from "../components/Footer";
import UploadProps from "../interfaces/UploadProps";
import TextArea from "../components/TextArea";
import { writeChart } from "../lib/ChartWriter";
import styles from "./decrypt.module.scss";
import { readBytes, Chart } from "../lib/ChartReader";
import axios from "axios";

export default function decrypt() {
  const [json, setJson] = useState<UploadProps | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openAudioDialog = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".bundle";
    input.onchange = async function () {
      const formData = new FormData();
      formData.append("audio", input.files[0]);

      const response = await axios.post("/api/extract-audio", formData, {
        responseType: "arraybuffer",
      });

      if (response.status === 200) {
        const element = document.createElement("a");
        const file = new Blob([response.data], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "audio.ogg";
        document.body.appendChild(element);
        element.click();
      }
    };
    input.click();
  };
  const openFileDialog = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".bytes";
    input.onchange = async function () {
      const file = input.files[0];
      const data = (await readFile(file, "arraybuffer")) as ArrayBuffer;

      try {
        const reader = new ProtobufReader(Buffer.from(data));
        reader.process();

        setJson({
          name: file.name,
          data: reader.parseProto(ChartProto),
          icon: "none",
        });
      } catch (e) {
        console.log(e);
        setError(e.message);
      }
    };
    input.click();
  };

  const onDownload = () => {
    const chart = readBytes(json.data);
    const chartString = writeChart(chart);

    const element = document.createElement("a");
    const file = new Blob([chartString], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "chart.chart";
    document.body.appendChild(element);
    element.click();
  };
  return (
    <div className={styles.container}>
      <h1>Decrypt</h1>
      {json ? (
        <div className={styles.center}>
          <TextArea text={JSON.stringify(json.data, null, 2)} />
          <Button label="Download" onClick={onDownload} />
        </div>
      ) : (
        <div className={styles.buttonContainer}>
          <Button label="Chart" onClick={openFileDialog} />
          <Button label="Audio" onClick={openAudioDialog} />
        </div>
      )}
      <Footer errors={error} />
    </div>
  );
}
