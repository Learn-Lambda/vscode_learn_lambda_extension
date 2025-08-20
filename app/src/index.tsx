import { FunctionalComponent, Ref, render } from "preact";
import { CSSProperties, useEffect, useRef, useState } from "preact/compat";
import { TextV2 } from "./core/ui/text/text";
import { Icon, IconType } from "./core/ui/icon/icon";
import { VsCodeRepository } from "./s";

export function App() {
  // const tasks = ["task"];
  const [tasks, setTasks] = useState<string[]>(["tasks"]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div
          onClick={() => new VsCodeRepository().sendMessage()}
          style={{
            display: "flex",
            width: 80,
            height: 40,
            background: "#FFFFFF",
            borderRadius: 13,
            placeContent: "center",
            alignItems: "center",
          }}
        >
          <TextV2 text="1/100" color="#5F7E97" />
          <div style={{ width: 2 }} />
          <Icon type={IconType.play} />
        </div>
        <div></div>
        <div
          style={{
            display: "flex",
            width: 80,
            height: 40,
            background: "#FFFFFF",
            borderRadius: 13,
            placeContent: "center",
            alignItems: "center",
          }}
        >
          <TextV2 text="Отправить" color="#5F7E97" />
        </div>
      </div>
      <div>
        {tasks.map((el) => (
          <div style={{ color: "#5F7E97" }}>{el}</div>
        ))}
      </div>
    </div>
  );
}

render(<App />, document.getElementById("app"));
