import Navbar from "@/components/global/navbar";
import AccountFormContainer from "@/components/user/account-form-container";
import { getUser, getUserProfile } from "@/lib/authentication-functions";
import { USER_FORM_STATE } from "@/lib/enums";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getUser();
  const profile = await getUserProfile(user);
  if (user && !profile) redirect("/account/setup");
  if (user) redirect("/");

  return (
    <>
      <Navbar />
      <main>
        <div className="flex justify-center pt-36">
          <div className="w-1/3">
            <div className="mb-4">
              <h1 className="text-primary text-5xl font-extrabold">
                Cinehives
              </h1>
              <h2 className="tex-xl mt-2">Welcome back. Log in below.</h2>
            </div>
            <AccountFormContainer initialFormState={USER_FORM_STATE.Login} />
          </div>
        </div>
      </main>
    </>
  );
}
