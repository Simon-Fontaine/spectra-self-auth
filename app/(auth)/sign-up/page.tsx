import Link from "next/link";
import { Metadata } from "next";
import { APP_LOGO } from "@/lib/config-ui";
import { APP_CONFIG_PUBLIC } from "@/lib/config.public";
import { SignUpForm } from "@/components/forms/signup-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your new account",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex items-center justify-center ">
            <APP_LOGO height={30} width={30} />
          </div>
          {APP_CONFIG_PUBLIC.APP_NAME}
        </Link>
        <SignUpForm />
      </div>
    </div>
  );
}
