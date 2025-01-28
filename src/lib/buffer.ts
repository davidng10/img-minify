import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { parse } from "path";
import mime from "mime";

type ImageFile = {
  buffer: Buffer;
  name: string;
  mimeType: string;
  size: number;
  ext: string;
};

export const loadImagesAsBuffers = async (
  directoryPath: string
): Promise<Map<string, ImageFile>> => {
  const imageBuffers = new Map<string, ImageFile>();

  try {
    const files = await readdir(directoryPath);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    for (const file of imageFiles) {
      const { name, ext } = parse(file);
      const mimeType = mime.getType(ext);

      const buffer = await readFile(join(directoryPath, file));

      imageBuffers.set(file, {
        buffer,
        name,
        ext,
        mimeType: mimeType ?? "",
        size: buffer.length,
      });
    }

    return imageBuffers;
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to load images: ${err.message}`);
  }
};
