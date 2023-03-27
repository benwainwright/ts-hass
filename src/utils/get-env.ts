export const getEnv = (key: string) => {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Please set ${key}`);
  }
  return val;
};
