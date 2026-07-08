import usersModel from "../model/users-model";

interface UserInput {
  name: string;
  email: string;
  password: string;
}

export async function CreateUser(user: UserInput) {
  await usersModel.create(user);
}