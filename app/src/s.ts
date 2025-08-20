class VsCodeFake {
  constructor() {}
  postMessage({ command, data }: { command: string; data: any }) {
    console.log("postMessage");
    console.log(command);
    console.log(data);
  }
}

export class VsCodeRepository {
  vscode: VsCodeFake;
  constructor() {}
  sendMessage = () => {
    console.log("send");
    // this.vscode.postMessage({ command: "myCommand", data: "данные" });
  };
}
