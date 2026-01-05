export function filterProperties(properties, search) {
  return properties.filter((p) => {
    if (search.minPrice && p.price < search.minPrice) return false;
    return true;
  });
}
