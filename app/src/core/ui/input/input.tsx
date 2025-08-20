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
      console.log("      setFocus(true);");
    });

    ref.current?.addEventListener("blur", () => {
      setFocus(false);
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
            top: 19,
            left: 10,
            pointerEvents: "none",
            display: display,
            color:'#5F7E97'
          }}
          text={label}
         
        />
      </div>
      <TextV2
        color="#5F7E97"
        currentRef={ref}
        onChange={(text) => {
          setValue(text);
          onChange?.(text);
        }}
        text={initialValue}
        isEditable={true}
        style={{
          border: `1.5px solid ${solidColor ?? "#6B6B6B"}`,
          borderRadius: 4,
          height: height ?? 40,
          // background: bgColor ?? "#EFF4FB",
          paddingTop: 19,
          paddingLeft: 10,
          overflow: "auto",
          fontSize: fontSize,
        }}
      />
       
    </div>
  );
};
