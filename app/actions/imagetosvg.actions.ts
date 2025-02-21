"use server";

import { optimize, OptimizedSvg } from "svgo";

export async function optimizeSvg(svg: string) {
  try {
    if (!svg) {
      throw new Error("SVG content is required");
    }

    const result = optimize(svg, {
      multipass: true, // Multiple optimization passes for better results
      plugins: [
        "preset-default", // Default optimization preset
        {
          name: "removeAttrs",
          params: {
            attrs: "(width|height)", // Remove dimensions to make SVG responsive
          },
        },
        "removeComments",
        "removeMetadata",
        "removeUselessDefs",
        "cleanupNumericValues",
        "convertColors",
        "removeHiddenElems",
      ],
    });

    if ("data" in result) {
      return { optimizedSvg: result.data };
    }
    throw new Error("Failed to optimize SVG");
  } catch (error) {
    console.error("Error optimizing SVG:", error);
    return { error: "Failed to optimize SVG" };
  }
}
