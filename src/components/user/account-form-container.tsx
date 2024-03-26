"use client";

import { useState } from "react";
import LoginForm from "./login/login-form";
import RegisterForm from "./register/register-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { USER_FORM_STATE } from "@/lib/enums";
import Link from "next/link";

interface initialFormState {
  initialFormState: USER_FORM_STATE;
}

export default function AccountFormContainer({
  initialFormState,
}: initialFormState) {
  const [formState, setFormState] = useState<USER_FORM_STATE>(initialFormState);

  return (
    <>
      {formState == USER_FORM_STATE.Login && (
        <div>
          <LoginForm />
          <Separator className="mt-2 bg-stone-500" />
          <div className="flex items-center">
            <p>{"Don't have an account?"}</p>
            <Button variant="link" className="px-1 text-base">
              <Link href="/register">Register an account</Link>
            </Button>
          </div>
        </div>
      )}

      {formState == USER_FORM_STATE.Register && (
        <div>
          <RegisterForm />
          <Separator className="mt-10 bg-stone-500" />
          <div className="flex items-center">
            <p className="">Already have an account?</p>
            <Button variant="link" className="px-1 text-base">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
