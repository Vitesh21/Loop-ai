import type { Row, WorkerInitMsg, WorkerFilterMsg, WorkerResponseMsg } from '../types'

/**
 * Worker notes:
 * - On INIT it receives rows & columns, builds maps: column -> value -> Set(indices)
 * - On FILTER: given filters (column -> selected array), it computes the intersection of selected sets (AND)
 * - To produce options for column X: apply all filters except X to produce the filtered set, then collect unique values of X in that set
 */

let rows: Row[] = []
let columns: string[] = []
let indexMap: Record<string, Map<string, Set<number>>> = {}

function buildIndices(r: Row[], cols: string[]) {
  indexMap = {}
  rows = r
  columns = cols
  const n = r.length
  for (const col of cols) {
    const map = new Map<string, Set<number>>()
    for (let i = 0; i < n; i++) {
      const v = String(r[i][col])
      if (!map.has(v)) map.set(v, new Set())
      map.get(v)!.add(i)
    }
    indexMap[col] = map
  }
}

// utility to intersect sets of indices
function intersectSets(sets: Set<number>[]) {
  if (sets.length === 0) return null
  // choose smallest set to iterate
  sets.sort((a, b) => a.size - b.size)
  const base = sets[0]
  const res = new Set<number>()
  for (const val of base) {
    let ok = true
    for (let i = 1; i < sets.length; i++) {
      if (!sets[i].has(val)) { ok = false; break }
    }
    if (ok) res.add(val)
  }
  return res
}

// produce filtered indices for given filters (all columns): each column may have 0 or many selections
function computeFilteredIndices(filters: Record<string, string[]>): number[] {
  const setsToIntersect: Set<number>[] = []
  for (const col of columns) {
    const sel = filters[col]
    if (sel && sel.length > 0) {
      // union of values within same column (OR within column)
      let union = new Set<number>()
      for (const v of sel) {
        const s = indexMap[col].get(String(v))
        if (!s) continue
        for (const idx of s) union.add(idx)
      }
      setsToIntersect.push(union)
    }
  }
  if (setsToIntersect.length === 0) {
    // no filters => all rows
    return rows.map((_, i) => i)
  }
  const inter = intersectSets(setsToIntersect)
  return inter ? Array.from(inter) : []
}

// compute options for each column X by applying filters excluding X
function computeOptionsByColumn(filters: Record<string, string[]>): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const col of columns) {
    // build filters excluding this column
    const otherFilters: Record<string, string[]> = {}
    for (const k of Object.keys(filters)) {
      if (k === col) continue
      otherFilters[k] = filters[k]
    }
    // compute indices after applying other filters:
    const setsToIntersect: Set<number>[] = []
    for (const k of columns) {
      const sel = otherFilters[k]
      if (sel && sel.length > 0) {
        let union = new Set<number>()
        for (const v of sel) {
          const s = indexMap[k].get(String(v))
          if (!s) continue
          for (const idx of s) union.add(idx)
        }
        setsToIntersect.push(union)
      }
    }
    let baseIdxs: number[]
    if (setsToIntersect.length === 0) baseIdxs = rows.map((_, i) => i)
    else {
      const inter = intersectSets(setsToIntersect)
      baseIdxs = inter ? Array.from(inter) : []
    }
    // gather unique values of col across baseIdxs
    const valuesSet = new Set<string>()
    for (const idx of baseIdxs) {
      valuesSet.add(String(rows[idx][col]))
    }
    out[col] = Array.from(valuesSet).sort((a, b) => {
      // numeric sort first if numbers
      const na = Number(a), nb = Number(b)
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
      return a.localeCompare(b)
    })
  }
  return out
}

self.onmessage = (ev: MessageEvent<any>) => {
  const msg = ev.data as WorkerInitMsg | WorkerFilterMsg
  if (msg.type === 'INIT') {
    buildIndices(msg.payload.rows, msg.payload.columns)
    // emit initial result (no filters)
    const filteredIndices = rows.map((_, i) => i)
    const optionsByColumn = computeOptionsByColumn({})
    const res: WorkerResponseMsg = { type: 'RESULT', payload: { filteredIndices, optionsByColumn, totalRows: rows.length } }
    // @ts-ignore
    self.postMessage(res)
  }
  else if (msg.type === 'FILTER') {
    const filters = msg.payload.filters || {}
    const filteredIndices = computeFilteredIndices(filters)
    const optionsByColumn = computeOptionsByColumn(filters)
    const res: WorkerResponseMsg = { type: 'RESULT', payload: { filteredIndices, optionsByColumn, totalRows: rows.length } }
    // @ts-ignore
    self.postMessage(res)
  }
}
