import axios from "axios";
import { useState } from "react";
import { readChart } from "../lib/ChartReader";
import { isPng } from "../utils/isPng";
import { readFile } from "../utils/readFile";
import Button from "./Button";
import Select from "./Select";

import styles from "./SingleFilePage.module.scss";

interface SingleFilePageProps {
  onLoad: (value: boolean) => void;
}

export default function SingleFilePage({ onLoad }: SingleFilePageProps) {
  const [errors, setErrors] = useState<string[] | null>(null);
  const [difficulty, setDifficulty] = useState(1);

  const difficulties = {
    Extreme: 1,
    Hard: 3,
    Normal: 4,
  };

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
          if (file.name.endsWith(".json")) {
            onSubmitChart(file);
          } else {
            const chartData = await readFile(file, "text");
            const parsedChart = readChart(chartData.toString());
            if (parsedChart.errors.length) {
              setErrors(parsedChart.errors);
              return;
            }
            onSubmitChart(file);
          }

          break;
        case "audio":
          onSubmitAudio(file);
          break;
        case "artwork":
          const artworkData = (await readFile(
            file,
            "arraybuffer"
          )) as ArrayBuffer;
          if (!isPng(new Uint8Array(artworkData))) {
            setErrors(["This isn't a PNG. Please supply a valid PNG file."]);
            return;
          }
          onSubmitArtwork(file);
          break;
      }
    };
    input.click();
  };

  const sendFile = async (path: string, data: any) => {
    try {
      const response = await axios.post(path, data, {
        responseType: "arraybuffer",
      });
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.zip");
        document.body.appendChild(link);
        link.click();
      }
    } catch (e) {
      const error: any = JSON.parse(Buffer.from(e.response.data) as any).errors;
      setErrors(error);
    }
  };

  const onSubmitArtwork = async (file: File) => {
    const formData = new FormData();
    formData.append("artwork", file);

    onLoad(true);

    await sendFile("/api/replace-artwork", formData);

    onLoad(false);
  };

  const onSubmitAudio = async (file: File) => {
    const formData = new FormData();
    formData.append("audio", file);

    onLoad(true);

    await sendFile("/api/replace-audio", formData);

    onLoad(false);
  };

  const onSubmitChart = async (file: File) => {
    const formData = new FormData();
    formData.append("chart", file);
    formData.append("difficulty", difficulty.toString());

    onLoad(true);

    await sendFile("/api/replace-chart", formData);

    onLoad(false);
  };

  return (
    <div className={styles.content}>
      <Select
        label="Difficulty"
        onChange={(e) => setDifficulty(difficulties[e.target.value])}
      />
      <Button
        label="Chart"
        onClick={() => openFileDialog("chart", ".chart,.json")}
      />
      <Button label="Audio" onClick={() => openFileDialog("audio", ".wem")} />
      <Button
        label="Artwork"
        onClick={() => openFileDialog("artwork", ".png")}
      />
    </div>
  );
}
