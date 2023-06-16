import { FC } from "react";
import { Icons } from "./Icons";
import Link from "next/link";
import UserAuthForm from "./UserAuthForm";

const SignIn: FC = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm-w-[400px] ">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight ">Welcome back</h1>
        <p className="text-sm max-w-xs text-slate-500 mx-auto">
          By continuing, you are setting up a Noob Devs account , and agree to
          our User Aggreement and Privacy Policy.
        </p>

        {/* Sign In form */}

        <UserAuthForm />

        <p className="px-8 text-center text-sm text-zinc-700 mt-4">
          New to Noob Devs?{" "}
          <Link
            href="/sign-up"
            className="hover:text-zinc-900 text-sm underline underline-offset-4"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
