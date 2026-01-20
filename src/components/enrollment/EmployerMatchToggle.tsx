interface EmployerMatchToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const EmployerMatchToggle = ({ enabled, onToggle }: EmployerMatchToggleProps) => {
  return (
    <div className="employer-match-toggle">
      <label className="employer-match-toggle__label">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="employer-match-toggle__input"
          aria-label="Enable employer match"
        />
        <span className="employer-match-toggle__text">Employer match</span>
      </label>
    </div>
  );
};
