"use client";

import { useState } from "react";
import LoginForm from "./login/LoginForm";
import RegisterForm from "./register/RegisterForm";
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

    console.log("Changed");
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
        </div>
      )}
    </>
  );
}
