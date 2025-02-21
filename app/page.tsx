// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-black p-6 transition-all">
      <div className="text-center mb-12 max-w-3xl">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          All-in-One File Converter
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Convert your files seamlessly. Supports Word to PDF, PDF to Word, HEIC
          to JPG, and more. Fast, reliable, and free to use.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {[
          {
            name: "Image to SVG",
            description: "Convert raster images to scalable vector graphics.",
            link: "/image-to-svg",
          },
          {
            name: "Word to PDF",
            description: "Easily convert Word documents to PDF format.",
            link: "/word-to-pdf",
          },
          {
            name: "PDF to Word",
            description: "Turn your PDFs into editable Word files.",
            link: "/pdf-to-word",
          },
          {
            name: "HEIC to JPG/PNG",
            description: "Convert HEIC images to widely supported formats.",
            link: "/heic-to-jpg",
          },
        ].map((tool) => (
          <div
            key={tool.name}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl text-center transition-all"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {tool.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {tool.description}
            </p>
            <Link href={tool.link}>
              <button className="mt-4 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-all">
                Get Started
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
