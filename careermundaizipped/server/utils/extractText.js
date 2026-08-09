import mammoth from "mammoth";

/** Extracts plain text from an uploaded PDF, DOCX or TXT buffer (Multer memory-storage file). */
export async function extractText(file) {
  const mime = file.mimetype;

  if (mime === "application/pdf") {
    // Lazy import: keeps startup fast when PDFs are never uploaded.
    const { PDFParse } = await import("pdf-parse");
    if (typeof PDFParse !== "function") {
      // Guards against a stale/mismatched pdf-parse install (e.g. the old
      // v1.x API, which has no PDFParse export) producing a cryptic
      // "PDFParse is not a constructor" error instead of an actionable one.
      throw new Error(
        "pdf-parse is installed with an unexpected API. Run `npm install` in server/ to pick up the pinned version.",
      );
    }

    const parser = new PDFParse({ data: file.buffer });
    try {
      const result = await parser.getText();
      return result.text.trim();
    } finally {
      await parser.destroy();
    }
  }

  if (mime.includes("wordprocessingml")) {
    const { value } = await mammoth.extractRawText({ buffer: file.buffer });
    return value.trim();
  }

  return file.buffer.toString("utf8").trim();
}
