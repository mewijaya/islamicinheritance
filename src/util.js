export const findGCD = (x, y) => {
  if (!Number.isInteger(x)) return;
  if (y === 0) return x;
  else return findGCD(y, x % y);
};

export const findLCM = (data) => {
  if (!Array.isArray(data) && data.length < 2) return;

  let result = data[0];

  for (let index = 1; index < data.length; index++) {
    result = (data[index] * result) / findGCD(data[index], result);
  }

  return result;
};
