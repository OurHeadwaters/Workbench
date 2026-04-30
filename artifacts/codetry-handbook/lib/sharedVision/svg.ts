import type React from "react";
import RNSvg, {
  Circle as RNCircle,
  Defs as RNDefs,
  G as RNG,
  Line as RNLine,
  Path as RNPath,
  RadialGradient as RNRadialGradient,
  Rect as RNRect,
  Stop as RNStop,
} from "react-native-svg";
import type {
  CircleProps,
  GProps,
  LineProps,
  PathProps,
  RadialGradientProps,
  RectProps,
  StopProps,
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
// Defs has no public Props type in 15.x; it accepts only `children` so
// React.PropsWithChildren is enough to satisfy callers.
export const Defs = RNDefs as unknown as React.FC<React.PropsWithChildren>;
export const G = RNG as unknown as React.FC<React.PropsWithChildren<GProps>>;
export const RadialGradient =
  RNRadialGradient as unknown as React.FC<
    React.PropsWithChildren<RadialGradientProps>
  >;
export const Stop = RNStop as unknown as React.FC<StopProps>;
