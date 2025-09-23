import { Twitter, ExternalLink } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left side - Copyright and Twitter */}
          <div className="flex items-center space-x-6">
            <p className="text-muted-foreground text-sm">© 2025 FindBridge. All rights reserved.</p>
            <Link
              href="https://x.com/findbridge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Follow us on X</span>
            </Link>
          </div>

          {/* Right side - Created by */}
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground text-sm">Created by:</span>
            <Link
              href="https://x.com/baraqfi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors flex items-center space-x-1 group"
            >
              <span className="font-medium">BaraqFi</span>
              <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
