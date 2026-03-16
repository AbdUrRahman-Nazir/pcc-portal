import { TrackingForm } from '@/components/TrackingForm'
import Link from 'next/link'

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="bg-white border-b border-border py-4 px-6 md:px-10 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="font-bold text-lg tracking-tight">Punjab Charity Commission</h1>
        </div>
        <nav>
          <Link href="/" className="sleek-button-outline">
            <span className="mr-2">Back to Forms</span>
            <span className="font-urdu text-xs">واپس جائیں</span>
          </Link>
        </nav>
      </header>

      <main className="flex-1 px-4 pb-20">
        <TrackingForm />
      </main>
    </div>
  )
}
