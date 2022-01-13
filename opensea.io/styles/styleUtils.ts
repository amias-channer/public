import { variant, VariantArgs } from "styled-system"
import { Values } from "../lib/helpers/type"
import { Theme } from "./styled"

export const generateVariants = <T extends string>(
  variants: Record<string, T>,
  getStyle: (variant: T) => Values<NonNullable<VariantArgs["variants"]>>,
): VariantArgs["variants"] => {
  return Object.values(variants).reduce(
    (map, variant) => ({
      ...map,
      [variant]: getStyle(variant),
    }),
    {},
  )
}

type ThemeVariantArgs<TStyle = object> = Omit<
  VariantArgs<TStyle, Theme, "theme">,
  "prop" | "variants"
> & {
  variants?: Partial<Record<Theme, TStyle>>
}

export const themeVariant = <TStyle = object>(
  variantArgs: ThemeVariantArgs<TStyle>,
) => {
  return variant({ ...variantArgs, prop: "theme" } as VariantArgs)
}
