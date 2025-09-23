import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function BridgeCardSkeleton() {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted animate-pulse rounded w-32" />
          <div className="h-6 bg-muted animate-pulse rounded w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 bg-muted animate-pulse rounded w-8 mb-1" />
            <div className="h-6 bg-muted animate-pulse rounded w-16" />
          </div>
          <div>
            <div className="h-4 bg-muted animate-pulse rounded w-16 mb-1" />
            <div className="h-6 bg-muted animate-pulse rounded w-12" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded w-24" />
          <div className="h-4 bg-muted animate-pulse rounded w-full" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        </div>
        <div className="h-10 bg-muted animate-pulse rounded w-full" />
      </CardContent>
    </Card>
  )
}

export function MarketSummarySkeleton() {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 bg-muted animate-pulse rounded w-16 mb-1" />
            <div className="h-8 bg-muted animate-pulse rounded w-20 mb-1" />
            <div className="h-4 bg-muted animate-pulse rounded w-12" />
          </div>
          <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}
