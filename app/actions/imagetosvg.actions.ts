// app/actions/imagetosvg.actions.ts
"use server";

import { optimize } from "svgo";

export async function imagetosvg(svg: string) {
  try {
    if (!svg) {
      throw new Error("SVG content is required");
    }

    const result = optimize(svg, {
      multipass: true,
      plugins: [
        "preset-default",
        {
          name: "removeAttrs",
          params: {
            attrs: "(width|height)",
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
