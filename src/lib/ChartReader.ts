import { BPM } from "../interfaces/BPM";
import { Direction } from "../interfaces/Direction";
import { Effect } from "../interfaces/Effect";
import { Section } from "../interfaces/Section";
import { Size } from "../interfaces/Size";
import { insertAt } from "../utils/insertAt";
import { Chart } from "./Chart";
import { adjustBpms } from "./ChartUtils";
import { effects } from "./Effects";

function validateChart(chart: Chart) {
  if (!chart.sections.length) {
    chart.errors.push(
      "Your chart has no sections. Add at least one in Moonscraper."
    );
  }
  if (chart.sections.length > 5) {
    chart.errors.push(
      "Your chart has too many sections. Only 5 sections are supported."
    );
  }
}

export function readChart(file: string, useLegacyRails: boolean) {
  const data = file.split("\r\n").map((el) => el.trim());
  const chart = new Chart();

  const map = {};

  for (let i = 0; i < data.length; i++) {
    const line = data[i];
    if (line.trim().startsWith("[")) {
      map[line] = [];
      i += 2;
      while (data[i] !== "}") {
        map[line].push(data[i++]);
      }
    }
  }

  for (const key in map) {
    if (key === "[Song]") {
      chart.setResolution(findResolution(chart, map[key]));
    } else if (key === "[SyncTrack]") {
      chart.setBpms(handleBPMs(chart, map[key]));
    } else if (key === "[Events]") {
      const result = handleEvents(chart, map[key]);
      chart.setSections(result.sections);
      chart.setEffects(result.effects);
    } else if (key === "[ExpertSingle]") {
      handleNotes(chart, map[key], useLegacyRails);
    }
  }

  validateChart(chart);
  adjustBpms(chart);
  return chart;
}

function findResolution(chart: Chart, block: string[]) {
  const resolution = parseInt(
    block.find((el) => el.startsWith("Resolution")).split(" = ")[1]
  );
  if (!resolution || Number.isNaN(resolution)) {
    chart.errors.push("Couldn't get the resolution for this chart.");
  }
  return resolution;
}

function handleBPMs(chart: Chart, block: string[]) {
  const bpmRegex = /(\d+) = B (\d+)/;
  const bpms: BPM[] = [];

  const bpmBlock = block
    .filter((el) => !el.includes("TS"))
    .map((el) => bpmRegex.exec(el));

  for (const change of bpmBlock) {
    const [_, offset, newBpm] = change;
    bpms.push({
      offset: parseInt(offset),
      change: parseFloat(insertAt(newBpm, ".", newBpm.length - 3)),
    });
  }

  return bpms;
}

function handleEvents(chart: Chart, block: string[]) {
  const eventRegex = /(\d+) = E "(\w+)/;
  const sections: Section[] = [];
  const chartEffects: Effect[] = [];

  const eventsBlock = block.map((el) => eventRegex.exec(el));

  for (const event of eventsBlock) {
    console.log(event);
    const [_, offset, name] = event;
    if (name === "section") {
      const o = parseInt(offset);
      sections.push({ offset: o, adjustedOffset: o });
    } else {
      const effect = effects.find((el) => el.idLabel === name);
      if (!effect) {
        chart.errors.push(
          `Found an effect ${name} at offset ${offset} that doesn't exist.`
        );
        continue;
      }
      const effectsAtOffset = chartEffects.find(
        (el) => el.offset === parseInt(offset)
      );
      if (!effectsAtOffset) {
        const o = parseInt(offset);
        chartEffects.push({
          offset: o,
          adjustedOffset: o,
          effects: [effect.id],
        });
      } else {
        effectsAtOffset.effects.push(effect.id);
      }
    }
  }

  return {
    sections,
    effects: chartEffects,
  };
}

function handleNotes(chart: Chart, block: string[], useLegacyRails: boolean) {
  const noteRegex = /(\d+) = n (\d) (\d+)/;
  const flagsRegex = /(\d+) = e (.*)/;
  const notesBlock = block
    .filter((el) => el.includes("= N"))
    .map((el) => noteRegex.exec(el.toLowerCase()));
  const flagsBlock = block
    .filter((el) => el.includes("= E"))
    .map((el) => flagsRegex.exec(el.toLowerCase()));

  // First lets add in all the actual notes
  for (const note of notesBlock) {
    const [_, offset, lane, length] = note.map((el) => parseInt(el));
    // ignore the tap and forced modifiers
    if (lane > 4) {
      continue;
    }
    chart.notes.push({
      offset,
      lane,
      length,
    });
  }

  // Now lets handle all the n events to create those notes
  // This is because rail notes traverse lanes and Moonscraper doesn't allow you to place notes overtop each other.
  for (const flag of flagsBlock) {
    const [_, offset, name] = flag;
    const events = name.split(",");
    for (const event of events) {
      if (event.startsWith("n")) {
        const split = name.split("+");
        chart.notes.push({
          offset: parseInt(offset),
          lane: parseInt(split[0].slice(1)) - 1,
          length: split[1] ? parseInt(split[1]) : 0,
        });
      }
    }
  }

  // Now lets handle any events for the notes
  for (var i = 0; i < flagsBlock.length; i++) {
    const [_, offset, name] = flagsBlock[i];
    const events = name.split(",");
    for (const event of events) {
      if (event.startsWith("n")) {
        // These were handled above
        continue;
      } else if (event.startsWith("/")) {
        if (event.includes("e")) {
          continue;
        } else if (event.includes("s")) {
          const size = parseInt(name.slice(2));
          for (var j = i + 1; j < flagsBlock.length; j++) {
            const [_, endOffset, name] = flagsBlock[j];
            if (name.includes("e")) {
              chart.applySizes(parseInt(offset), parseInt(endOffset), size);
              break;
            }
          }
          // Start of a range so lets find the end offset...
        } else {
          // Single note
          const size = parseInt(event.slice(1));
          if (size !== 1 && size !== 2) {
            chart.errors.push(
              `Invalid size ${size} given at offset ${offset}. Sizes must be 1 or 2.`
            );
            continue;
          }
          chart.applySizes(parseInt(offset), parseInt(offset), size);
        }
      } else if (event.startsWith("p") || event.startsWith("s")) {
        const arr = event.startsWith("p") ? chart.perfectSizes : chart.speeds;
        arr.push({
          offset: parseInt(offset),
          multiplier: parseFloat(
            insertAt(event.slice(1), ".", event.slice(1).length - 2)
          ),
          adjustedOffset: parseInt(offset),
        });
      } else if (event.startsWith("h")) {
        const [_, start, __, end] = event.split("").map((el) => parseInt(el));
        if (useLegacyRails) {
          chart.applyLegacySwitch(parseInt(offset), start - 1, end - 1);
        } else {
          chart.applySwitch(parseInt(offset), start - 1, end - 1);
        }
      } else {
        const direction = event.slice(0, -1) as Direction;
        const lane = parseInt(event.slice(-1)) - 1;
        chart.applySwipe(parseInt(offset), lane, direction);
      }
    }
  }

  // Add beginning and ending rail note switches if the charter didn't
  const railNotes = chart.notes.filter((note) => note.switches);
  for (const railNote of railNotes) {
    let hasStart = false;
    let hasEnd = false;
    for (const s of railNote.switches) {
      if (s.offset === railNote.offset) {
        hasStart = true;
      } else if (s.offset === railNote.offset + railNote.length) {
        hasEnd = true;
      }
    }
    if (!hasStart) {
      railNote.switches.unshift({
        offset: railNote.offset,
        lane: railNote.lane,
      });
    }
    if (!hasEnd) {
      railNote.switches.push({
        offset: railNote.offset + railNote.length,
        lane: railNote.switches.at(-1).lane,
      });
    }
  }

  chart.setNotes(chart.notes.sort((a, b) => a.offset - b.offset));
}

export function readBytes(json: any) {
  const resolution = 192;

  if (!json.sections) {
    json.sections = [];
  }
  if (!json.effects) {
    json.effects = [];
  }

  const effects = {};
  for (const effect of json.effects) {
    effects[Math.round(effect.offset * resolution)] = effect.effects;
  }

  const chart = new Chart();
  chart.setResolution(resolution);
  chart.setBpms([]);
  chart.setNotes([]);
  chart.setSections(
    json.sections.map((section) => Math.round(section.offset * resolution))
  );
  chart.setPerfectSizes(
    json.perfectSizes.map((size: Size) => {
      return {
        offset: size.offset ? Math.round(size.offset * resolution) : 0,
        multiplier: size.multiplier,
      };
    })
  );
  chart.setSpeeds(
    json.speeds.map((speed: Size) => {
      return {
        offset: speed.offset ? Math.round(speed.offset * resolution) : 0,
        multiplier: speed.multiplier,
      };
    })
  );
  chart.setEffects(
    json.effects.map((effect: Effect) => {
      return {
        offset: effect.offset ? Math.round(effect.offset * resolution) : 0,
        effects: effect.effects,
      };
    })
  );

  const directions: Direction[] = ["u", "d", "l", "r", "ul", "ur", "dr", "dl"];

  for (const note of json.notes) {
    if (note.lane) {
      if (note.note_type === 1) {
        if (note.single) {
          note.single.note.lane = note.lane;
        } else if (note.long) {
          note.long.note.lane = note.lane;
        }
      } else if (note.note_type === 2) {
        note.long.note[0].lane = note.lane;
      }
    }
    if (note.note_type === 1) {
      const offset = Math.round(note.single.note.offset * resolution);
      const lane = note.single ? note.single.note.lane : note.long.note.lane;

      chart.notes.push({
        offset,
        lane,
        length: 0,
        swipe: note.single.swipe ? directions[note.single.swipe - 1] : null,
        size: note.size ?? null,
      });
    } else if (note.note_type === 2) {
      const offset = Math.round(note.long.note[0].offset * resolution);
      const lane = note.long.note[0].lane;
      const length = Math.round(
        (note.long.note[1].offset - note.long.note[0].offset) * resolution
      );

      chart.notes.push({
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
      const lane = note.note.switchHold[0].lane;

      chart.notes.push({
        offset: startOffset,
        lane,
        length: endOffset - startOffset,
        swipe: note.note.swipe ? directions[note.note.swipe - 1] : null,
        switches: note.note.switchHold.map((s) => ({
          offset: Math.round(s.offset * resolution),
          lane: s.lane,
        })),
      });
    }
  }

  return chart;
}
