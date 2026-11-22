'use client';

import { useEffect } from 'react';
import { sileo } from 'sileo';

interface GithubConnectStatusProps {
  error?: string;
  linked?: boolean;
}

const ERROR_MESSAGES: Record<string, string> = {
  'already-linked': 'Esa cuenta de GitHub ya está vinculada a otro usuario.',
  'invalid-state': 'No pudimos verificar la solicitud, probá de nuevo.',
  unknown: 'Algo salió mal conectando con GitHub, probá de nuevo.',
};

export function GithubConnectStatus({
  error,
  linked,
}: GithubConnectStatusProps): null {
  useEffect(() => {
    if (linked) {
      sileo.success({
        title: 'Tu cuenta de GitHub se conectó correctamente.',
      });
      return;
    }

    if (error) {
      sileo.error({ title: ERROR_MESSAGES[error] ?? ERROR_MESSAGES.unknown });
    }
  }, [error, linked]);

  return null;
}
