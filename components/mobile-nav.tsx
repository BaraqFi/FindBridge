"use client"

import { useState, useEffect } from "react"
import { Menu, X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

/**
 * Mobile Navigation Component
 * 
 * Provides a collapsible mobile menu for navigation across all pages.
 * Includes the main navigation links and theme toggle functionality.
 */
interface MobileNavProps {
  currentPage?: "bridges" | "chains" | "resources"
}

export function MobileNav({ currentPage = "bridges" }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  // Prevent page scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <div className="md:hidden">
      {/* Mobile Menu Button */}
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          className="h-9 w-9"
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="flex flex-col h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <img 
                  src="/findbridge.png" 
                  alt="FindBridge Logo" 
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-xl font-bold text-foreground">FindBridge</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-8 bg-background/95 backdrop-blur-md">
              <div className="space-y-4">
                <Link
                  href="/"
                  className={`block text-lg font-medium transition-colors px-4 py-3 rounded-lg ${
                    currentPage === "bridges"
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Bridges
                </Link>
                <Link
                  href="/chains"
                  className={`block text-lg font-medium transition-colors px-4 py-3 rounded-lg ${
                    currentPage === "chains"
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Chains
                </Link>
                <Link
                  href="/resources"
                  className={`block text-lg font-medium transition-colors px-4 py-3 rounded-lg ${
                    currentPage === "resources"
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Resources
                </Link>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              {/* <div className="text-sm text-muted-foreground text-center">
                Cross-Chain Bridge Aggregator
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
