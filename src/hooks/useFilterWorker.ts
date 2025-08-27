import { useEffect, useRef, useState } from 'react'
import type { Row } from '../types'
import type { WorkerResponseMsg } from '../types'

// typed worker import
export function useFilterWorker(rows: Row[], columns: string[]) {
  const workerRef = useRef<Worker | null>(null)
  const [filteredIndices, setFilteredIndices] = useState<number[]>([])
  const [optionsByColumn, setOptionsByColumn] = useState<Record<string, string[]>>({})
  const [totalRows, setTotalRows] = useState<number>(0)
  const lastFiltersRef = useRef<Record<string, string[]>>({})

  useEffect(() => {
    if (!rows || rows.length === 0) return
    workerRef.current?.terminate()
    workerRef.current = new Worker(new URL('../workers/filter.worker.ts', import.meta.url), { type: 'module' })
    workerRef.current.onmessage = (ev: MessageEvent) => {
      const msg = ev.data as WorkerResponseMsg
      if (msg.type === 'RESULT') {
        setFilteredIndices(msg.payload.filteredIndices)
        setOptionsByColumn(msg.payload.optionsByColumn)
        setTotalRows(msg.payload.totalRows)
      }
    }
    // init
    workerRef.current.postMessage({ type: 'INIT', payload: { rows, columns } })
    return () => {
      workerRef.current?.terminate()
    }
  }, [rows, columns])

  // call when filters change
  const applyFilters = (filters: Record<string, string[]>) => {
    lastFiltersRef.current = filters
    workerRef.current?.postMessage({ type: 'FILTER', payload: { filters } })
  }

  return { filteredIndices, optionsByColumn, totalRows, applyFilters }
}
