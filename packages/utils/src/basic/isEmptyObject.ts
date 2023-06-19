export function isEmptyObject(target: Record<string, any>): boolean {
  const arr = Object.keys(target);
  return arr.length === 0;
}

export default isEmptyObject;