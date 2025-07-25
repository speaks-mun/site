"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { X, Filter, Search } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

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

export function FilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>({
    munTypes: searchParams.get('munTypes')?.split(',').filter(Boolean) || [],
    committees: searchParams.get('committees')?.split(',').filter(Boolean) || [],
    location: searchParams.get('location') || '',
    tags: searchParams.get('tags') || '',
    sortBy: searchParams.get('sortBy') || 'date_asc',
  })

  // Debounced values for text inputs
  const debouncedLocation = useDebounce(filters.location, 300)
  const debouncedTags = useDebounce(filters.tags, 300)

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    
    if (filters.munTypes.length > 0) {
      params.set('munTypes', filters.munTypes.join(','))
    }
    if (filters.committees.length > 0) {
      params.set('committees', filters.committees.join(','))
    }
    if (debouncedLocation) {
      params.set('location', debouncedLocation)
    }
    if (debouncedTags) {
      params.set('tags', debouncedTags)
    }
    if (filters.sortBy !== 'date_asc') {
      params.set('sortBy', filters.sortBy)
    }

    const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(newURL)
  }, [filters, debouncedLocation, debouncedTags, pathname, router])

  // Update URL when debounced values change
  useEffect(() => {
    updateURL()
  }, [updateURL])

  const toggleMunType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      munTypes: prev.munTypes.includes(type)
        ? prev.munTypes.filter(t => t !== type)
        : [...prev.munTypes, type]
    }))
  }

  const toggleCommittee = (committee: string) => {
    setFilters(prev => ({
      ...prev,
      committees: prev.committees.includes(committee)
        ? prev.committees.filter(c => c !== committee)
        : [...prev.committees, committee]
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      munTypes: [],
      committees: [],
      location: '',
      tags: '',
      sortBy: 'date_asc',
    })
  }

  const hasActiveFilters = 
    filters.munTypes.length > 0 || 
    filters.committees.length > 0 || 
    filters.location || 
    filters.tags || 
    filters.sortBy !== 'date_asc'

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-body-text" />
          <Input
            placeholder="Search location or city..."
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="pl-10"
          />
        </div>

        {/* Tags Input */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search tags or keywords..."
            value={filters.tags}
            onChange={(e) => setFilters(prev => ({ ...prev, tags: e.target.value }))}
          />
        </div>

        {/* Sort Select */}
        <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </Button>
        )}
      </div>

      {/* MUN Types */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-heading-text">MUN Type</h4>
        <div className="flex flex-wrap gap-2">
          {MUN_TYPES.map((type) => (
            <Badge
              key={type}
              variant={filters.munTypes.includes(type) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                filters.munTypes.includes(type)
                  ? 'bg-primary-cta text-white hover:bg-primary-cta/90'
                  : 'hover:bg-muted'
              }`}
              onClick={() => toggleMunType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Committees */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-heading-text">Committees</h4>
        <div className="flex flex-wrap gap-2">
          {COMMITTEES.map((committee) => (
            <Badge
              key={committee}
              variant={filters.committees.includes(committee) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                filters.committees.includes(committee)
                  ? 'bg-primary-cta text-white hover:bg-primary-cta/90'
                  : 'hover:bg-muted'
              }`}
              onClick={() => toggleCommittee(committee)}
            >
              {committee}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-body-text">Active filters:</span>
          {filters.munTypes.map(type => (
            <Badge key={`mun-${type}`} variant="secondary" className="text-xs">
              {type}
            </Badge>
          ))}
          {filters.committees.map(committee => (
            <Badge key={`committee-${committee}`} variant="secondary" className="text-xs">
              {committee}
            </Badge>
          ))}
          {filters.location && (
            <Badge variant="secondary" className="text-xs">
              📍 {filters.location}
            </Badge>
          )}
          {filters.tags && (
            <Badge variant="secondary" className="text-xs">
              🏷️ {filters.tags}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
} 