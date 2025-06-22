"use client";

import { useState } from "react";
import { AUTH_TYPE } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface AuthFormProps {
  auth_type: AUTH_TYPE;
}

export default function AuthForm({ auth_type }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isSignUp = auth_type === AUTH_TYPE.SIGN_UP;
  const title = isSignUp ? "Create Account" : "Sign In";
  const description = isSignUp
    ? "Enter your details to create your account"
    : "Enter your credentials to access your account";

  // Password validation
  const isPasswordStrong =
    formData.password.length >= 8 &&
    /[A-Z]/.test(formData.password) &&
    /[a-z]/.test(formData.password) &&
    /[0-9]/.test(formData.password);

  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic
    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            className="focus:ring-0 focus:border-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            className="focus:ring-0 focus:border-black"
            required
          />
          {isSignUp && formData.password && (
            <div className="text-xs space-y-1">
              <div
                className={`flex items-center gap-2 ${
                  isPasswordStrong ? "text-green-600" : "text-red-500"
                }`}
              >
                <span>{isPasswordStrong ? "✓" : "✗"}</span>
                <span>
                  Strong password (8+ chars, uppercase, lowercase, number)
                </span>
              </div>
            </div>
          )}
        </div>

        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="focus:ring-0 focus:border-black"
              required
            />
            {formData.confirmPassword && (
              <div className="text-xs">
                <div
                  className={`flex items-center gap-2 ${
                    passwordsMatch ? "text-green-600" : "text-red-500"
                  }`}
                >
                  <span>{passwordsMatch ? "✓" : "✗"}</span>
                  <span>Passwords match</span>
                </div>
              </div>
            )}
          </div>
        )}

        <Button type="submit" className="w-full">
          {isSignUp ? "Create Account" : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        {isSignUp ? (
          <p>
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
