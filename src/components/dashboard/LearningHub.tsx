/**
 * Learning Hub - static cards: 401(k) Basics, Employer Match, Investment Strategy
 */
const LEARNING_ITEMS = [
  { id: "1", title: "401(k) Basics: Getting Started", icon: "book", readTime: "5 min read" },
  { id: "2", title: "Understanding Employer Match", icon: "doc", readTime: "3 min read" },
  { id: "3", title: "Choosing Your Investment Strategy", icon: "chart", readTime: "8 min read" },
];

export const LearningHub = () => (
  <article className="ped-learning">
    <h2 className="ped-learning__title">Learning Hub</h2>
    <div className="ped-learning__hero" aria-hidden>
      <div className="ped-learning__hero-bg" />
    </div>
    <ul className="ped-learning__list">
      {LEARNING_ITEMS.map((item) => (
        <li key={item.id} className="ped-learning__item">
          <span className="ped-learning__item-icon">
            {item.icon === "book" && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            )}
            {item.icon === "doc" && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            )}
            {item.icon === "chart" && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M3 3v18h18" />
                <path d="M7 16l4-4 4 4 5-5" />
              </svg>
            )}
          </span>
          <span className="ped-learning__item-title">{item.title}</span>
          <span className="ped-learning__item-time">{item.readTime}</span>
        </li>
      ))}
    </ul>
  </article>
);
