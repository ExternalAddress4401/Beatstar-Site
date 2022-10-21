interface Info {
  offset?: number;
  resolution?: number;
  player2?: string;
  difficulty?: number;
  previewStart?: number;
  previewEnd?: number;
  genre?: string;
  mediaType?: string;
  musicStream?: string;
}

interface TimeSignature {
  offset: number;
  type: "TS";
  top: number;
  bottom: number;
}

interface BPM {
  offset: number;
  type: "B";
  change: number;
}

interface Chart {
  info: Info;
  syncTrack: Array<TimeSignature | BPM>;
}

export function readChart(chart: string) {
  const parsedChart = {
    info: {},
    syncTrack: [],
  };

  const data = chart.split("\r\n").join("").split("}");
  console.log(data);
  for (const row of data) {
    const [heading, data] = row.split("{  ");
    switch (heading) {
      case "[Song]":
        for (const property of data.split("  ")) {
          const [k, v] = property.split(" = ");
          parsedChart.info[k] = v;
        }
        break;
      case "[SyncTrack]":
        for (const property of data.split("  ")) {
          console.log(property);
          //const [k, v] = property.split(" = ");
          //console.log(v.length);
          //if (v.length === 3) {
          //  parsedChart.syncTrack.push({ offset: k, top: v[1], bottom: v[2] });
          //} else {
          //  parsedChart.syncTrack.push({ offset: k, change: v[1] });
          //}
        }
        break;
    }
  }
  console.log(parsedChart);
  return data;
}
