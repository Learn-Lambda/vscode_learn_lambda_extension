const vscode =
  process.env.NODE_ENV === "production"
    ? // @ts-ignore
      acquireVsCodeApi()
    : { postMessage: () => {} };
export class VsCodeRepository {
  sendMessage = (command: string, data: any) => {
    this._send(command, data);
  };
  _send(command: string, data: any) {
    // @ts-ignore
    vscode.postMessage({ command: command, data: data });
  }
}
