/// <reference types="vite/client" />

// For Web Workers
declare module "*?worker" {
  const worker: new () => Worker;
  export default worker;
}
