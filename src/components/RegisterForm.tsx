'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { JSX } from 'react/jsx-runtime';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { register } from '@/actions/auth';
import { FormError } from '@/components/FormError';
import { PasswordStrength } from '@/components/PasswordStrength';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { type RegisterFormValues, registerSchema } from '@/schemas/auth';

export function RegisterForm(): JSX.Element {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (
    data: RegisterFormValues,
  ) => {
    setError(undefined);

    const result = await register(data);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push('/home');
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1">
        <label
          className="font-semibold text-[#494d56] text-sm"
          htmlFor="username"
        >
          Usuario
        </label>

        <Input
          control={control}
          error={errors.username}
          name="username"
          placeholder="@tu.handle"
          type="text"
        />
      </div>

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
          placeholder="mínimo 8 caracteres"
          type="password"
        />
      </div>

      <PasswordStrength password={watch('password')} />

      <Button className="p-4" type="submit" variant="primary">
        Crear cuenta
      </Button>

      <FormError message={error} />
    </form>
  );
}
