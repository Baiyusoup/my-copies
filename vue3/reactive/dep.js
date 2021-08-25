export function createDep(effects) {
  const dep = new Set(effects)
  dep.w = 0
  dep.n = 0
  return dep
}