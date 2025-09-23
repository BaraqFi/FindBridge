"use client"

import { useState, useEffect } from "react"
import { Construction } from "lucide-react"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
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
    <div className="min-h-screen bg-background gradient-bg">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-sm bg-background/80 transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/findbridge.png" 
                alt="FindBridge Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold text-foreground">FindBridge</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Bridges
              </Link>
              <Link href="/chains" className="text-muted-foreground hover:text-foreground transition-colors">
                Chains
              </Link>
              <Link href="/resources" className="text-primary font-medium">
                Resources
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <div className="hidden md:block">
                <div className="w-9 h-9" />
              </div>
              <MobileNav currentPage="resources" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="text-center">
          {/* Construction Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <Construction className="h-12 w-12 text-primary" />
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Under Development
          </h1>
        </div>
      </div>

    </div>
  )
}
