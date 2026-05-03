"use client"
import * as React from "react"

/**
 * ThemeProvider — light-only passthrough.
 *
 * Kept as a named wrapper so adding dark mode later requires
 * updating only this file (swap in next-themes or similar).
 */
export function ThemeProvider({
  children,
  ...props
}: React.PropsWithChildren<Record<string, unknown>>) {
  return <>{children}</>
}
