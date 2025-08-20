import { render } from "preact";
import { InputV2 } from "./core/ui/input/input_v2";
export function App() {
    return (<div style={{}}>
      <InputV2 label="Введите ваш токен  "/>
    </div>);
}
render(<App />, document.getElementById("app"));
//# sourceMappingURL=index.js.map