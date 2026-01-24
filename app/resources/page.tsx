"use client"

import { useState, useEffect } from "react"
import { Construction } from "lucide-react"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

/**
 * Resources Page Component
 * 
 * Displays an "under development" message for the resources section.
 * This page will be expanded in the future to include documentation,
 * guides, and other helpful resources for users.
 */
export default function ResourcesPage() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)

  // Handle scroll behavior to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.querySelector('main') || document.querySelector('.resources-content')
      if (mainContent) {
        const rect = mainContent.getBoundingClientRect()
        // Hide header when main content is in view
        setIsHeaderVisible(rect.top > 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background gradient-bg noise-texture">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 border-[4px] border-black bg-white transition-all duration-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <img 
                src="/findbridge.png" 
                alt="FindBridge Logo" 
                className="w-8 h-8 rounded-lg transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-xl font-extrabold text-foreground">FindBridge</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium link-hover">
                Bridges
              </Link>
              <Link href="/chains" className="text-muted-foreground hover:text-foreground transition-colors font-medium link-hover">
                Chains
              </Link>
              <Link href="/resources" className="text-primary font-semibold link-hover">
                Resources
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              <MobileNav currentPage="resources" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="text-center">
          {/* Construction Icon */}
          <div className="flex justify-center mb-10">
            <div className="w-32 h-32 border-[4px] border-black bg-white flex items-center justify-center shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
              <Construction className="h-16 w-16 text-black stroke-[2.5]" />
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">
            Under Development
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're working hard to bring you comprehensive resources and guides. Check back soon!
          </p>
        </div>
      </div>

    </div>
  )
}
