"use client"

import { useState, useEffect, useCallback, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { X, Search } from 'lucide-react'
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

function CondensedFilterBarContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<FilterState>({
    munTypes: [],
    committees: [],
    location: '',
    tags: '',
    sortBy: 'date_asc',
  })

  const debouncedTags = useDebounce(filters.tags, 300)
  const debouncedLocation = useDebounce(filters.location, 300)

  // Load filters from URL
  useEffect(() => {
    const munTypes = searchParams.get('munTypes')?.split(',').filter(Boolean) || []
    const committees = searchParams.get('committees')?.split(',').filter(Boolean) || []
    const location = searchParams.get('location') || ''
    const tags = searchParams.get('tags') || ''
    const sortBy = searchParams.get('sortBy') || 'date_asc'

    setFilters({
      munTypes,
      committees,
      location,
      tags,
      sortBy,
    })
  }, [searchParams])

  // Update URL when filters change
  const updateURL = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams()
    
    if (newFilters.munTypes.length > 0) {
      params.set('munTypes', newFilters.munTypes.join(','))
    }
    if (newFilters.committees.length > 0) {
      params.set('committees', newFilters.committees.join(','))
    }
    if (newFilters.location.trim()) {
      params.set('location', newFilters.location.trim())
    }
    if (newFilters.tags.trim()) {
      params.set('tags', newFilters.tags.trim())
    }
    if (newFilters.sortBy !== 'date_asc') {
      params.set('sortBy', newFilters.sortBy)
    }

    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    
    router.push(newUrl, { scroll: false })
  }, [router, pathname])

  // Debounced URL updates for text inputs
  useEffect(() => {
    if (debouncedTags !== filters.tags) {
      updateURL({ ...filters, tags: debouncedTags })
    }
  }, [debouncedTags]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (debouncedLocation !== filters.location) {
      updateURL({ ...filters, location: debouncedLocation })
    }
  }, [debouncedLocation]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateFilter = (updates: Partial<FilterState>) => {
    const newFilters = { ...filters, ...updates }
    setFilters(newFilters)
    
    // For non-debounced fields, update URL immediately
    if (!('tags' in updates) && !('location' in updates)) {
      updateURL(newFilters)
    }
  }

  const toggleArrayFilter = (field: 'munTypes' | 'committees', value: string) => {
    const currentArray = filters[field]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    updateFilter({ [field]: newArray })
  }

  const hasActiveFilters = 
    filters.munTypes.length > 0 || 
    filters.committees.length > 0 || 
    filters.location.trim() !== '' || 
    filters.tags.trim() !== '' ||
    filters.sortBy !== 'date_asc'

  return (
    <div className="bg-card-background border border-card-border rounded-lg p-3">
      {/* Single Row Layout - All filters condensed */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[200px] max-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={filters.tags}
              onChange={(e) => updateFilter({ tags: e.target.value })}
              placeholder="Search events..."
              className="pl-10 h-9"
            />
          </div>
        </div>

        {/* Event Type Dropdown */}
        <Select 
          value={filters.munTypes.length > 0 ? filters.munTypes[0] : ""} 
          onValueChange={(value) => updateFilter({ munTypes: value ? [value] : [] })}
        >
          <SelectTrigger className="w-[130px] h-9">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {MUN_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Committee Dropdown */}
        <Select 
          value={filters.committees.length > 0 ? filters.committees[0] : ""} 
          onValueChange={(value) => updateFilter({ committees: value ? [value] : [] })}
        >
          <SelectTrigger className="w-[130px] h-9">
            <SelectValue placeholder="Committee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Committees</SelectItem>
            {COMMITTEES.map((committee) => (
              <SelectItem key={committee} value={committee}>
                {committee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location */}
        <div className="w-[120px]">
          <Input
            value={filters.location}
            onChange={(e) => updateFilter({ location: e.target.value })}
            placeholder="Location"
            className="h-9"
          />
        </div>

        {/* Sort Dropdown */}
        <Select value={filters.sortBy} onValueChange={(value) => updateFilter({ sortBy: value })}>
          <SelectTrigger className="w-[140px] h-9">
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

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              updateFilter({ 
                munTypes: [], 
                committees: [], 
                location: '', 
                tags: '', 
                sortBy: 'date_asc' 
              })
            }}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 px-3"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display - Compact */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-card-border">
          {filters.munTypes.map((type) => (
            <Badge key={`active-type-${type}`} variant="secondary" className="text-xs gap-1 h-5">
              {type}
              <X 
                className="w-2.5 h-2.5 cursor-pointer hover:text-destructive" 
                onClick={() => toggleArrayFilter('munTypes', type)}
              />
            </Badge>
          ))}
          {filters.committees.map((committee) => (
            <Badge key={`active-committee-${committee}`} variant="secondary" className="text-xs gap-1 h-5">
              {committee}
              <X 
                className="w-2.5 h-2.5 cursor-pointer hover:text-destructive" 
                onClick={() => toggleArrayFilter('committees', committee)}
              />
            </Badge>
          ))}
          {filters.location && (
            <Badge variant="secondary" className="text-xs gap-1 h-5">
              📍 {filters.location}
              <X 
                className="w-2.5 h-2.5 cursor-pointer hover:text-destructive" 
                onClick={() => updateFilter({ location: '' })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

export function CondensedFilterBar() {
  return (
    <Suspense fallback={<div className="h-12 bg-muted/50 rounded-lg animate-pulse"></div>}>
      <CondensedFilterBarContent />
    </Suspense>
  )
}