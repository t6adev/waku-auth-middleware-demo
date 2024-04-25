'use client';

import { useActionState } from 'react';
import type { SignupFn } from '../actions/signup';

export const SignUp = ({ signup }: { signup: SignupFn }) => {
  const [result, action, isPending] = useActionState<ReturnType<SignupFn>, FormData>(
    (_, payload) => signup(payload),
    null
  );
  const disabled = isPending;
  return (
    <form action={action}>
      <label htmlFor="username" className="text-sm font-medium">
        Username
      </label>
      <input
        name="username"
        type="text"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
      />
      <label htmlFor="password" className="mt-4 text-sm font-medium">
        Password
      </label>
      <input
        type="password"
        name="password"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
      />
      <button
        type="submit"
        className="mt-4 h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        disabled={disabled}
      >
        Sign Up {isPending ? <span className="ml-2 animate-spin">↻</span> : null}
      </button>
      {result && <p>{result.error}</p>}
    </form>
  );
};
