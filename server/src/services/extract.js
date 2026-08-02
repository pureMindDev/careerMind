import mammoth from "mammoth";

/** Extracts plain text from an uploaded PDF, DOCX or TXT buffer. */
export async function extractText(file) {
  const mime = file.mimetype;
  if (mime === "application/pdf") {
    // Lazy import: pdf-parse reads a sample file at import time in some versions.
    const { default: pdfParse } = await import("pdf-parse");
    const parsed = await pdfParse(file.buffer);
    return parsed.text.trim();
  }
  if (mime.includes("wordprocessingml")) {
    const { value } = await mammoth.extractRawText({ buffer: file.buffer });
    return value.trim();
  }
  return file.buffer.toString("utf8").trim();
}
