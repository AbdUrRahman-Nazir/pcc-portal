'use client'

import { cn } from '@/lib/utils'

export type Category = 'registration' | 'renewal' | 'observation' | 'misc'

interface CategoryTabsProps {
  selected: Category
  onChange: (category: Category) => void
}

const categories: { id: Category; labelEn: string; labelUr: string }[] = [
  { id: 'registration', labelEn: 'Registration', labelUr: 'رجسٹریشن' },
  { id: 'renewal', labelEn: 'Renewal', labelUr: 'تجدید' },
  { id: 'observation', labelEn: 'Observation', labelUr: 'اعتراض' },
  { id: 'misc', labelEn: 'Miscellaneous', labelUr: 'متفرق' },
]

export function CategoryTabs({ selected, onChange }: CategoryTabsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
      {categories.map((cat) => {
        const isSelected = selected === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={cn(
              "sleek-button flex flex-col items-center justify-center py-4 px-2 min-h-[5rem] transition-colors border-2",
              isSelected 
                ? "border-zinc-900 bg-zinc-900 text-white" 
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50"
            )}
          >
            <span className="text-sm md:text-base font-sans font-bold mb-2">{cat.labelEn}</span>
            <span className="text-sm md:text-base font-urdu leading-relaxed">{cat.labelUr}</span>
          </button>
        )
      })}
    </div>
  )
}
