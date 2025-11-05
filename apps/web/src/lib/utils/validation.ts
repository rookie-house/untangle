type Nullish<T> = T | null | undefined;

export const checkIfBigint = (value: Nullish<string>): value is string => {
  try {
    if (!value) {
      return false;
    }
    return Number(value).toString() !== BigInt(value).toString();
  } catch {
    return false;
  }
};

export const checkIfValidString = (value: Nullish<string>): value is string =>
  value !== undefined && value !== null && value.trim() !== '';
