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
  top: number;
  bottom: number;
}

interface BPM {
  offset: number;
  change: number;
}

export interface Chart {
  info: Info;
  syncTrack: Array<TimeSignature | BPM>;
  sections: number[];
  notes: Note[];
  errors: string[];
}

interface Note {
  offset: number;
  length: number;
  lane: number;
  swipe?: Direction;
}

type Direction = "u" | "d" | "l" | "r" | "ul" | "ur" | "dl" | "dr";

const splitRow = (value: string) => {
  value = value.replace(/\"/g, "");
  const offset = parseInt(value.substring(0, value.indexOf(" ")));
  const values = value
    .substring(value.indexOf("= ") + 2, value.length)
    .split(" ");

  return {
    offset,
    values,
  };
};

export function readChart(chart: string) {
  const parsedChart: Chart = {
    info: {},
    syncTrack: [],
    sections: [],
    notes: [],
    errors: [],
  };

  const data = chart.split("\r\n").join("").split("}");
  for (const row of data) {
    const [heading, data] = row.split("{  ");
    console.log(heading);
    switch (heading) {
      case "[Song]":
        for (const property of data.split("  ")) {
          const [k, v] = property.split(" = ");
          parsedChart.info[k] = v;
        }
        break;
      case "[SyncTrack]":
        for (const property of data.split("  ")) {
          const { offset, values } = splitRow(property);
          if (values.length === 3) {
            parsedChart.syncTrack.push({
              offset,
              top: parseInt(values[1]),
              bottom: parseInt(values[2]),
            });
          } else {
            parsedChart.syncTrack.push({
              offset,
              change: parseInt(values[1].slice(0, -3)),
            });
          }
        }
        break;
      case "[Events]":
        for (const property of data.split("  ")) {
          const { offset, values } = splitRow(property);
          if (values[1] === "section") {
            parsedChart.sections.push(offset);
          }
        }
        break;
      case "[ExpertSingle]":
        for (const property of data.split("  ")) {
          const { offset, values } = splitRow(property);
          if (values[0] === "N") {
            parsedChart.notes.push({
              offset,
              lane: parseInt(values[1]),
              length: parseInt(values[2]),
            });
          } else if (values[0] === "E") {
            const events = values[1].split(",");
            for (const event of events) {
              const direction = event.slice(0, -1) as Direction;
              const lane = parseInt(event.slice(-1));

              const note = parsedChart.notes.find(
                (note) =>
                  (note.offset === offset || note.offset + length === offset) &&
                  note.lane === lane - 1
              );
              if (!note) {
                parsedChart.errors.push(
                  `An event was found at offset ${offset} but no note was found there.` //TODO: make this better
                );
                continue;
              }

              note.swipe = direction;
            }
          }
        }
        break;
    }
  }
  return parsedChart;
}
