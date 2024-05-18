export interface ISignUpForm {
  username: string;
  email: string;
  passwords: {
    password: string;
    repeatPassword: string;
  };
}

export interface ISignUpFormPayload {
  username: string;
  email: string;
  password: string;
}
