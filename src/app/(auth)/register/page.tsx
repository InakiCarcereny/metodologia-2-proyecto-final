import { Check, GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import type { JSX } from 'react';
import { AuthLeftColumn, AuthRightColumn } from '@/components/AuthColumn';
import { UserPreview } from '@/components/UserPreview';

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

          <UserPreview />

          <div>
            <p className="flex items-center gap-2 font-medium text-[#7e8288] text-[14px]">
              <Check color="#67bb7c" size={12} />
              Tu perfil técnico, con tu stack real
            </p>
            <p className="flex items-center gap-2 font-medium text-[#7e8288] text-[14px]">
              <Check color="#67bb7c" size={12} />
              12.4k devs ya están discutiendo código acá
            </p>
            <p className="flex items-center gap-2 font-medium text-[#7e8288] text-[14px]">
              <Check color="#67bb7c" size={12} />
              Sin anuncios ni venta de datos
            </p>
          </div>
        </div>
      </AuthLeftColumn>

      <AuthRightColumn>hola</AuthRightColumn>
    </>
  );
}
