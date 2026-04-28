import type React from "react";
import RNSvg, {
  Circle as RNCircle,
  Line as RNLine,
  Path as RNPath,
  Rect as RNRect,
} from "react-native-svg";
import type {
  CircleProps,
  LineProps,
  PathProps,
  RectProps,
  SvgProps,
} from "react-native-svg";

// react-native-svg 15.x still ships class components whose typings
// predate the React 19 JSX runtime. Adapt them once here so callers
// can use plain JSX without per-element type assertions.
export const Svg = RNSvg as unknown as React.FC<SvgProps>;
export const Circle = RNCircle as unknown as React.FC<CircleProps>;
export const Line = RNLine as unknown as React.FC<LineProps>;
export const Path = RNPath as unknown as React.FC<PathProps>;
export const Rect = RNRect as unknown as React.FC<RectProps>;
