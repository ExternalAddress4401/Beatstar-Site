import { BPM } from "../interfaces/BPM";
import { Direction } from "../interfaces/Direction";
import { Effect } from "../interfaces/Effect";
import { Note } from "../interfaces/Note";
import { Section } from "../interfaces/Section";
import { Size } from "../interfaces/Size";

export class Chart {
  resolution: number = 0;
  notes: Note[] = [];
  bpms: BPM[] = [];
  sections: Section[] = [];
  perfectSizes: Size[] = [];
  speeds: Size[] = [];
  errors: string[] = [];
  effects: Effect[];

  constructor() {}
  setResolution(resolution: number) {
    this.resolution = resolution;
  }
  setNotes(notes: Note[]) {
    this.notes = notes;
  }
  setBpms(bpms: BPM[]) {
    this.bpms = bpms;
  }
  setSections(sections: Section[]) {
    this.sections = sections;
  }
  setPerfectSizes(perfectSizes: Size[]) {
    this.perfectSizes = perfectSizes;
  }
  setSpeeds(speeds: Size[]) {
    this.speeds = speeds;
  }
  setEffects(effects: Effect[]) {
    this.effects = effects;
  }
  applySizes(startOffset: number, endOffset: number, size: number) {
    const notes = this.getRange(startOffset, endOffset);
    for (const note of notes) {
      note.size = size;
    }
  }
  applySwipe(offset: number, lane: number, direction: Direction) {
    const note = this.getNote(offset, lane);
    if (!note) {
      this.errors.push(
        `Found event (${direction}${lane}) at ${offset} but there was no note there.`
      );
      return;
    }
    note.swipe = direction;
  }
  applyLegacySwitch(offset: number, startLane: number, endLane: number) {
    const note = this.getLegacyLongNote(offset, startLane);
    if (!note) {
      this.errors.push(
        `Found rail event at ${offset} but there was no target note.`
      );
      return;
    }
    if (!note.switches) {
      note.switches = [];
    }
    note.switches.push({
      offset,
      lane: endLane,
    });
  }
  applySwitch(offset: number, startLane: number, endLane: number) {
    const note = this.getLongNote(offset, startLane);
    if (!note) {
      this.errors.push(
        `Found rail event at ${offset} but there was no target note.`
      );
      return;
    }
    if (!note.switches) {
      note.switches = [];
    }
    note.switches.push({
      offset,
      lane: endLane,
    });
  }
  getLongNote(offset: number, lane?: number) {
    for (const note of this.notes) {
      if (note.offset <= offset && note.offset + note.length >= offset) {
        if (lane !== undefined && note.lane !== lane) {
          continue;
        }
        return note;
      }
    }
    return null;
  }
  getNote(offset: number, lane?: number) {
    // Is there an exact match for this note?
    for (const note of this.notes) {
      if (note.offset === offset) {
        if (lane !== undefined && note.lane !== lane) {
          continue;
        }
        return note;
      }
    }
    // Is there a long note it could be?
    for (const note of this.notes) {
      if (note.offset <= offset && note.offset + note.length >= offset) {
        if (lane !== undefined && note.lane !== lane) {
          continue;
        }
        return note;
      }
    }
    return null;
  }
  getRange(startOffset: number, endOffset: number) {
    const notes: Note[] = [];
    for (const note of this.notes) {
      if (note.offset >= startOffset && note.offset <= endOffset) {
        notes.push(note);
      }
      if (note.offset > endOffset) {
        return notes;
      }
    }
    return notes;
  }
  getNotes(offset: number) {
    const notes: Note[] = [];
    for (const note of this.notes) {
      if (note.offset === offset) {
        notes.push(note);
      }
      if (note.offset > offset) {
        return notes;
      }
    }
    return notes;
  }
  getLegacyLongNote(offset: number, lane: number) {
    for (const note of this.notes) {
      if (note.length === 0) {
        continue;
      }
      const noteLane = note.switches ? note.switches.at(-1).lane : note.lane;
      if (
        note.offset <= offset &&
        note.offset + note.length >= offset &&
        noteLane === lane
      ) {
        return note;
      }
    }
  }
}
