// components/PdfToWordConverter.tsx
"use client";

import { convertPdfToWord } from "@/actions/pdftoword.actions";
import { useState, ChangeEvent } from "react";

export default function PdfToWordConverter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [wordResult, setWordResult] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["application/pdf"];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid PDF file");
        return;
      }
      setPdfFile(file);
      setWordResult("");
      setFilename("");
      setError("");
    }
  };

  const convertToWord = async () => {
    if (!pdfFile) {
      setError("Please select a PDF file first");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      const result = await convertPdfToWord(formData);

      if ("docxBuffer" in result && result.docxBuffer) {
        setWordResult(result.docxBuffer);
        setFilename(result.filename);
      } else {
        setError(result.error || "Conversion failed");
      }
    } catch (err) {
      setError("Error converting PDF to Word");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadWord = () => {
    if (!wordResult) return;

    const byteCharacters = atob(wordResult);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "converted.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          PDF to Word Converter
        </h1>

        <div className="mb-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-200
              hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
          />
        </div>

        <button
          onClick={convertToWord}
          disabled={isLoading || !pdfFile}
          className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
            text-white font-bold py-2 px-4 rounded
            disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 
            transition-colors mb-4"
        >
          {isLoading ? "Converting..." : "Convert to Word"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded">
            {error}
          </div>
        )}

        {wordResult && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
              Result:
            </h2>
            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded bg-gray-50 dark:bg-gray-800">
              <p className="text-gray-700 dark:text-gray-300">
                Word document ready for download ({filename})
              </p>
              <button
                onClick={downloadWord}
                className="mt-4 w-full bg-green-500 hover:bg-green-600 
                  dark:bg-green-600 dark:hover:bg-green-700 text-white 
                  font-bold py-2 px-4 rounded transition-colors"
              >
                Download Word Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
