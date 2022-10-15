import { Image } from "image-js";

export const convertImage = (
  image: Image,
  f: (value: number[]) => number[]
) => {
  const image_ = image.clone();

  const array = image_.getPixelsArray();
  for (let i = 0; i < array.length; i++) {
    image_.setPixel(i, f(array[i]));
  }

  return image_;
};
