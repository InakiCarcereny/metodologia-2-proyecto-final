import { GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import type { JSX } from 'react';
import { AcceptedAnswerPreview } from '@/components/AcceptedAnswerPreview';
import { AuthLeftColumn, AuthRightColumn } from '@/components/AuthColumn';
import { GithubLoginButton } from '@/components/GithubLoginButton';
import { LegalFooter } from '@/components/LegalFooter';
import { LoginForm } from '@/components/LoginForm';
import { Separator } from '@/components/Separator';

const STATISTICS: string[] = ['12.4k devs', '38k revisiones', '0 anuncios'];

export default function Login(): JSX.Element {
  return (
    <>
      <AuthLeftColumn>
        <header>
          <Link className="flex items-center gap-2" href="/">
            <GlobeIcon color="white" />

            <h2 className="font-bold text-lg text-white">DevHub</h2>
          </Link>
        </header>

        <div className="flex flex-col gap-8">
          <h3 className="max-w-130 font-bold text-2xl text-white">
            El código se lee más veces de las que se escribe. Acá se lee
            acompañado.
          </h3>

          <AcceptedAnswerPreview />

          <ul className="flex items-center gap-8">
            {STATISTICS.map((advantage, index) => (
              <li
                className="font-medium text-[#7e8288] text-[14px]"
                key={index}
              >
                {advantage}
              </li>
            ))}
          </ul>
        </div>
      </AuthLeftColumn>

      <AuthRightColumn>
        <div className="flex h-162.5 max-w-100 flex-col justify-between">
          <header className="flex flex-col gap-2">
            <h1 className="font-bold text-3xl">Iniciar sesión</h1>

            <p className="font-light text-[#696d75] text-sm">
              Entra para seguir tus tags, revisiones y respuestas.
            </p>
          </header>

          <GithubLoginButton />

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Separator />
            </div>

            <span className="font-medium text-[#8c9097] text-xs">
              O CON CORREO
            </span>

            <div className="flex-1">
              <Separator />
            </div>
          </div>

          <LoginForm />

          <span className="font-light text-[#5f636c] text-sm">
            ¿Sin cuenta?{' '}
            <Link className="text-[#4265b3] hover:underline" href="/register">
              Crear una
            </Link>
          </span>

          <LegalFooter />
        </div>
      </AuthRightColumn>
    </>
  );
}
