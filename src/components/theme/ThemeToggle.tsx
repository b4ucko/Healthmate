
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";

interface ThemeToggleProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ThemeToggle({ variant = "ghost", size = "icon" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full text-foreground"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-health-light-blue" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-health-blue" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
