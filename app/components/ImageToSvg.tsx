// app/components/ImageToSvg.tsx
"use client";

import { useState, ChangeEvent } from "react";
import { imagetosvg } from "@/actions/imagetosvg.actions";

export default function ImageToSvg() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [svgResult, setSvgResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/bmp",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        setError(
          "Please select a valid image format (PNG, JPEG, GIF, BMP, or WebP)"
        );
        return;
      }

      setImageFile(file);
      setSvgResult("");
      setError("");
      setIsLoading(true);

      try {
        // Step 1: Convert image to base64
        const base64 = await convertImageToBase64(file);

        // Step 2: Generate initial SVG
        const initialSvg = await rasterToSvg(base64);

        // Step 3: Send to server for optimization
        const result = await imagetosvg(initialSvg);

        if ("optimizedSvg" in result && result.optimizedSvg) {
          setSvgResult(result.optimizedSvg);
        } else {
          setError(result.error || "Failed to optimize SVG");
        }
      } catch (err) {
        setError("Error converting image to SVG");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const downloadSvg = () => {
    if (!svgResult) return;
    const blob = new Blob([svgResult], { type: "image/svg+xml" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = imageFile
      ? `${imageFile.name.split(".")[0]}.svg`
      : "converted.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const rasterToSvg = async (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(`
          <svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
            <image href="${base64}" width="${img.width}" height="${img.height}"/>
          </svg>
        `);
      };
      img.src = base64;
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Image to SVG Converter
        </h1>

        <div className="mb-4">
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif,image/bmp,image/webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-200
              hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
          />
          {isLoading && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Converting...
            </p>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded">
            {error}
          </div>
        )}

        {svgResult && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
              Result:
            </h2>
            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded bg-gray-50 dark:bg-gray-800">
              <div dangerouslySetInnerHTML={{ __html: svgResult }} />
              <textarea
                value={svgResult}
                readOnly
                className="mt-2 w-full h-32 p-2 border border-gray-200 dark:border-gray-700 
                  rounded text-sm font-mono bg-white dark:bg-gray-900 
                  text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={downloadSvg}
                className="mt-4 w-full bg-green-500 hover:bg-green-600 
                  dark:bg-green-600 dark:hover:bg-green-700 text-white 
                  font-bold py-2 px-4 rounded transition-colors"
              >
                Download SVG
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
