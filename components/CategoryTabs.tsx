'use client'

import { cn } from '@/lib/utils'

export type Category = 'registration' | 'renewal' | 'observation' | 'misc'

interface CategoryTabsProps {
  selected: Category
  onChange: (category: Category) => void
}

const RegistrationIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></svg>
)

const RenewalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
)

const ObservationIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
)

const GeneralIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
)

const categories: { id: Category; labelEn: string; labelUr: string; color: string; activeColor: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'registration', labelEn: 'Registration', labelUr: 'رجسٹریشن', color: 'border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100', activeColor: 'border-blue-500 bg-blue-600 text-white shadow-sm', Icon: RegistrationIcon },
  { id: 'renewal', labelEn: 'Renewal', labelUr: 'تجدید', color: 'border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100', activeColor: 'border-teal-500 bg-teal-600 text-white shadow-sm', Icon: RenewalIcon },
  { id: 'observation', labelEn: 'Observation', labelUr: 'اعتراض', color: 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100', activeColor: 'border-amber-500 bg-amber-600 text-white shadow-sm', Icon: ObservationIcon },
  { id: 'misc', labelEn: 'General', labelUr: 'عمومی', color: 'border-slate-200 text-slate-700 bg-slate-100 hover:bg-slate-200', activeColor: 'border-slate-500 bg-slate-600 text-white shadow-sm', Icon: GeneralIcon },
]

export function CategoryTabs({ selected, onChange }: CategoryTabsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {categories.map((cat) => {
        const isSelected = selected === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={cn(
              "flex flex-col items-center justify-center py-4 px-3 min-h-[5rem] rounded-lg border-2 transition-colors duration-150 cursor-pointer",
              isSelected ? cat.activeColor : cat.color
            )}
          >
            <cat.Icon className={cn("mb-1.5", isSelected ? "opacity-100" : "opacity-70")} />
            <span className="text-sm md:text-base font-sans font-bold">{cat.labelEn}</span>
            <span className="text-xs md:text-sm font-urdu leading-relaxed mt-0.5">{cat.labelUr}</span>
          </button>
        )
      })}
    </div>
  )
}
