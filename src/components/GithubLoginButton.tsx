'use client';

import type { JSX } from 'react';
import { loginWithGithub } from '@/actions/auth';
import { Button } from '@/components/ui/Button';

export function GithubLoginButton(): JSX.Element {
  return (
    <Button
      className="bg-white p-4 text-black"
      onClick={() => loginWithGithub()}
      type="button"
      variant="tertiary"
    >
      GitHub
    </Button>
  );
}
