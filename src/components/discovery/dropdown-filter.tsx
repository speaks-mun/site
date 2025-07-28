"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Filter, Check } from 'lucide-react'

const MUN_TYPES = ['Conference', 'Workshop', 'Simulation']
const COMMITTEES = ['UNSC', 'ECOSOC', 'WHO', 'UNICEF', 'UNHRC', 'DISEC', 'SPECPOL']
const SORT_OPTIONS = [
  { value: 'date_asc', label: 'Date (Earliest)' },
  { value: 'date_desc', label: 'Date (Latest)' },
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
]

interface FilterState {
  munTypes: string[]
  committees: string[]
  location: string
  tags: string
  sortBy: string
}

interface DropdownFilterProps {
  onFiltersChange: (filters: FilterState) => void
  initialFilters?: FilterState
}

export function DropdownFilter({ onFiltersChange, initialFilters }: DropdownFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempFilters, setTempFilters] = useState<FilterState>(
    initialFilters || {
      munTypes: [],
      committees: [],
      location: '',
      tags: '',
      sortBy: 'date_asc',
    }
  )

  const [activeFilters, setActiveFilters] = useState<FilterState>(
    initialFilters || {
      munTypes: [],
      committees: [],
      location: '',
      tags: '',
      sortBy: 'date_asc',
    }
  )

  const toggleMunType = (type: string) => {
    setTempFilters(prev => ({
      ...prev,
      munTypes: prev.munTypes.includes(type)
        ? prev.munTypes.filter(t => t !== type)
        : [...prev.munTypes, type]
    }))
  }

  const toggleCommittee = (committee: string) => {
    setTempFilters(prev => ({
      ...prev,
      committees: prev.committees.includes(committee)
        ? prev.committees.filter(c => c !== committee)
        : [...prev.committees, committee]
    }))
  }

  const handleSave = () => {
    setActiveFilters(tempFilters)
    onFiltersChange(tempFilters)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempFilters(activeFilters)
    setIsOpen(false)
  }

  const clearAllFilters = () => {
    const emptyFilters = {
      munTypes: [],
      committees: [],
      location: '',
      tags: '',
      sortBy: 'date_asc',
    }
    setTempFilters(emptyFilters)
  }

  const getActiveFilterCount = () => {
    return (
      activeFilters.munTypes.length +
      activeFilters.committees.length +
      (activeFilters.location ? 1 : 0) +
      (activeFilters.tags ? 1 : 0) +
      (activeFilters.sortBy !== 'date_asc' ? 1 : 0)
    )
  }

  return (
    <div className="relative">
      {/* Filter Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`gap-2 ${getActiveFilterCount() > 0 ? 'border-primary-cta text-primary-cta' : ''}`}
      >
        <Filter className="w-4 h-4" />
        Filters
        {getActiveFilterCount() > 0 && (
          <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
            {getActiveFilterCount()}
          </Badge>
        )}
      </Button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={handleCancel} />
          
          {/* Filter Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-xl z-50 max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filter Events</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Location */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="Enter city or venue..."
                    value={tempFilters.location}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                {/* MUN Types */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Event Type</label>
                  <div className="flex flex-wrap gap-2">
                    {MUN_TYPES.map((type) => (
                      <Badge
                        key={type}
                        variant={tempFilters.munTypes.includes(type) ? "default" : "outline"}
                        className={`cursor-pointer hover:bg-primary-cta hover:text-white ${
                          tempFilters.munTypes.includes(type) 
                            ? 'bg-primary-cta text-white' 
                            : 'bg-background'
                        }`}
                        onClick={() => toggleMunType(type)}
                      >
                        {type}
                        {tempFilters.munTypes.includes(type) && (
                          <Check className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Committees */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Committees</label>
                  <div className="flex flex-wrap gap-2">
                    {COMMITTEES.map((committee) => (
                      <Badge
                        key={committee}
                        variant={tempFilters.committees.includes(committee) ? "default" : "outline"}
                        className={`cursor-pointer hover:bg-primary-cta hover:text-white ${
                          tempFilters.committees.includes(committee) 
                            ? 'bg-primary-cta text-white' 
                            : 'bg-background'
                        }`}
                        onClick={() => toggleCommittee(committee)}
                      >
                        {committee}
                        {tempFilters.committees.includes(committee) && (
                          <Check className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <Input
                    placeholder="Enter tags (comma-separated)..."
                    value={tempFilters.tags}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, tags: e.target.value }))}
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SORT_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        variant={tempFilters.sortBy === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTempFilters(prev => ({ ...prev, sortBy: option.value }))}
                        className={`${
                          tempFilters.sortBy === option.value 
                            ? 'bg-primary-cta text-white hover:bg-primary-cta/90' 
                            : ''
                        }`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-primary-cta text-white hover:bg-primary-cta/90"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 