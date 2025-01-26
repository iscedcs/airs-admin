'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"

interface DateSelectorProps {
  frequency: 'all' | 'yearly' | 'monthly' | 'weekly' | 'daily'
}

const months = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
]

export function DateSelector({ frequency }: DateSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    const y = searchParams.get('y')
    const m = searchParams.get('m')
    const w = searchParams.get('w')
    const d = searchParams.get('d')

    if (y) {
      const newDate = new Date(parseInt(y), 0, 1)
      if (m) {
        newDate.setMonth(months.indexOf(m.toLowerCase()))
      }
      if (w) {
        const weekNum = parseInt(w.replace('week', ''))
        newDate.setDate((weekNum - 1) * 7 + 1)
      }
      if (d) {
        newDate.setDate(parseInt(d))
      }
      setSelectedDate(newDate)
    }
  }, [searchParams])

  const updateURL = (date: Date) => {
    const y = date.getFullYear()
    const m = months[date.getMonth()]
    const w = `week${Math.ceil(date.getDate() / 7)}`
    const d = date.getDate()
    
    let url = `/dashboard/history/${frequency}`
    if (frequency !== 'all') url += `?y=${y}`
    if (['monthly', 'weekly', 'daily'].includes(frequency)) url += `&m=${m}`
    if (['weekly', 'daily'].includes(frequency)) url += `&w=${w}`
    if (frequency === 'daily') url += `&d=${d}`
    
    router.push(url)
  }

  const handlePrevious = () => {
    const newDate = new Date(selectedDate)
    switch (frequency) {
      case 'daily':
        newDate.setDate(newDate.getDate() - 1)
        break
      case 'weekly':
        newDate.setDate(newDate.getDate() - 7)
        break
      case 'monthly':
        newDate.setMonth(newDate.getMonth() - 1)
        break
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() - 1)
        break
    }
    setSelectedDate(newDate)
    updateURL(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(selectedDate)
    switch (frequency) {
      case 'daily':
        newDate.setDate(newDate.getDate() + 1)
        break
      case 'weekly':
        newDate.setDate(newDate.getDate() + 7)
        break
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() + 1)
        break
    }
    setSelectedDate(newDate)
    updateURL(newDate)
  }

  const handleSelectChange = (value: string) => {
    const newDate = new Date(selectedDate)
    switch (frequency) {
      case 'daily':
        newDate.setDate(parseInt(value))
        break
      case 'weekly':
        newDate.setDate((parseInt(value.replace('week', '')) - 1) * 7 + 1)
        break
      case 'monthly':
        newDate.setMonth(months.indexOf(value))
        break
      case 'yearly':
        newDate.setFullYear(parseInt(value))
        break
    }
    setSelectedDate(newDate)
    updateURL(newDate)
  }

  const renderOptions = () => {
    switch (frequency) {
      case 'all':
        return null
      case 'yearly':
        const currentYear = new Date().getFullYear()
        return Array.from({ length: 10 }, (_, i) => (
          <SelectItem key={currentYear - i} value={(currentYear - i).toString()}>
            {currentYear - i}
          </SelectItem>
        ))
      case 'monthly':
        return months.map((month, index) => (
          <SelectItem key={month} value={month}>
            {new Date(selectedDate.getFullYear(), index, 1).toLocaleDateString('en-US', { month: 'long' })}
          </SelectItem>
        ))
      case 'weekly':
        return Array.from({ length: 5 }, (_, i) => (
          <SelectItem key={i + 1} value={`week${i + 1}`}>
            Week {i + 1}
          </SelectItem>
        ))
      case 'daily':
        return Array.from({ length: 31 }, (_, i) => (
          <SelectItem key={i + 1} value={(i + 1).toString()}>
            {new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
          </SelectItem>
        ))
    }
  }

  const getSelectValue = () => {
    switch (frequency) {
      case 'all':
        return 'All Time'
      case 'yearly':
        return selectedDate.getFullYear().toString()
      case 'monthly':
        return months[selectedDate.getMonth()]
      case 'weekly':
        return `week${Math.ceil(selectedDate.getDate() / 7)}`
      case 'daily':
        return selectedDate.getDate().toString()
    }
  }

  if (frequency === 'all') {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={handlePrevious}>
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <Select value={getSelectValue()} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            {frequency === 'yearly' && selectedDate.getFullYear()}
            {frequency === 'monthly' && selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            {frequency === 'weekly' && `Week ${Math.ceil(selectedDate.getDate() / 7)} of ${months[selectedDate.getMonth()]}`}
            {frequency === 'daily' && selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {renderOptions()}
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={handleNext}>
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

