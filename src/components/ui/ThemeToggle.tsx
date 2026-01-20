import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Initialize from localStorage or default to light
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    // Remove existing theme classes
    document.documentElement.classList.remove("light", "dark");
    // Add current theme class
    document.documentElement.classList.add(theme);
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {theme === "light" ? "🌙" : "☀️"}
      </span>
    </button>
  );
};

export default ThemeToggle;
