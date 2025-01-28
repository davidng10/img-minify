import imagemin from "imagemin";
import imageminPngquant from "imagemin-pngquant";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminWebp from "imagemin-webp";
import { bufferToFile } from "./buffer";

export const compressImage = async (
  imageBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<File> => {
  const imageBufArr = await imagemin.buffer(imageBuffer, {
    plugins: [
      imageminWebp({ quality: 75 }),
      imageminMozjpeg({ quality: 75 }),
      imageminPngquant({ quality: [0.6, 0.8] }),
    ],
  });

  const imageBuf = Buffer.from(imageBufArr);

  return bufferToFile(imageBuf, fileName, mimeType);
};
