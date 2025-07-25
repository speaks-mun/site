import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  subtitle: string
  actionButtons?: React.ReactNode
}

export function EmptyState({ title, subtitle, actionButtons }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h8a2 2 0 012 2v4M6 13h12"
          />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold text-heading-text mb-2 text-center">
        {title}
      </h3>
      
      <p className="text-body-text text-center max-w-md mb-6">
        {subtitle}
      </p>
      
      {actionButtons && (
        <div className="flex flex-col sm:flex-row gap-3">
          {actionButtons}
        </div>
      )}
    </div>
  )
} 