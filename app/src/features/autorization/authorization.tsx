import { Icon, IconType } from "../../core/ui/icon/icon";
import { TextV2 } from "../../core/ui/text/text";

export function Authorization() {
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
      <div style={{ height: 16 }} />
      <TextV2
        text={`Авторизуйтесь в вашем аккаунте,  что бы открыть доступ к колекции  задач.`}
        style={{
          color: "#84A1B7",
          width: 400,
        }}
      />
      <div style={{ height: 16 }} />

      <div
        style={{
          cursor: "pointer",
          width: 256,
          height: 71,
          background: "#654AA3",
          borderRadius: 5,
          alignContent: "center",
          justifyItems: "center",
        }}
      >
        <TextV2
          text={`войти`}
          style={{
            color: "#ffffff",
            width: 400,
          }}
        />
      </div>
    </div>
  );
}
