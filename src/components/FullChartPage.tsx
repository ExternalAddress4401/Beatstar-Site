import Button from "./Button";
import Checkbox from "./Checkbox";
import Footer from "./Footer";
import Input from "./Input";
import Select from "./Select";
import { getRandomBetween } from "../utils/getRandomBetween";
import UploadProps from "../interfaces/UploadProps";
import { useState } from "react";
import { readFile } from "../utils/readFile";
import { readChart } from "../lib/ChartReader";
import { isPng } from "../utils/isPng";
import axios from "axios";

import styles from "./FullChartPage.module.scss";

export interface SongInfo {
  title: string;
  artist: string;
  id: number;
  difficulty: number;
  type: string;
}

interface FullChartProps {
  onLoad: (value: boolean) => void;
}

export default function FullChartPage({ onLoad }: FullChartProps) {
  const [chart, setChart] = useState<UploadProps>({
    icon: "circle-question",
  });
  const [audio, setAudio] = useState<UploadProps>({
    icon: "circle-question",
  });
  const [artwork, setArtwork] = useState<UploadProps>({
    icon: "circle-question",
  });
  const [info, setInfo] = useState<SongInfo>({
    title: "",
    artist: "",
    id: getRandomBetween(2000, 10000),
    difficulty: 1,
    type: "Regular",
  });
  const [legacyRails, setLegacyRails] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[] | null>(null);

  const difficulties = {
    Extreme: 1,
    Hard: 3,
    Normal: 4,
  };

  const onInfoChange = (e: React.FormEvent<HTMLInputElement>) => {
    switch (e.currentTarget.name) {
      case "title":
        setInfo({
          ...info,
          title: e.currentTarget.value,
        });
        break;
      case "artist":
        setInfo({
          ...info,
          artist: e.currentTarget.value,
        });
        break;
      case "id":
        setInfo({
          ...info,
          id: parseInt(e.currentTarget.value),
        });
        break;
      case "difficulty":
        setInfo({
          ...info,
          difficulty: difficulties[e.currentTarget.value],
        });
        break;
      case "deluxe":
        setInfo({
          ...info,
          type: e.currentTarget.checked ? "Promode" : "Regular",
        });
    }
  };

  const shouldShowCreateButton = () => {
    return (
      info.title && info.artist && chart.data && audio.data && artwork.data
    );
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
          const chartData = await readFile(file, "text");
          const parsedChart = readChart(chartData.toString(), legacyRails);
          if (parsedChart.errors.length) {
            setErrors(parsedChart.errors);
            return;
          }
          setChart({
            name: file.name,
            data: parsedChart,
            file: file,
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
            file: file,
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
            file: file,
            icon: "check",
          });
          break;
      }
    };
    input.click();
  };

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("chart", chart.file);
    formData.append("artwork", artwork.file);
    formData.append("audio", audio.file);
    formData.append("info", JSON.stringify(info));
    formData.append("legacyRails", legacyRails.toString());
    onLoad(true);

    try {
      const response = await axios.post("/api/build", formData, {
        responseType: "arraybuffer",
      });
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "song.zip");
        document.body.appendChild(link);
        link.click();
      }
    } catch (e) {
      const error: any = JSON.parse(Buffer.from(e.response.data) as any).errors;
      setErrors(error);
    }

    onLoad(false);
  };

  return (
    <div>
      <div className={styles.group}>
        <Input
          label="Title"
          type="text"
          value={info.title}
          onChange={onInfoChange}
        />
        <Input
          label="Artist"
          type="text"
          value={info.artist}
          onChange={onInfoChange}
        />
        <Input
          label="ID"
          type="number"
          value={info.id}
          onChange={onInfoChange}
        />
        <Select label="Difficulty" onChange={onInfoChange} />
        <Checkbox label="Deluxe" onChange={onInfoChange} />
        <Checkbox label="Use legacy rail notes" onChange={setLegacyRails} />
      </div>

      <div className={styles.group}>
        <Button
          label={chart.name ? chart.name.slice(0, 20) + "..." : "Chart"}
          startIcon="upload"
          endIcon={chart.icon}
          onClick={() => openFileDialog("chart", ".chart")}
        />
        <Button
          label={audio.name ? audio.name.slice(0, 20) + "..." : "Audio"}
          startIcon="upload"
          endIcon={audio.icon}
          onClick={() => openFileDialog("audio", ".wem")}
        />
        <Button
          label={artwork.name ? artwork.name.slice(0, 20) + "..." : "Artwork"}
          startIcon="upload"
          endIcon={artwork.icon}
          onClick={() => openFileDialog("artwork", ".png")}
        />

        {shouldShowCreateButton() && (
          <Button label="Create" onClick={onSubmit} />
        )}
      </div>
      <Footer errors={errors} onClose={() => setErrors(null)} />
    </div>
  );
}
