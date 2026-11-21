import { Check, GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import type { JSX } from 'react';
import { ActivityPreview } from '@/components/ActivityPreview';
import { AuthLeftColumn, AuthRightColumn } from '@/components/AuthColumn';
import { LegalFooter } from '@/components/LegalFooter';
import { RegisterForm } from '@/components/RegisterForm';

const ADVANTAGES: string[] = [
  'Tu perfil técnico, con tu stack real',
  '12.4k devs ya están discutiendo código acá',
  'Sin anuncios ni venta de datos',
];

export default function Register(): JSX.Element {
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
            Tu feed arranca con los tags que elijas. Nada de algoritmo.
          </h3>

          <ActivityPreview />

          <ul className="flex flex-col gap-1">
            {ADVANTAGES.map((advantage, index) => (
              <li
                className="flex items-center gap-2 font-medium text-[#7e8288] text-[14px]"
                key={index}
              >
                <Check color="#67bb7c" size={12} />
                {advantage}
              </li>
            ))}
          </ul>
        </div>
      </AuthLeftColumn>

      <AuthRightColumn>
        <div className="flex h-162.5 max-w-100 flex-col justify-between">
          <header className="flex flex-col gap-2">
            <h1 className="font-bold text-3xl">Crear cuenta</h1>

            <p className="font-light text-[#696d75] text-sm">
              Elige tu handle y los tags con los que arranca tu perfil.
            </p>
          </header>

          <RegisterForm />

          <span className="font-light text-[#5f636c] text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link className="text-[#4265b3] hover:underline" href="/login">
              Inicia sesión
            </Link>
          </span>

          <LegalFooter />
        </div>
      </AuthRightColumn>
    </>
  );
}
