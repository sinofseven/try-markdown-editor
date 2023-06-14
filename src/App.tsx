import {
  useState,
  useRef,
  KeyboardEventHandler,
  FormEventHandler,
  ReactEventHandler,
} from "react";

function App() {
  const refTextArea = useRef<HTMLTextAreaElement>(null);
  const [lineNumber, setLineNumber] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [line, setLine] = useState("");
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const getPosition = (): {
    line: number;
    index: number;
    text: string;
    lines: string[];
  } => {
    const elm = refTextArea.current as HTMLTextAreaElement;
    const substr = elm.value.substring(0, elm.selectionStart);
    const lines = substr.split("\n");
    return {
      line: lines.length,
      index: lines[lines.length - 1].length,
      text: elm.value.split("\n")[lines.length - 1],
      lines,
    };
  };

  const handleSelect: ReactEventHandler = () => {
    const position = getPosition();
    setLine(position.text);
    setLineNumber(position.line);
    setLineIndex(position.index);

    const elm = refTextArea.current as HTMLTextAreaElement;
    setSelectionStart(elm.selectionStart);
    setSelectionEnd(elm.selectionEnd);
  };

  const isUlLi = (text: string): boolean => {
    return /^ *-/.test(text);
  };

  const isOlLi = (text: string): boolean => {
    return /^ *[0-9]+/.test(text);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.code === "Tab") {
      e.preventDefault();
      if (e.repeat) {
        return;
      }
      const position = getPosition();
      const elm = refTextArea.current as HTMLTextAreaElement;
      if (isUlLi(position.text)) {
        if (e.shiftKey) {
          const hyphenIndex = position.text.indexOf("-");
          let index = 0;
          if (hyphenIndex < 1) {
            return;
          } else if (hyphenIndex === 1) {
            index = 1;
          } else {
            index = 2;
          }
          const cursor = elm.selectionStart - index;
          const next = elm.value
            .split("\n")
            .map((x, i) => {
              if (i + 1 === position.line) {
                return x.substring(index);
              } else {
                return x;
              }
            })
            .join("\n");
          elm.value = next;
          elm.selectionStart = cursor;
          elm.selectionEnd = cursor;
        } else {
          const cursor = elm.selectionStart + 2;
          const next = elm.value
            .split("\n")
            .map((l, i) => {
              const padding = i + 1 === position.line ? "  " : "";
              return padding + l;
            })
            .join("\n");
          elm.value = next;
          elm.selectionStart = cursor;
          elm.selectionEnd = cursor;
        }
      } else if (isOlLi(position.text)) {
        if (e.shiftKey) {
          const hyphenIndex = position.text.search(/[0-9]/);
          let index = 0;
          if (hyphenIndex < 1) {
            return;
          } else if (hyphenIndex < 3) {
            index = hyphenIndex;
          } else {
            index = 3;
          }
          const cursor = elm.selectionStart - index;
          const next = elm.value
            .split("\n")
            .map((x, i) => {
              if (i + 1 === position.line) {
                return x.substring(index);
              } else {
                return x;
              }
            })
            .join("\n");
          elm.value = next;
          elm.selectionStart = cursor;
          elm.selectionEnd = cursor;
        } else {
          const cursor = elm.selectionStart + 3;
          const next = elm.value
            .split("\n")
            .map((x, i) => {
              if (i + 1 === position.line) {
                return "   " + x;
              } else {
                return x;
              }
            })
            .join("\n");
          elm.value = next;
          elm.selectionStart = cursor;
          elm.selectionEnd = cursor;
        }
      }
    }
  };

  const handleBeforeInput: FormEventHandler = (e) => {
    // @ts-ignore
    if (e?.data === "\n") {
      const position = getPosition();
      const flagIsUlLi = isUlLi(position.text);
      const flagIsOlLi = isOlLi(position.text);
      if (!flagIsUlLi && !flagIsOlLi) {
        return;
      }
      e.preventDefault();
      const elm = refTextArea.current as HTMLTextAreaElement;
      const start = elm.selectionStart;
      const end = elm.selectionEnd;
      if (flagIsUlLi) {
        const hyphenIndex = position.text.indexOf("-");
        const text = elm.value;
        const next =
          text.substring(0, start) +
          "\n" +
          " ".repeat(hyphenIndex) +
          "- " +
          text.substring(end);
        elm.value = next;
        elm.selectionStart = start + 1 + hyphenIndex + 2;
        elm.selectionEnd = start + 1 + hyphenIndex + 2;
      }
      if (flagIsOlLi) {
        const hyphenIndex = position.text.search(/[0-9]/);
        const text = elm.value;
        const next =
          text.substring(0, start) +
          "\n" +
          " ".repeat(hyphenIndex) +
          "1. " +
          text.substring(end);
        elm.value = next;
        elm.selectionStart = start + 1 + hyphenIndex + 3;
        elm.selectionEnd = start + 1 + hyphenIndex + 3;
      }
    }
  };

  return (
    <div className="container">
      <h2 className="title">Textarea Test</h2>
      <hr />
      <textarea
        style={{
          width: "100%",
          height: "30vh",
          padding: "0.5rem",
          fontFamily: "monospace, monospace",
        }}
        ref={refTextArea}
        onBeforeInput={handleBeforeInput}
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
      />
      <table className="table">
        <thead>
          <tr>
            <th>key</th>
            <th>value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>line</th>
            <td>{line}</td>
          </tr>
          <tr>
            <th>line number</th>
            <td>{lineNumber}</td>
          </tr>
          <tr>
            <th>line index</th>
            <td>{lineIndex}</td>
          </tr>
          <tr>
            <th>selectionStart</th>
            <td>{selectionStart}</td>
          </tr>
          <tr>
            <th>selectionEnd</th>
            <td>{selectionEnd}</td>
          </tr>
          <tr>
            <th>is ul li</th>
            <td>{isUlLi(line) ? "true" : "false"}</td>
          </tr>
          <tr>
            <th>is ol li</th>
            <td>{isOlLi(line) ? "true" : "false"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
