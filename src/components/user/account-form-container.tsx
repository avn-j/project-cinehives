"use client";

import { useState } from "react";
import LoginForm from "./login/login-form";
import RegisterForm from "./register/register-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";

enum FORM_STATE {
  Login,
  Register,
}

export default function AccountFormContainer() {
  const [formState, setFormState] = useState<FORM_STATE>(FORM_STATE.Login);

  function handleFormChange() {
    formState === FORM_STATE.Login
      ? setFormState(FORM_STATE.Register)
      : setFormState(FORM_STATE.Login);
  }

  return (
    <>
      {formState == FORM_STATE.Login && (
        <div>
          <LoginForm />
          <Separator className="mt-2 bg-stone-500" />
          <div className="flex items-center">
            <p className="">Dont have an account?</p>
            <Button
              variant="link"
              className="px-1 text-base"
              onClick={handleFormChange}
            >
              Register an account
            </Button>
          </div>
        </div>
      )}

      {formState == FORM_STATE.Register && (
        <div>
          <RegisterForm />
          <Separator className="mt-10 bg-stone-500" />
          <div className="flex items-center">
            <p className="">Already have an account?</p>
            <Button
              variant="link"
              className="px-1 text-base"
              onClick={handleFormChange}
            >
              Login
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
