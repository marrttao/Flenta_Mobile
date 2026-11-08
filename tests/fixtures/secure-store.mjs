const values = new Map();
let failure = null;

export function configureFailure(error) { failure = error; }
export function reset() { values.clear(); failure = null; }
export async function getItemAsync(key) {
  if (failure) throw failure;
  return values.get(key) ?? null;
}
export async function setItemAsync(key, value) {
  if (failure) throw failure;
  values.set(key, value);
}
export async function deleteItemAsync(key) {
  if (failure) throw failure;
  values.delete(key);
}
