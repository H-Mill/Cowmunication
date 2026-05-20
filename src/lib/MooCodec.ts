export class MooCodec {
  /**
   * Letters and digits are packed into moos; everything else (spaces,
   * punctuation, symbols) passes through literally. Pass-through chars are never
   * letters, so they never collide with moo glyphs and stay unambiguous.
   */
  private static isPassThrough(char: string): boolean {
    return /[^\p{L}\p{N}]/u.test(char);
  }

  /**
   * Head char that opens every word, so each word reads as a "Moo". Its case
   * mirrors the word's first letter: "M" if capitalized, "m" otherwise.
   */
  private static head(run: string): string {
    return /\p{Lu}/u.test([...run][0]) ? "M" : "m";
  }

  /** Quote chars are rendered as superscript zeros instead of passing through. */
  private static readonly QUOTES: Record<string, string> = {
    "'": "⁰",
    '"': "~~",
  };

  /**
   * Accent-free O-lookalikes from four scripts. A byte's code is a run of LEAD
   * glyphs ended by one STOP glyph, so codes are prefix-free and concatenate
   * without separators. LEAD/STOP are disjoint, which makes parsing trivial:
   * read glyphs until a STOP.
   */
  private static readonly STOP = ["o", "о", "ο", "օ"]; // Latin, Cyrillic, Greek, Armenian small o
  private static readonly LEAD = ["O", "О", "Ο", "Օ"]; // their capital forms
  private static readonly GLYPHS = [...MooCodec.STOP, ...MooCodec.LEAD].join("");

  private static readonly TABLES = MooCodec.buildTables();

  /**
   * Builds the byte↔code maps. Codes are generated shortest-first and handed
   * out to byte values in English-frequency order, so common letters are short.
   */
  private static buildTables(): {
    byteToCode: string[];
    codeToByte: Map<string, number>;
  } {
    const codes: string[] = [];
    let prefixes = [""];
    while (codes.length < 256) {
      for (const prefix of prefixes) {
        for (const stop of MooCodec.STOP) {
          if (codes.length < 256) codes.push(prefix + stop);
        }
      }
      const next: string[] = [];
      for (const prefix of prefixes) {
        for (const lead of MooCodec.LEAD) next.push(prefix + lead);
      }
      prefixes = next;
    }

    const priority =
      "etaoinshrdlcumwfgypbvkjxqzETAOINSHRDLCUMWFGYPBVKJXQZ0123456789";
    const seen = new Set<number>();
    const byteByRank: number[] = [];
    for (const char of priority) {
      const byte = char.charCodeAt(0);
      if (!seen.has(byte)) {
        seen.add(byte);
        byteByRank.push(byte);
      }
    }
    for (let byte = 0; byte < 256; byte++) {
      if (!seen.has(byte)) byteByRank.push(byte);
    }

    const byteToCode: string[] = new Array(256);
    const codeToByte = new Map<string, number>();
    byteByRank.forEach((byte, rank) => {
      byteToCode[byte] = codes[rank];
      codeToByte.set(codes[rank], byte);
    });
    return { byteToCode, codeToByte };
  }

  /**
   * Encode plain text into moo language. Each run of letters/digits becomes one
   * moo: a leading "M" followed by the frequency code of each UTF-8 byte. Other
   * characters pass through literally.
   */
  static encode(text: string): string {
    const encoder = new TextEncoder();
    const parts: string[] = [];
    let run = "";

    const flushRun = () => {
      if (run.length === 0) return;
      let moo = MooCodec.head(run);
      for (const byte of encoder.encode(run)) {
        moo += MooCodec.TABLES.byteToCode[byte];
      }
      parts.push(moo);
      run = "";
    };

    for (const char of text) {
      const quote = MooCodec.QUOTES[char];
      if (quote !== undefined) {
        flushRun();
        parts.push(quote);
      } else if (MooCodec.isPassThrough(char)) {
        flushRun();
        parts.push(char);
      } else {
        run += char;
      }
    }
    flushRun();

    return parts.join("");
  }

  /**
   * Decode moo language back into plain text. Each moo's glyph body is parsed
   * code-by-code (a run of leads ended by a stop) into bytes; literals are
   * emitted as-is.
   */
  static decode(mooText: string): string {
    const stops = new Set(MooCodec.STOP);
    const g = MooCodec.GLYPHS;
    // Group 1: a moo (head M/m + glyph body). Group 2: literal pass-through.
    const regex = new RegExp(`([Mm][${g}]+)|([^Mm${g}]+)`, "gu");
    const result: string[] = [];

    for (const match of mooText.matchAll(regex)) {
      if (match[1] !== undefined) {
        const bytes: number[] = [];
        let code = "";
        for (const glyph of match[1].slice(1)) {
          code += glyph;
          if (stops.has(glyph)) {
            bytes.push(MooCodec.TABLES.codeToByte.get(code)!);
            code = "";
          }
        }
        result.push(new TextDecoder().decode(new Uint8Array(bytes)));
      } else {
        result.push(match[2]!.replace(/~~/g, '"').replace(/⁰/g, "'"));
      }
    }

    return result.join("");
  }
}
