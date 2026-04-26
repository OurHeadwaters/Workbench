import colors from "@/constants/colors";
import { useReader } from "@/contexts/ReaderState";

export type Palette = typeof colors.light & { radius: number };

export function useColors(): Palette {
  const { theme } = useReader();
  const palette = theme === "dark" ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
