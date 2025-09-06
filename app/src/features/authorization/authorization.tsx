import { useState } from "react";
import { Icon, IconType } from "../../core/ui/icon/icon";
import { InputV2 } from "../../core/ui/input/input";
import { TextV2 } from "../../core/ui/text/text";
import { AuthorizationHttpRepository } from "./authorization_repository";
import { match } from "ts-pattern";
import { VsCodeRepository } from "../../core/repository/vs_code_repository";
import { FunctionalComponent } from "preact";
import { useDispatch } from "react-redux";
import { store } from "../..";
import { AuthorizationLocalStorageRepository } from "../../core/repository/authorization_local_storage_repository";
import { socketRepository } from "../../core/repository/socket_repository";
enum StateStatus {
  error,
  loading,
  init,
}
export const Authorization: FunctionalComponent = () => {
  const [stateStatus, setStateStatus] = useState<StateStatus>(StateStatus.init);
  const [error, setError] = useState<string | undefined>(undefined);
  const authorizationHttpRepository = new AuthorizationHttpRepository();
  const vsCodeRepository = new VsCodeRepository();
  const authorizationLocalStorageRepository =
    new AuthorizationLocalStorageRepository();
  const dispatch = useDispatch<typeof store.dispatch>();
  authorizationLocalStorageRepository.isAuthV2().map((isAuth) => {
    if (isAuth) {
      dispatch({ type: "TASKS" });
      authorizationLocalStorageRepository.getJwtToken().map((el) => {
        socketRepository.connect(el);
      });
    }
  });
  const reset = () => {
    setStateStatus(StateStatus.init);
    token = "";
  };
  const tokenLoad = async () => {
    setStateStatus(StateStatus.loading);

    if (token === "") {
      return;
    }
    setStateStatus(StateStatus.loading);
    (await authorizationHttpRepository.checkToken(token)).fold(
      (success) => {
        setStateStatus(StateStatus.init);
        vsCodeRepository.sendMessage("Authorization", { token: token });
        dispatch({ type: "TASKS" });
        authorizationLocalStorageRepository.setJwtToken(token);
        authorizationLocalStorageRepository.setAuthStatus(true);
      },
      (error) => {
        setStateStatus(StateStatus.error);
        setError(error.error);
      }
    );
  };
  let token = "";
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        alignContent: "center",
        textAlign: "center",
        justifyItems: "center",
      }}
    >
      <Icon type={IconType.bigLogo} />
      {match(stateStatus ?? "")
        .with(StateStatus.error, () => (
          <>
            <div style={{ height: 16 }} />
            <TextV2
              text={`Авторизуйтесь в вашем аккаунте, что бы открыть доступ к колекции задач.`}
              style={{
                color: "#84A1B7",
                width: 400,
              }}
            />
            <div style={{ height: 16 }} />
            <div style={{ cursor: "pointer" }} onClick={() => reset()}>
              <Icon type={IconType.reset} />
            </div>
            <div style={{ height: 16 }} />
            <TextV2
              text={`Ошибка: ${error}`}
              style={{
                color: "#84A1B7",
                width: 400,
              }}
            />
          </>
        ))
        .with(StateStatus.init, () => (
          <>
            <div style={{ height: 16 }} />
            <TextV2
              text={`Авторизуйтесь в вашем аккаунте, что бы открыть доступ к колекции задач.`}
              style={{
                color: "#84A1B7",
                width: 400,
              }}
            />
            <div style={{ height: 16 }} />
            <div style={{ display: "flex" }}>
              <InputV2
                label="Введите токен"
                onChange={(text: string) => {
                  token = text;
                }}
              />
              <div
                onClick={() => tokenLoad()}
                style={{
                  cursor: "pointer",
                  width: 58,
                  height: 62,
                  background: "#D9D9D9",
                  borderRadius: 5,
                  alignItems: "center",
                  alignSelf: "center",
                  alignContent: "center",
                }}
              >
                <TextV2 text="ОТПРАВИТЬ" size={10} />
              </div>
            </div>
          </>
        ))
        .with(StateStatus.loading, () => (
          <>
            <div>
              <div style={{ height: 16 }} />
              <Icon type={IconType.loader} size={50} />
            </div>
          </>
        ))
        .otherwise(() => {
          return <></>;
        })}
    </div>
  );
};
