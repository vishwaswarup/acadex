import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Acadex</h1>
          <p className="text-muted-foreground">Grade smarter.</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}