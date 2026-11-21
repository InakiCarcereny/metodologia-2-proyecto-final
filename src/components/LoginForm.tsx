'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { JSX } from 'react/jsx-runtime';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { login } from '@/actions/auth';
import { FormError } from '@/components/FormError';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { type LoginFormValues, loginSchema } from '@/schemas/auth';

export function LoginForm(): JSX.Element {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setError(undefined);

    const result = await login(data);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push('/home');
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-[#494d56] text-sm" htmlFor="email">
          Correo
        </label>

        <Input
          control={control}
          error={errors.email}
          name="email"
          placeholder="tu@correo.dev"
          type="email"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="font-semibold text-[#494d56] text-sm"
          htmlFor="password"
        >
          Contraseña
        </label>

        <Input
          control={control}
          error={errors.password}
          name="password"
          placeholder="••••••••••"
          type="password"
        />
      </div>

      <Button className="p-4" type="submit" variant="primary">
        Entrar
      </Button>

      <FormError message={error} />
    </form>
  );
}
