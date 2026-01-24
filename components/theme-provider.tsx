"use client"
import * as React from "react"

// ThemeProvider simplified — site is light-only now.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
