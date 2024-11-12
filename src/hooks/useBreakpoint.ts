import { useMemo } from "react";
import { createGlobalState } from "react-use";

import type { DeviceType } from "@device/getDeviceType";
import { getDeviceType } from "@device/getDeviceType";
import { useEventListener } from "./useEventListener";

const useGlobalDeviceType = createGlobalState<DeviceType>(getDeviceType());

export type Device = {
  isMobile: boolean;
  isMobileOrTable: boolean;
  isTablet: boolean;
  isTabletOrDesktop: boolean;
  isDesktop: boolean;
  deviceType?: DeviceType;
};

export function useBreakpoint(): Device {
  const [deviceType, setDeviceType] = useGlobalDeviceType();

  const handleResize = () => {
    const newDeviceType = getDeviceType();
    if (deviceType !== newDeviceType) {
      setDeviceType(newDeviceType);
    }
  };

  useEventListener("resize", handleResize);

  return useMemo(() => {
    const breakpoints = {
      isMobile: deviceType === "mobile",
      isTablet: deviceType === "tablet",
      isDesktop: deviceType === "desktop",
    };
    return {
      ...breakpoints,
      isTabletOrDesktop: breakpoints.isTablet || breakpoints.isDesktop,
      isMobileOrTable: breakpoints.isMobile || breakpoints.isTablet,
      deviceType,
    };
  }, [deviceType]);
}
