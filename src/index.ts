import { loadImagesAsBuffers } from "./lib/buffer";
import { compressImage } from "./lib/compress";
import { saveCompressedImage } from "./lib/file";

function parseArgs() {
  const args = process.argv.slice(2);
  const params: { [key: string]: string | undefined } = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace("--", "") || "";
    const value = args[i + 1];
    params[key] = value;
  }

  return {
    filePath: params["file-path"],
    outputPath: params["output-path"],
  };
}

async function main() {
  const { filePath, outputPath } = parseArgs();
  console.log("Starting image processing...");
  console.log("Looking for images in:", filePath, outputPath);

  if (!filePath) {
    console.error("File path is required");
    process.exit(1);
  }

  if (!outputPath) {
    console.error("Output path is required");
    process.exit(1);
  }

  const compressedImages = await loadImagesAsBuffers(filePath);
  for (const [_, imageFile] of compressedImages.entries()) {
    const timeStart = performance.now();
    const minifiedImage = await compressImage(
      imageFile.buffer,
      imageFile.name,
      imageFile.mimeType
    );

    await saveCompressedImage(
      minifiedImage,
      imageFile.name,
      imageFile.ext,
      outputPath
    );

    const timeEnd = performance.now();

    console.log({
      fileName: imageFile.name,
      originalSize: imageFile.size,
      mimeType: imageFile.mimeType,
      imageMin: {
        size: minifiedImage.size,
        reduction:
          ((imageFile.size - minifiedImage.size) / imageFile.size) * 100,
      },
      duration: timeEnd - timeStart,
    });
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
