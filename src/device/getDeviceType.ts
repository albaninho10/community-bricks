export type DeviceType = "mobile" | "tablet" | "desktop";

export enum Breakpoints {
  XXL = 1536,
  XL = 1280,
  L = 1024,
  M = 768,
  S = 640,
}

export const getDeviceType = (): DeviceType => {
  const width = window.innerWidth;
  if (width < Breakpoints.S) {
    return "mobile";
  } else if (width >= Breakpoints.S && width <= Breakpoints.L) {
    return "tablet";
  } else {
    return "desktop";
  }
};
