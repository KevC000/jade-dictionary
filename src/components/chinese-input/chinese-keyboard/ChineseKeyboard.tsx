import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import layout from "simple-keyboard-layouts/build/layouts/chinese";

type Props = {
  query: string;
  setQuery: (input: string) => void;
};

const ChineseKeyboard = ({ query, setQuery }: Props) => {
  return (
    <Keyboard
      className=" "
      onChange={(button) => {
        setQuery(button);
      }} // Use handleOnChange from the context
      onKeyPress={(button) => {
        console.log("Button pressed", button);
      }}
      input={query} // Use query from the context
      preventMouseDownDefault
      {...layout}
    />
  );
};
export default ChineseKeyboard;
