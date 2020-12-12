import Config from './config';

export enum Vertical {
  Top,
  Middle,
  Bottom
}

export enum Horizontal {
  Left,
  Middle,
  Right
}

export const position = (vertical: Vertical, horizontal: Horizontal) => {
  let x = 0;

  switch (horizontal) {
    case Horizontal.Left:
      x = 0;
      break;
    case Horizontal.Middle:
      x = Config.width / 2;
      break;
    case Horizontal.Right:
      x = Config.width;
      break;
  }

  let y = 0;

  switch (vertical) {
    case Vertical.Top:
      y = -Config.height / 2;
      break;
    case Vertical.Middle:
      y = 0;
      break;
    case Vertical.Bottom:
      y = Config.height / 2;
      break;
  }

  return [x, y];
};
