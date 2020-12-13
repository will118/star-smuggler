// import * as ex from 'excalibur';

import Config from './config';

export enum Vertical {
  Top = 'Top',
  Middle = 'Middle',
  Bottom = 'Bottom',
}

export enum Horizontal {
  Left = 'Left',
  Middle = 'Middle',
  Right = 'Right',
}

export const Verticals: { [key in Vertical]: number } = {
  [Vertical.Top]: -Config.height / 2,
  [Vertical.Middle]: 0,
  [Vertical.Bottom]: Config.height / 2,
};

export const Horizontals: { [key in Horizontal]: number } = {
  [Horizontal.Left]: 0,
  [Horizontal.Middle]: Config.width / 2,
  [Horizontal.Right]: Config.width,
};

export const position = (vertical: Vertical, horizontal: Horizontal) => {
  return [
    Horizontals[horizontal], Verticals[vertical]
  ];
};
