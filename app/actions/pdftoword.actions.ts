// app/actions/pdftoword.actions.ts
"use server";

import { Document, Packer, Paragraph } from "docx";
import pdfParse from "pdf-parse";

export async function convertPdfToWord(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;
    if (!file) {
      throw new Error("No PDF file provided");
    }

    const pdfBuffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(pdfBuffer);
    const textContent = pdfData.text;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: textContent,
            }),
          ],
        },
      ],
    });

    const docxBuffer = await Packer.toBuffer(doc);

    return {
      docxBuffer: docxBuffer.toString("base64"),
      filename: file.name.replace(/\.[^/.]+$/, "") + ".docx",
    };
  } catch (error) {
    console.error("Error converting PDF to Word:", error);
    return { error: "Failed to convert PDF to Word" };
  }
}
