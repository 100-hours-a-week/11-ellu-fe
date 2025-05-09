export const changeTime = (input: string | Date): string => {
  const date = new Date(input);

  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const localTime = new Date(date.getTime() - offsetMs);

  return localTime.toISOString().slice(0, 19);
};
