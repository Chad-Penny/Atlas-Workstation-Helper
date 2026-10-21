import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Theme = "light" | "dark";
const AppearanceContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem("atlas-theme"); } catch { /* Use device preference if storage is blocked. */ }
    setTheme(stored === "dark" || stored === "light" ? stored : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem("atlas-theme", theme); } catch { /* Keep the selected theme for this session. */ }
  }, [theme, ready]);
  return <AppearanceContext.Provider value={{ theme, toggle: () => setTheme((current) => current === "light" ? "dark" : "light") }}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error("Appearance controls require AppearanceProvider");
  return context;
}

export function ThemeToggle() {
  const { theme, toggle } = useAppearance();
  const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";
  return <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={toggle} aria-label={label} title={label} className="shrink-0">{theme === "light" ? <Moon /> : <Sun />}</Button></TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>;
}