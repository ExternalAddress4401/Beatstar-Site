import styles from "./encrypt.module.scss";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { getRandomBetween } from "../utils/getRandomBetween";
import { useState } from "react";
import { Chart, readChart } from "../lib/ChartReader";
import { readFile } from "../utils/readFile";
import { isPng } from "../utils/isPng";
import Footer from "../components/Footer";

interface UploadProps {
  name?: string;
  data?: Chart | ArrayBuffer;
  icon: "circle-question" | "x" | "check";
}

export default function Encrypt() {
  const [chart, setChart] = useState<UploadProps | null>({
    icon: "circle-question",
  });
  const [audio, setAudio] = useState<UploadProps | null>({
    icon: "circle-question",
  });
  const [artwork, setArtwork] = useState<UploadProps>({
    icon: "circle-question",
  });
  const [id, setId] = useState(getRandomBetween(2000, 10000));
  const [errors, setErrors] = useState<string[] | null>(null);

  const openFileDialog = (
    type: "chart" | "audio" | "artwork",
    filter: string
  ) => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = filter;
    input.onchange = async function () {
      const file = input.files[0];
      switch (type) {
        case "chart":
          const chartData = await readFile(file, "text");
          const parsedChart = readChart(chartData.toString());
          if (parsedChart.errors.length) {
            setErrors(parsedChart.errors);
            return;
          }
          setChart({
            name: file.name,
            data: readChart(chartData.toString()),
            icon: "check",
          });
          break;
        case "audio":
          const audioData = (await readFile(
            file,
            "arraybuffer"
          )) as ArrayBuffer;
          setAudio({
            name: file.name,
            data: audioData,
            icon: "check",
          });
          break;
        case "artwork":
          const artworkData = (await readFile(
            file,
            "arraybuffer"
          )) as ArrayBuffer;
          if (!isPng(new Uint8Array(artworkData))) {
            setErrors(["This isn't a PNG. Please supply a valid PNG file."]);
            setArtwork({
              icon: "x",
            });
            return;
          }
          setArtwork({
            name: file.name,
            data: artworkData,
            icon: "check",
          });
          break;
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
        <Button
          label={chart.name ? chart.name : "Chart"}
          startIcon="upload"
          endIcon={chart.icon}
          onClick={() => openFileDialog("chart", ".chart")}
        />
        <Button
          label={audio.name ? audio.name : "Audio"}
          startIcon="upload"
          endIcon={audio.icon}
          onClick={() => openFileDialog("audio", ".wem")}
        />
        <Button
          label={artwork.name ? artwork.name : "Artwork"}
          startIcon="upload"
          endIcon={artwork.icon}
          onClick={() => openFileDialog("artwork", ".png")}
        />

        <Button label="Create" />
      </div>
      <Footer errors={errors} />
    </div>
  );
}
