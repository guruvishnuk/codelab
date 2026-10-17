"use client";

export default function ThemeToggle() {
  const toggle = () => {
    const root = document.querySelector(".home3d");
    if (!root) return;
    const current = root.getAttribute("data-theme");
    root.setAttribute("data-theme", current === "light" ? "dark" : "light");
  };

  return (
    <button onClick={toggle} className="btn sw" aria-label="Toggle theme" title="Toggle theme">
      ◐
    </button>
  );
}
