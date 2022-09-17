import { RefObject } from "react";

export const deg2rad = (deg: number) => deg * (Math.PI / 180);
export const rad2deg = (rad: number) => rad * (180 / Math.PI);

export interface ContainerSize {
  width: number;
  height: number;
}

export const getWidthHeightFromRef = (
  ref: RefObject<HTMLElement>
): ContainerSize => {
  if (!ref.current) return { width: 0, height: 0 };
  const clientWidth = ref.current.clientWidth;
  const clientHeight = ref.current.clientHeight;
  let width = 0;
  let height = 0;
  if (clientHeight > (clientWidth * 3) / 4) {
    width = clientWidth;
    height = clientWidth * (3 / 4);
  } else {
    height = clientHeight;
    width = clientHeight * (4 / 3);
  }
  return { width, height };
};
