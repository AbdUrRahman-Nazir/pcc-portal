import { SubmissionForm } from '@/components/SubmissionForm'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
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
            <Link href="/track" className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span className="hidden sm:inline">Track Complaint Status</span>
              <span className="sm:hidden">Track</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-pcc-900 text-white py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Complaint Management Portal</h2>
          <h3 className="text-xl md:text-2xl font-bold font-urdu text-pcc-200 mt-3">شکایت مینجمنٹ پورٹل</h3>
          <p className="text-pcc-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed mt-5">
            Submit your complaint to the Punjab Charities Commission. Select a category and fill out the details below.
          </p>
          <p className="text-pcc-400 text-sm font-urdu max-w-xl mx-auto leading-relaxed mt-2">
            پنجاب چیریٹیز کمیشن کو اپنی شکایت جمع کروائیں۔ ایک زمرہ منتخب کریں اور نیچے تفصیلات بھریں۔
          </p>
        </div>
      </div>

      <main className="flex-1 px-4 pb-16 -mt-6">
        <SubmissionForm />
      </main>

      {/* Footer */}
      <footer className="bg-pcc-950 border-t border-pcc-900 text-pcc-400 py-10 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image src="/pcclogo.png" alt="PCC" width={32} height={32} className="rounded-full bg-white p-0.5 opacity-80" />
            <span className="text-sm font-semibold text-pcc-200">Punjab Charities Commission</span>
          </div>
          <p className="text-xs text-pcc-400">Home Department, Punjab Civil Secretariat</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs">
            <a href="mailto:contact@charitycommission.punjab.gov.pk" className="flex items-center gap-1.5 hover:text-pcc-200 transition-colors duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              contact@charitycommission.punjab.gov.pk
            </a>
            <a href="tel:042-35713585" className="flex items-center gap-1.5 hover:text-pcc-200 transition-colors duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              042-35713585
            </a>
            <a href="https://wa.me/923134995564" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-pcc-200 transition-colors duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              0313-4995564
            </a>
          </div>
          <div className="border-t border-pcc-900 pt-4 mt-4">
            <p className="text-xs text-pcc-500">&copy; {new Date().getFullYear()} Punjab Charities Commission. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
