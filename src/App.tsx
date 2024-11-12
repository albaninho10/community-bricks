import "./globals.css";
// import "./fonts.css";
import { HelmetProvider } from "react-helmet-async";
import { BreakpointProvider } from "@contexts/BreakpointContext";
import { AppContent } from "@navigation/AppContent";

export const App = () => {
  
  return (
    <BreakpointProvider>
      <HelmetProvider>
        <AppContent />
      </HelmetProvider>
    </BreakpointProvider>
  )
}
