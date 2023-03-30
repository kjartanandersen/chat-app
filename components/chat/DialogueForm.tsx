import { FormEventHandler, MutableRefObject } from "react";

interface IProps {
  sendMessageHandler: FormEventHandler<HTMLFormElement>;
  inputRef: MutableRefObject<HTMLInputElement>;
}

const DialogueForm = ({ sendMessageHandler, inputRef }: IProps) => {
  return (
    <div className="container">
      <form className={"field "} onSubmit={sendMessageHandler}>
        <input
          className="input"
          ref={inputRef}
          type="text"
          placeholder="Enter text here"
        />
        <button className="btn">Send</button>
      </form>
    </div>
  );
};

export default DialogueForm;
