import Link from 'next/link';
import type { JSX } from 'react';

const LEGAL_LINKS: string[] = ['Normas', 'Privacidad', 'Estado del servicio'];

export function LegalFooter(): JSX.Element {
  return (
    <footer>
      <ul className="flex items-center gap-4">
        {LEGAL_LINKS.map((link, index) => (
          <li key={index}>
            <Link
              className="font-light text-[#8c9097] text-sm hover:underline"
              href="#"
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  );
}
