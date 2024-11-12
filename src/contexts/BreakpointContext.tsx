import type { Device } from "@hooks/useBreakpoint";
import { useBreakpoint } from "@hooks/useBreakpoint";
import { createContext, useContext } from "react";

type BreakpointContextState = Device;

const initialBreakpointState: BreakpointContextState = {
  isMobile: false,
  isMobileOrTable: false,
  isTablet: false,
  isTabletOrDesktop: false,
  isDesktop: false,
  deviceType: undefined,
};

const BreakpointContext = createContext<BreakpointContextState>(initialBreakpointState);

export const BreakpointProvider = ({ children }: any) => {
  const device = useBreakpoint();
  return <BreakpointContext.Provider value={device}>{children}</BreakpointContext.Provider>;
};

export const useBreakpointContext = () => useContext(BreakpointContext);
