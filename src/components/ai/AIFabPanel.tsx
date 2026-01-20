import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { detectIntent, generateResponse, type AIResponse } from "../../utils/aiIntentDetection";

// Optional enrollment context - may not be available on all pages
// Using a hook wrapper that safely handles missing context
const useEnrollmentSafe = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useEnrollment } = require("../../enrollment/context/EnrollmentContext");
    return useEnrollment();
  } catch {
    return null;
  }
};

interface AIFabPanelProps {
  onClose: () => void;
}

/**
 * AIFabPanel - Overlay panel for AI search/chat
 * Supports search, Q&A, and action launching
 */
export const AIFabPanel = ({ onClose }: AIFabPanelProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Safely get enrollment context (may not be available on all pages)
  const enrollment = useEnrollmentSafe();
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ query: string; response: AIResponse }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus input when panel opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Focus trap
  useEffect(() => {
    if (!panelRef.current) return;

    const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    panelRef.current.addEventListener("keydown", handleTabKey);
    return () => {
      panelRef.current?.removeEventListener("keydown", handleTabKey);
    };
  }, []);

  // Determine user context
  const userContext = useMemo(() => {
    const isEnrolled = enrollment?.state?.selectedPlan !== null;
    const isInEnrollmentFlow = location.pathname.startsWith("/enrollment");
    const isPostEnrollment = location.pathname.startsWith("/dashboard/post-enrollment");
    const currentRoute = location.pathname;

    return {
      isEnrolled,
      isInEnrollmentFlow,
      isPostEnrollment,
      currentRoute,
      selectedPlan: enrollment?.state?.selectedPlan || null,
      contributionAmount: enrollment?.state?.contributionAmount || 0,
    };
  }, [location.pathname, enrollment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const currentQuery = query.trim();
    setQuery("");
    setIsLoading(true);

    // Detect intent
    const intent = detectIntent(currentQuery, userContext);

    // Generate response (mocked AI)
    const aiResponse = generateResponse(intent, currentQuery, userContext);

    setResponse(aiResponse);
    setHistory((prev) => [...prev, { query: currentQuery, response: aiResponse }]);
    setIsLoading(false);

    // Auto-focus input after response
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleAction = (route: string) => {
    navigate(route);
    onClose();
  };

  const handleClear = () => {
    setQuery("");
    setResponse(null);
    setHistory([]);
    inputRef.current?.focus();
  };

  return (
    <div className="ai-fab-panel-overlay" role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className="ai-fab-panel"
        role="dialog"
        aria-modal="true"
        aria-label="AI Search and Assistant"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ai-fab-panel__header">
          <div className="ai-fab-panel__header-content">
            <h2 className="ai-fab-panel__title">AI Assistant</h2>
            <p className="ai-fab-panel__subtitle">Search, ask questions, or find actions</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ai-fab-panel__close-button"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="ai-fab-panel__form">
          <div className="ai-fab-panel__input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or ask anything..."
              className="ai-fab-panel__input"
              aria-label="Search or ask a question"
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="ai-fab-panel__submit-button"
              aria-label="Submit"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Response Area */}
        <div className="ai-fab-panel__content">
          {isLoading && (
            <div className="ai-fab-panel__loading">
              <div className="ai-fab-panel__loading-spinner" aria-label="Loading" />
              <span>Thinking...</span>
            </div>
          )}

          {!isLoading && response && (
            <div className="ai-fab-panel__response">
              <div className="ai-fab-panel__response-answer">
                <p>{response.answer}</p>
              </div>

              {response.dataSnippet && (
                <div className="ai-fab-panel__response-data">
                  <div className="ai-fab-panel__data-snippet">
                    {response.dataSnippet}
                  </div>
                </div>
              )}

              {response.primaryAction && (
                <div className="ai-fab-panel__actions">
                  <Button
                    onClick={() => handleAction(response.primaryAction!.route)}
                    className="ai-fab-panel__action-button ai-fab-panel__action-button--primary"
                  >
                    {response.primaryAction.label}
                  </Button>
                  {response.secondaryAction && (
                    <Button
                      onClick={() => handleAction(response.secondaryAction!.route)}
                      className="ai-fab-panel__action-button ai-fab-panel__action-button--secondary"
                    >
                      {response.secondaryAction.label}
                    </Button>
                  )}
                </div>
              )}

              {response.disclaimer && (
                <p className="ai-fab-panel__disclaimer">{response.disclaimer}</p>
              )}
            </div>
          )}

          {!isLoading && !response && history.length === 0 && (
            <div className="ai-fab-panel__empty">
              <p className="ai-fab-panel__empty-text">Try asking:</p>
              <ul className="ai-fab-panel__suggestions">
                <li
                  onClick={() => {
                    setQuery("What's my contribution percentage?");
                    inputRef.current?.focus();
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setQuery("What's my contribution percentage?");
                      inputRef.current?.focus();
                    }
                  }}
                >
                  "What's my contribution percentage?"
                </li>
                <li
                  onClick={() => {
                    setQuery("Show me my investment allocation");
                    inputRef.current?.focus();
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setQuery("Show me my investment allocation");
                      inputRef.current?.focus();
                    }
                  }}
                >
                  "Show me my investment allocation"
                </li>
                <li
                  onClick={() => {
                    setQuery("How do I change beneficiaries?");
                    inputRef.current?.focus();
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setQuery("How do I change beneficiaries?");
                      inputRef.current?.focus();
                    }
                  }}
                >
                  "How do I change beneficiaries?"
                </li>
                <li
                  onClick={() => {
                    setQuery("Where can I view transactions?");
                    inputRef.current?.focus();
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setQuery("Where can I view transactions?");
                      inputRef.current?.focus();
                    }
                  }}
                >
                  "Where can I view transactions?"
                </li>
              </ul>
            </div>
          )}

          {/* History */}
          {history.length > 0 && !response && !isLoading && (
            <div className="ai-fab-panel__history">
              {history.map((item, idx) => (
                <div key={idx} className="ai-fab-panel__history-item">
                  <div className="ai-fab-panel__history-query">{item.query}</div>
                  <div className="ai-fab-panel__history-response">{item.response.answer}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ai-fab-panel__footer">
          <p className="ai-fab-panel__footer-text">
            This is general information, not financial advice. All actions require your confirmation.
          </p>
          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="ai-fab-panel__clear-button"
            >
              Clear history
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
