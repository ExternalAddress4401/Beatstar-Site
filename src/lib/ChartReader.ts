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

export interface Size {
  offset: number;
  multiplier: number;
}

export interface Chart {
  info: Info;
  syncTrack: Array<TimeSignature | BPM>;
  sections: number[];
  notes: Note[];
  perfectSizes: Size[];
  speeds: Size[];
  errors: string[];
}

interface Note {
  offset: number;
  length: number;
  lane: number;
  swipe?: Direction;
  size?: number;
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

function getNote(notes: Note[], offset: number, lane?: number) {
  if (lane) {
    return notes.find(
      (note) =>
        (note.offset === offset || note.offset + note.length === offset) &&
        note.lane === lane - 1
    );
  } else {
    return notes.find(
      (note) => note.offset === offset || note.offset + length === offset
    );
  }
}

export function readChart(chart: string) {
  const parsedChart: Chart = {
    info: {},
    syncTrack: [],
    sections: [],
    notes: [],
    perfectSizes: [],
    speeds: [],
    errors: [],
  };

  const data = chart.split("\r\n").join("").split("}");
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
              //add support for s0.1 and p0.1...
              if (event.startsWith("/")) {
                const size = parseInt(event.slice(-1));
                const note = getNote(parsedChart.notes, offset);

                if (!note) {
                  parsedChart.errors.push(
                    `An event was found at offset ${offset} but no note was found there.` //TODO: make this better
                  );
                  continue;
                }

                note.size = size;
              } else {
                const direction = event.slice(0, -1) as Direction;
                const lane = parseInt(event.slice(-1));
                const note = getNote(parsedChart.notes, offset, lane);

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
        }
        break;
    }
  }
  return parsedChart;
}

export function readBytes(json: any) {
  const resolution = 192;

  const parsedChart: Chart = {
    info: {
      resolution,
    },
    syncTrack: [],
    sections: json.sections.map((section) =>
      Math.round(section.offset * resolution)
    ),
    perfectSizes: json.perfects.map((size: Size) => {
      return {
        offset: size.offset ? Math.round(size.offset * 192) : 0,
        multiplier: size.multiplier,
      };
    }),
    speeds: json.speeds.map((speed: Size) => {
      return {
        offset: speed.offset ? Math.round(speed.offset * 192) : 0,
        multiplier: speed.multiplier,
      };
    }),
    notes: [],
    errors: [],
  };

  const directions: Direction[] = ["u", "d", "l", "r"];

  for (const note of json.notes) {
    if (note.note_type === 1) {
      const offset = Math.round(note.single.note.offset * resolution);
      const lane = note.single.note.lane - 1;

      parsedChart.notes.push({
        offset,
        lane,
        length: 0,
        swipe: note.single.swipe ? directions[note.single.swipe - 1] : null,
      });
    } else if (note.note_type === 2) {
      const offset = Math.round(note.long.note[0].offset * resolution);
      const lane = note.long.note[0].lane - 1;
      const length = Math.round(
        (note.long.note[1].offset - note.long.note[0].offset) * resolution
      );

      parsedChart.notes.push({
        offset,
        lane,
        length,
        swipe: note.long.swipe ? directions[note.long.swipe - 1] : null,
      });
    }
  }

  return parsedChart;
}
