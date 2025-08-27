import Papa from 'papaparse'
import type { Dataset, Row } from '../types'

export async function loadCsv(path: string): Promise<{ rows: Dataset; columns: string[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(path, {
      download: true,
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as Record<string, string>[]
        if (!data || data.length === 0) return resolve({ rows: [], columns: [] })
        const columns = Object.keys(data[0])
        // convert all values to numbers for 'number' & mod columns, but keep as numbers converted to string when used in filters
        const rows: Row[] = data.map((r) => {
          const out: any = {}
          for (const k of columns) {
            const val = r[k]
            // try parse number first
            const num = Number(val)
            if (!Number.isNaN(num) && val.trim() !== '') out[k] = num
            else out[k] = val
          }
          return out
        })
        resolve({ rows, columns })
      },
      error: (err) => reject(err),
    })
  })
}
