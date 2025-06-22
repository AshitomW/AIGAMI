import { AUTH_TYPE } from "@/constants";
import AuthForm from "../_components/auth-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <AuthForm auth_type={AUTH_TYPE.SIGN_IN} />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-600">
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800/20 via-zinc-700/10 to-zinc-900/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
            <p className="text-xl text-white/80">
              Sign in to continue to your account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
