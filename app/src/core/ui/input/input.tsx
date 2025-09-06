import { useEffect, useRef, useState } from "preact/compat";
import { TextV2 } from "../text/text";

export const InputV2: React.FC<{
  onChange?: (text: string) => void;
  initialValue?: string;

  label?: string;

  bgColor?: string;
  solidColor?: string;
  fontSize?: number;
  height?: number;
}> = ({
  onChange,
  initialValue,
  label,

  bgColor,
  solidColor,
  fontSize,
  height,
}) => {
  const [value, setValue] = useState(initialValue ?? "");
  const [hasFocus, setFocus] = useState(false);
  const [display, setDisplay] = useState("block");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setDisplay(getDisplay());
  }, [value, hasFocus]);
  useEffect(() => {
    ref.current?.addEventListener("focus", () => {
      setFocus(true);
    });

    ref.current?.addEventListener("blur", () => {
      setFocus(false);
    });
    const editableDiv = document.querySelector("div[contenteditable=true]");

    ref.current?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
    });
  });
  const getDisplay = () => {
    if (value.length !== 0 && value.length !== 1) {
      return "none";
    }

    if (hasFocus) {
      return "none";
    }

    return "block";
  };
  return (
    <div>
      <div style={{ position: "relative" }}>
        <TextV2
          style={{
            position: "absolute",
            wordWrap: "normal",
            top: 25,
            left: 10,
            pointerEvents: "none",
            display: display,
            color: "black",
          }}
          text={label}
        />
      </div>
      <TextV2
        color="black"
        currentRef={ref}
        onChange={(text) => {
          setValue(text);
          onChange?.(text);
        }}
        text={initialValue}
        isEditable={true}
        style={{
          // display: "flex",
          top: 30,
          width: 297,
          height: 40,
          background: "#FFFFFF",
          border: "1px solid #121212",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          borderRadius: 5,
          paddingTop: 21,
          // overflowY: "scroll",
          whiteSpace: "nowrap",
          textAlign: "left",
          overflow: "clip",
        }}
      />
    </div>
  );
};
