import Header from '@/components/common/Header'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function SetupPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header title="Initial Setup" />
        <div className="container mx-auto p-6">
          <p className="text-muted-foreground">Setup flow coming soon.</p>
        </div>
      </div>
    </ProtectedRoute>
  )
}