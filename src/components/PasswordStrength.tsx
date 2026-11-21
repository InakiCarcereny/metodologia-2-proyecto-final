import type { JSX } from 'react';

interface PasswordStrengthProps {
  password: string;
}

type Strength = 'empty' | 'weak' | 'acceptable' | 'strong';

function getStrength(password: string): { level: number; label: Strength } {
  if (!password) return { label: 'empty', level: 0 };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: 'weak', level: 1 };
  if (score <= 2) return { label: 'acceptable', level: 2 };
  return { label: 'strong', level: 3 };
}

const STRENGTH_CONFIG: Record<Strength, { color: string; text: string }> = {
  acceptable: { color: '#eab308', text: 'aceptable' },
  empty: { color: '#e5e7eb', text: '' },
  strong: { color: '#16a34a', text: 'fuerte' },
  weak: { color: '#ef4444', text: 'débil' },
};

export function PasswordStrength({
  password,
}: PasswordStrengthProps): JSX.Element {
  const { level, label } = getStrength(password);
  const config = STRENGTH_CONFIG[label];
  const segments = [1, 2, 3];

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {segments.map((segment) => (
          <div
            className="h-1 w-6 rounded-full transition-colors"
            key={segment}
            style={{
              backgroundColor: segment <= level ? config.color : '#e5e7eb',
            }}
          />
        ))}
      </div>

      {label !== 'empty' && (
        <span className="text-[#8c9097] text-xs">{config.text}</span>
      )}
    </div>
  );
}
