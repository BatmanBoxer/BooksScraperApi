export function sanitizeList(list) {
  const sanitizedList = list.filter(element => {
    return element.name ? true : false
  });
  return sanitizedList;
}
