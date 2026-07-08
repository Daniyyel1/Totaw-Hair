  "use server"

import { signIn, signOut } from "../auth";

interface userInput {
  email: string;
  password: string;
}

export const doCredentialsLogin = async (user: userInput) => {
  try {
    const response = await signIn("credentials", {
      email: user.email,
      password: user.password,
      redirect: false,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export async function doSocialLogin(formData: FormData) {
  const action = formData.get("action") as string;

  await signIn(action, { redirectTo: "/" });
}

export const doLogout = async () => {
  await signOut({ redirectTo: "/Login" });
};
