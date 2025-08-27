export type Row = {
  // original number column
  number: number
  // dynamic other columns: mod3, mod4, mod5 ... They will be strings in CSV but keep as numbers here
  [col: string]: number | string
}

export type Dataset = Row[]

export type Filters = Record<string, Set<string>> // column -> selected values as strings

// message types for worker comms
export type WorkerInitMsg = { type: 'INIT'; payload: { rows: Row[]; columns: string[] } }
export type WorkerFilterMsg = { type: 'FILTER'; payload: { filters: Record<string, string[]> } }
export type WorkerResponseMsg = {
  type: 'RESULT'
  payload: {
    filteredIndices: number[]         // indices of rows that match all filters
    optionsByColumn: Record<string, string[]> // for each column X, options computed by applying all other filters (excl X)
    totalRows: number
  }
}
