import { SubmissionForm } from '@/components/SubmissionForm'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="bg-white border-b border-border py-4 px-6 md:px-10 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="font-bold text-lg tracking-tight">Punjab Charity Commission</h1>
          <p className="text-xs text-zinc-500 font-urdu hidden md:block mt-1">پنجاب چیریٹی کمیشن</p>
        </div>
        <nav>
          <Link href="/track" className="sleek-button-outline">
            <span className="mr-2">Track Status</span>
            <span className="font-urdu text-xs">سٹیٹس چیک کریں</span>
          </Link>
        </nav>
      </header>

      <main className="flex-1 px-4 pb-20">
        <SubmissionForm />
      </main>

      <footer className="bg-zinc-900 border-t border-zinc-800 text-zinc-400 py-6 px-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Punjab Charity Commission. All rights reserved.</p>
      </footer>
    </div>
  );
}
