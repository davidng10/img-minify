import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export const saveCompressedImage = async (
  file: File,
  fileName: string,
  fileExt: string,
  outputDir: string
): Promise<void> => {
  // Create output directory if it doesn't exist
  await mkdir(outputDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const outputPath = join(outputDir, `compressed_${fileName}${fileExt}`);
  await writeFile(outputPath, buffer);
};
