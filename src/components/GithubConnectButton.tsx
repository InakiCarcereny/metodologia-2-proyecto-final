import type { JSX } from 'react';

export function GithubConnectButton(): JSX.Element {
  return (
    <a
      className="self-start rounded-lg border border-[#dfe1e5] bg-white px-4 py-2 font-bold text-[13px] text-black"
      href="/api/github/connect"
    >
      Conectar tu cuenta de GitHub
    </a>
  );
}
