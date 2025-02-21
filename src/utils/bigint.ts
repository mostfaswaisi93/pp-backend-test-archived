export const bigint = {
  to: (entityValue: number) => entityValue.toString(),
  from: (databaseValue: string): number => {
    let val = parseInt(databaseValue, 10);
    if (isNaN(val)) return NaN;
    return val;
  },
};
