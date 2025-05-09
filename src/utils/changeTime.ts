export const changeTime = (date: any) => {
  const inputDate = new Date(date);

  const toLocalISOString = (date: any) => {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000; // 분 단위 오프셋을 ms로
    const localTime = new Date(date.getTime() - offsetMs);
    return localTime.toISOString().slice(0, 19);
  };

  return toLocalISOString(inputDate);
};
