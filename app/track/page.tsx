import { TrackingForm } from '@/components/TrackingForm'
import Link from 'next/link'
import Image from 'next/image'

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-pcc-900 text-white py-0 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Image src="/pcclogo.png" alt="PCC Logo" width={40} height={40} className="rounded-full bg-white p-0.5" />
            <div>
              <h1 className="font-bold text-base md:text-lg tracking-tight leading-tight">Punjab Charities Commission</h1>
              <p className="text-pcc-300 text-xs font-urdu hidden md:block mt-1">پنجاب چیریٹیز کمیشن</p>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              <span className="hidden sm:inline">Submit New Complaint</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 pb-20">
        <TrackingForm />
      </main>

      {/* Footer */}
      <footer className="bg-pcc-950 border-t border-pcc-900 text-pcc-400 py-6 px-6 text-center">
        <p className="text-xs">&copy; {new Date().getFullYear()} Punjab Charities Commission. All rights reserved.</p>
      </footer>
    </div>
  )
}
