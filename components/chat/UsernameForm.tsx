import { IUsernameForm } from "@/types/Chat";

const UsernameForm = ({
  UsernameInputRef,
  usernameButtonHandler,
}: IUsernameForm) => {
  return (
    <div>
      <form onSubmit={usernameButtonHandler}>
        <label>
          Username:
          <input type="text" ref={UsernameInputRef}></input>
        </label>
        <input type="submit" value="submit" />
      </form>
    </div>
  );
};

export default UsernameForm;
