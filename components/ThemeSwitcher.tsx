"use client";

import { IconDeviceDesktop2, IconMoon, IconSun } from "justd-icons";
import { useTheme } from "next-themes";
import { Button } from "ui";

export function ThemeSwitcher({
  shape = "square",
  appearance = "outline",
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const nextTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
  };

  return (
    <Button
      shape={shape}
      appearance={appearance}
      size="square-petite"
      aria-label="Switch theme"
      onPress={toggleTheme}
      {...props}
    >
      {theme === "light" ? (
        <IconSun />
      ) : theme === "dark" ? (
        <IconMoon />
      ) : (
        <IconDeviceDesktop2 />
      )}
    </Button>
  );
}
