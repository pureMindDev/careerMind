import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// Run PDF text extraction without an external worker file.
(pdfjsLib.GlobalWorkerOptions as { disableWorker?: boolean }).disableWorker = true;


export async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) {
    return extractPdfText(file);
  }
  if (name.endsWith(".docx")) {
    return extractDocxText(file);
  }
  throw new Error("Unsupported file type. Only PDF and DOCX are allowed.");
}

async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const parts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item) => (item as { str: string }).str).join(" ");
    parts.push(text);
  }

  return parts.join("\n").trim();
}

async function extractDocxText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}
