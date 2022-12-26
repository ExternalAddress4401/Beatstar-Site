import { adjustBpms } from "./ChartUtils";
import { effects } from "./Effects";
import { insertAt } from "../utils/insertAt";

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

export interface BPM {
  offset: number;
  change: number;
}

export interface Size {
  offset?: number;
  multiplier: number;
}

export interface Effect {
  offset: number;
  effects: number[];
}

export interface Chart {
  info: Info;
  bpms: BPM[];
  sections: number[];
  notes: Note[];
  perfectSizes: Size[];
  speeds: Size[];
  errors: string[];
  effects: Record<number, number[]>;
}

export interface Note {
  offset: number;
  length: number;
  lane: number;
  swipe?: Direction;
  size?: number;
  adjustedStart?: number;
  adjustedEnd?: number;
  switches?: {
    offset: number;
    lane: number;
  }[];
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
      (note) => note.offset === offset || note.offset + note.length === offset
    );
  }
}

function getLane(note: Note) {
  return note.switches ? note.switches.at(-1).lane : note.lane;
}

function getSwitchHoldNote(notes: Note[], eventOffset: number, lane: number) {
  for (const note of notes) {
    if (note.length === 0) {
      continue;
    }
    console.log(note, eventOffset, lane);
    if (
      note.offset <= eventOffset &&
      note.offset + note.length >= eventOffset &&
      getLane(note) === lane - 1
    ) {
      return note;
    }
  }
}

function getNotes(notes: Note[], offset: number) {
  return notes.filter((el) => el.offset === offset);
}

export function readChart(chart: string) {
  const parsedChart: Chart = {
    info: {},
    bpms: [],
    sections: [],
    notes: [],
    perfectSizes: [],
    speeds: [],
    errors: [],
    effects: {},
  };

  const data = chart.split("\r\n").join("").split("}");

  for (const row of data) {
    const [heading, data] = row.split("{");
    console.log(heading, data);
    switch (heading.trim()) {
      case "[Song]":
        for (const property of data.split("  ")) {
          if (!property) {
            continue;
          }
          const [k, v] = property.split(" = ");
          parsedChart.info[k.toLowerCase()] = v;
        }
        break;
      case "[SyncTrack]":
        for (const property of data.split("  ").filter(Boolean)) {
          const { offset, values } = splitRow(property);
          if (values[0] === "B") {
            parsedChart.bpms.push({
              offset: offset,
              change: parseFloat(
                insertAt(values[1], ".", values[1].length - 3)
              ),
            });
          }
        }
        break;
      case "[Events]":
        for (const property of data.trim().split("  ").filter(Boolean)) {
          const { offset, values } = splitRow(property);
          if (values[1] === "section") {
            parsedChart.sections.push(offset);
          } else {
            const foundEffect = effects.find(
              (effect) => effect.idLabel === values[1]
            );
            if (!foundEffect) {
              parsedChart.errors.push(
                `Unknown effect ${values[1]} found at offset ${offset}.`
              );
              continue;
            }
            if (!parsedChart.effects[offset]) {
              parsedChart.effects[offset] = [];
            }

            parsedChart.effects[offset].push(foundEffect.id);
          }
        }
        break;
      case "[ExpertSingle]":
        for (const property of data.split("  ")) {
          console.log(property);
          const { offset, values } = splitRow(property);
          if (values[0] === "N") {
            const lane = parseInt(values[1]);
            if (lane > 4) {
              // ignore any of the tap/switch modifiers
              continue;
            }
            parsedChart.notes.push({
              offset,
              lane: parseInt(values[1]),
              length: parseInt(values[2]),
            });
          } else if (values[0] === "E") {
            const events = values[1].split(",");
            for (const event of events) {
              if (event.startsWith("/")) {
                const size = parseInt(event.slice(-1));
                const notes = getNotes(parsedChart.notes, offset);

                if (!notes.length) {
                  parsedChart.errors.push(
                    `An event was found at offset ${offset} but no note was found there.` //TODO: make this better
                  );
                  continue;
                }

                for (const note of notes) {
                  note.size = size;
                }
              } else if (event.startsWith("s")) {
                parsedChart.speeds.push({
                  offset,
                  multiplier: parseFloat(
                    insertAt(event.slice(1), ".", event.slice(1).length - 2)
                  ),
                });
              } else if (event.startsWith("p")) {
                parsedChart.perfectSizes.push({
                  offset,
                  multiplier: parseFloat(
                    insertAt(event.slice(1), ".", event.slice(1).length - 2)
                  ),
                });
              } else if (event.startsWith("h")) {
                const s = event
                  .slice(1)
                  .split(">")
                  .map((el) => parseInt(el));
                const note = getSwitchHoldNote(parsedChart.notes, offset, s[0]);
                console.log("NOTE", note);
                if (!note) {
                  parsedChart.errors.push(
                    `Found switch effect at ${offset} but there was no long note there.`
                  );
                  continue;
                }
                if (!note.switches) {
                  note.switches = [];
                }
                note.switches.push({
                  offset,
                  lane: s[1] - 1,
                });
              } else {
                const direction = event.slice(0, -1) as Direction;
                const lane = parseInt(event.trim().slice(-1));
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

  if (!parsedChart.sections.length) {
    parsedChart.errors.push(
      "No sections were found. Add at least 1 in Moonscraper."
    );
  }

  if (parsedChart.sections.length > 5) {
    parsedChart.errors.push(
      `Only 5 sections are supported. Your chart has ${parsedChart.sections.length} sections.`
    );
  }

  adjustBpms(parsedChart);
  console.log(parsedChart);
  return parsedChart;
}

export function readBytes(json: any) {
  const resolution = 192;

  const effects = {};
  for (const effect of json.effects) {
    effects[effect.offset * resolution] = effect.effects;
  }

  const parsedChart: Chart = {
    info: {
      resolution,
    },
    bpms: [],
    sections: json.sections.map((section) =>
      Math.round(section.offset * resolution)
    ),
    perfectSizes: json.perfectSizes.map((size: Size) => {
      return {
        offset: size.offset ? Math.round(size.offset * resolution) : 0,
        multiplier: size.multiplier,
      };
    }),
    speeds: json.speeds.map((speed: Size) => {
      return {
        offset: speed.offset ? Math.round(speed.offset * resolution) : 0,
        multiplier: speed.multiplier,
      };
    }),
    notes: [],
    errors: [],
    effects,
  };

  const directions: Direction[] = ["u", "d", "l", "r", "ul", "ur", "dl", "dr"];

  for (const note of json.notes) {
    if (note.note_type === 1) {
      const offset = Math.round(note.single.note.offset * resolution);
      const lane = note.single ? note.single.note.lane : note.long.note.lane;

      parsedChart.notes.push({
        offset,
        lane,
        length: 0,
        swipe: note.single.swipe ? directions[note.single.swipe - 1] : null,
        size: note.size ?? null,
      });
    } else if (note.note_type === 2) {
      const offset = Math.round(note.long.note[0].offset * resolution);
      const lane = note.lane;
      const length = Math.round(
        (note.long.note[1].offset - note.long.note[0].offset) * resolution
      );

      parsedChart.notes.push({
        offset,
        lane,
        length,
        swipe: note.long.swipe ? directions[note.long.swipe - 1] : null,
        size: note.size ?? null,
      });
    } else if (note.note_type === 5) {
      const startOffset = Math.round(
        note.note.switchHold[0].offset * resolution
      );
      const endOffset = Math.round(
        note.note.switchHold[note.note.switchHold.length - 1].offset *
          resolution
      );
      const lane = note.lane;

      parsedChart.notes.push({
        offset: startOffset,
        lane,
        length: endOffset - startOffset,
        switches: note.note.switchHold.map((s) => ({
          offset: Math.round(s.offset * resolution),
          lane: s.lane,
        })),
      });
    }
  }

  return parsedChart;
}
