import { Image } from "image-js";

export const convertImage = (image: Image, f: (value: number) => number) => {
  const image_ = image.clone();

  for (let i = 0; i < image_.width; i++) {
    for (let j = 0; j < image_.height; j++) {
      for (let k = 0; k < image_.channels; k++) {
        image_.setValueXY(i, j, k, f(image_.getValueXY(i, j, k)));
      }
    }
  }

  return image_;
};
