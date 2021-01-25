/**
 * Turn anything into a pretty string.
 * Example:
 * true -> "Yes"
 * [1, 2, 3] -> "1\n2\n3"
 * "hello" -> "hello"
 */
export const toPrettyString = (o: any): string => {
  if (Array.isArray(o)) {
    return o.join("\n");
  }

  if (typeof o === "boolean") {
    return o ? "Yes" : "No";
  }

  return o;
};

export const hasValue = (o: any): boolean => {
  if (o === undefined || o === null) {
    return false;
  }

  if (Array.isArray(o)) {
    return o.length > 0;
  }

  if (typeof o === "boolean") {
    return true;
  }

  return o !== "";
};
