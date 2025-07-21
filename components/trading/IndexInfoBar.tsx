'use client'

import { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { IndexInfoModal } from './IndexInfoModal'

const mockIndexes = [
  'DOG_INDEX',
  'CAT_INDEX', 
  'MEME_INDEX',
  'AI_INDEX',
  'PEPE_INDEX'
]

export function IndexInfoBar() {
  const [selectedIndex, setSelectedIndex] = useState('DOG_INDEX')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6">
      {/* Index Selector */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
        >
          <span className="font-semibold text-white">{selectedIndex}</span>
          <ChevronDownIcon className="h-4 w-4 text-slate-400" />
        </button>
        
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10">
            {mockIndexes.map((index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedIndex(index)
                  setIsDropdownOpen(false)
                }}
                className="block w-full px-4 py-2 text-left hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
              >
                {index}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Info */}
      <div className="ml-8 flex items-center space-x-8">
        <div>
          <div className="text-2xl font-bold text-white">$1.2345</div>
          <div className="text-sm text-slate-400">Current Price</div>
        </div>
        
        <div>
          <div className="text-lg font-semibold text-green-400">+5.67%</div>
          <div className="text-sm text-slate-400">24h Change</div>
        </div>
        
        <div>
          <div className="text-lg text-white">$1.2890</div>
          <div className="text-sm text-slate-400">24h High</div>
        </div>
        
        <div>
          <div className="text-lg text-white">$1.1234</div>
          <div className="text-sm text-slate-400">24h Low</div>
        </div>
        
        <div>
          <div className="text-lg text-white">$2.34M</div>
          <div className="text-sm text-slate-400">24h Volume</div>
        </div>
        
        <div>
          <div className="text-lg text-yellow-400">0.05%</div>
          <div className="text-sm text-slate-400">Funding Rate</div>
        </div>
        
        <div>
          <div className="text-lg text-white">$12.34M</div>
          <div className="text-sm text-slate-400">Open Interest</div>
        </div>
      </div>

      {/* Info Button */}
      <div className="ml-auto">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white transition-colors"
        >
          Index Info
        </button>
      </div>

      {/* Index Info Modal */}
      <IndexInfoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        indexSymbol={selectedIndex}
      />
    </div>
  )
}