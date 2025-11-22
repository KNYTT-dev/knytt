'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { useRegister, useLogin } from '@/lib/queries/auth';
import { Input, Button } from '@/components/ui';
import RotatingHeadline from './RotatingHeadline';

const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one digit'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignupFormData = z.infer<typeof signupSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

export default function SignupModal() {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const router = useRouter();
  const registerMutation = useRegister();
  const loginMutation = useLogin();

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSignup = (data: SignupFormData) => {
    registerMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          router.push('/onboarding');
        },
      }
    );
  };

  const onLogin = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  const currentError = mode === 'signup' ? registerMutation.error : loginMutation.error;
  const isLoading = mode === 'signup' ? registerMutation.isPending : loginMutation.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative z-10 w-full max-w-[400px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-10"
    >
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 relative">
          <Image
            src="/knytt-logo-circle.png"
            alt="Knytt Logo"
            width={48}
            height={48}
            className="rounded-full"
            priority
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `
                <div class="w-12 h-12 bg-[#8a94ff] rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-xl">K</span>
                </div>
              `;
            }}
          />
        </div>
      </div>

      {/* Welcome Heading */}
      <h1 className="text-center text-3xl font-bold text-[#111111] mb-2">
        Welcome to Knytt
      </h1>

      {/* Rotating Headline */}
      <div className="flex justify-center mb-8">
        <RotatingHeadline />
      </div>

      {/* Error Message */}
      {currentError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">
            {currentError.message || 'An error occurred. Please try again.'}
          </p>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('signup')}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
            mode === 'signup'
              ? 'bg-[#8a94ff] text-white'
              : 'bg-gray-100 text-[#717171] hover:bg-gray-200'
          }`}
        >
          Sign Up
        </button>
        <button
          onClick={() => setMode('login')}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
            mode === 'login'
              ? 'bg-[#8a94ff] text-white'
              : 'bg-gray-100 text-[#717171] hover:bg-gray-200'
          }`}
        >
          Log In
        </button>
      </div>

      {/* Forms */}
      {mode === 'signup' ? (
        <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
          <Input
            {...signupForm.register('email')}
            label="Email Address"
            type="email"
            leftIcon={<Mail className="w-5 h-5" />}
            error={signupForm.formState.errors.email?.message}
            floatingLabel={true}
            className="h-12"
          />

          <Input
            {...signupForm.register('password')}
            label="Password"
            type="password"
            leftIcon={<Lock className="w-5 h-5" />}
            error={signupForm.formState.errors.password?.message}
            helperText="8+ chars with uppercase, lowercase, and digit"
            floatingLabel={true}
            className="h-12"
          />

          <Input
            {...signupForm.register('confirmPassword')}
            label="Confirm Password"
            type="password"
            leftIcon={<Lock className="w-5 h-5" />}
            error={signupForm.formState.errors.confirmPassword?.message}
            floatingLabel={true}
            className="h-12"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            className="w-full h-12 font-semibold"
          >
            Continue
          </Button>
        </form>
      ) : (
        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
          <Input
            {...loginForm.register('email')}
            label="Email Address"
            type="email"
            leftIcon={<Mail className="w-5 h-5" />}
            error={loginForm.formState.errors.email?.message}
            floatingLabel={true}
            className="h-12"
          />

          <Input
            {...loginForm.register('password')}
            label="Password"
            type="password"
            leftIcon={<Lock className="w-5 h-5" />}
            error={loginForm.formState.errors.password?.message}
            floatingLabel={true}
            className="h-12"
          />

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            loading={isLoading}
            className="w-full h-12 font-semibold"
          >
            Log In
          </Button>
        </form>
      )}

      {/* Legal Text */}
      <p className="mt-6 text-xs text-center text-[#717171]">
        By continuing, you agree to Knytt's{' '}
        <a href="/terms" className="underline hover:text-[#111111]">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline hover:text-[#111111]">
          Privacy Policy
        </a>
        .
      </p>
    </motion.div>
  );
}
