export function filter<T>(objects: T[], params: any): T[] {
  let filtered = objects;
  for (const key of Object.keys(params)) {
    filtered = filtered.filter((object: any) => object[key] === params[key]);
  }
  return filtered;
}
