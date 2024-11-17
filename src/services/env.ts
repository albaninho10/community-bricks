export const isProduction = () => getEnv() === "production";
export const isStaging = () => getEnv() === "staging";

export type Env = ReturnType<typeof getEnv>;
export const getEnv = () => {
  const hostname = window?.location?.hostname;

  switch (hostname) {
    case "www.fedr.club":
      return "production";
    case "staging.fedr.club":
      return "staging";
    default:
      return "development";
  }
};
