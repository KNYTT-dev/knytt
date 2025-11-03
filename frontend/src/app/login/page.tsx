"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuth } from "@/lib/queries/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading, loginError, isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-evergreen mb-2">
              Welcome Back
            </h1>
            <p className="text-sage">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                {(loginError as any)?.message || "Login failed. Please check your credentials."}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-evergreen mb-2"
              >
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-sage/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-evergreen mb-2"
              >
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-sage/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-terracotta hover:bg-terracotta/90 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-sage">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-terracotta hover:text-terracotta/80 font-medium"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-sage hover:text-evergreen transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
