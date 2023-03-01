import { RefObject } from "react";

export interface IUsernameForm {
  UsernameInputRef: RefObject<HTMLInputElement>;
  usernameButtonHandler: (e: React.FormEvent) => void;
}
