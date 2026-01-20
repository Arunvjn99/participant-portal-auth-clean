import { useState, useEffect, useRef } from "react";
import { AIFabPanel } from "./AIFabPanel";

/**
 * AIFab - Global floating AI search/chat component
 * Available on all pages, bottom-right corner
 */
export const AIFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Close when clicking outside (but not on the FAB itself)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        fabRef.current &&
        !fabRef.current.contains(target) &&
        !target.closest(".ai-fab-panel")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        onClick={handleToggle}
        className="ai-fab"
        aria-label="Search or ask anything"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <span className="ai-fab__icon" aria-hidden="true">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="ai-fab__tooltip">Search or ask anything</span>
      </button>

      {isOpen && <AIFabPanel onClose={() => setIsOpen(false)} />}
    </>
  );
};
