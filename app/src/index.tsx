import { h, render } from "preact";
import { createStore, Store } from "redux";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Authorization } from "./features/authorization/authorization";
import { Tasks } from "./features/tasks/tasks";
import { Icon, IconType } from "./core/ui/icon/icon";
import { configure } from "mobx";
import { extensions } from "./core/extensions/extensions";
import { VsCodeRepository } from "./core/repository/vs_code_repository";
import { useEffect } from "preact/hooks";
import { TypedEvent } from "./core/helper/typed_event";
import { debounce } from "./core/helper/debounce";
import { AuthorizationLocalStorageRepository } from "./core/repository/authorization_local_storage_repository";
extensions();

export enum RouterV2 {
  authorization,
  tasks,
  init,
}
interface State {
  current: RouterV2;
}

interface Authorization {
  type: "AUTHORIZATION";
}

interface Tasks {
  type: "TASKS";
}

type Action = Authorization | Tasks;

const initialState: State = {
  current: RouterV2.authorization,
};

function counterReducer(state = initialState, action: Action): State {
  switch (action.type) {
    case "AUTHORIZATION":
      return { current: RouterV2.authorization };
    case "TASKS":
      return { current: RouterV2.tasks };
    default:
      return state;
  }
}
export const store: Store<State, Action> = createStore(counterReducer);
class SendTextEmitter extends TypedEvent<string> {}

export const sendTextEmitter = new SendTextEmitter();

function Router() {
  const dispatch = useDispatch<typeof store.dispatch>();
  const authorizationLocalStorageRepository =
    new AuthorizationLocalStorageRepository();
  const currentRouter = useSelector((state: State) => state.current);
  useEffect(() => {
    if (window["messageHandlerAdded"] === undefined) {
      window.addEventListener("message", (event) => {
        const message = event.data;
        if (message.command === "init") {
          const { token, isAuth } = message.arg;
          if (isAuth) {
            dispatch({ type: "TASKS" });
          } else {
            dispatch({ type: "AUTHORIZATION" });
          }
        }
        if (message.command === "logout") {
          authorizationLocalStorageRepository.logout();
          dispatch({ type: "AUTHORIZATION" });
        }
      });
      window["messageHandlerAdded"] = true;
    }
  }, []);

  if (currentRouter === RouterV2.authorization) {
    return (
      <>
        <Authorization />
      </>
    );
  }
  if (currentRouter === RouterV2.tasks) {
    return (
      <>
        <Tasks />
      </>
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        left: "calc(50% - 50px)",
        top: "calc(50% - 50px)",
      }}
    >
      <Icon type={IconType.loader} size={50} />
    </div>
  );
}

configure({
  enforceActions: "never",
});
render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById("app")!
);
