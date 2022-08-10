export const sleep = async (miliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, miliseconds));
};
