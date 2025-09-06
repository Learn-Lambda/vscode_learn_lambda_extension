import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { TypedEvent } from "../../core/helpers/typed_event";
import { Task } from "./model/task";
import { logout } from "../logout/log_out_command";

export class AuthorizationEmitter extends TypedEvent<{ token: string }> {}
export class SelectTaskEmitter extends TypedEvent<Task> {}
export class SendTaskEmitter extends TypedEvent<{ taskId?: number }> {}
export class TerminalLog extends TypedEvent<{ log: string }> {}
export const authorizationEmitter = new AuthorizationEmitter();
export const selectTaskEmitter = new SelectTaskEmitter();
export const sendTaskEmitter = new SendTaskEmitter();
export const terminalLog = new TerminalLog();
export class Panel implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  context: vscode.ExtensionContext;
  constructor(
    private readonly _extensionUri: vscode.Uri,
    context: vscode.ExtensionContext
  ) {
    this.context = context;
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.command && message.data) {
        switch (message.command) {
          case "Authorization": {
            authorizationEmitter.emit({ token: message.data });
            return;
          }
          case "selectTask": {
            selectTaskEmitter.emit(message.data);
            return;
          }
          case "sendText": {
            webviewView.webview.postMessage({
              command: "sendText",
              arg: {
                text: vscode.window.activeTextEditor?.document.getText(),
              },
            });
            return;
          }
        }
      }
    });
    logout.on(() => {
      webviewView.webview.postMessage({ command: "logout" });
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const htmlPath = path.join(
      this._extensionUri.fsPath,
      "app",
      "dist",
      "index.html"
    );

    if (!fs.existsSync(htmlPath)) {
      throw new Error(`HTML file not found at ${htmlPath}`);
    }

    let html = fs.readFileSync(htmlPath, "utf8");
    html = html.replace(
      /<head>/,
      `<head>
                <base href="${webview.asWebviewUri(
                  vscode.Uri.joinPath(this._extensionUri, "app", "dist")
                )}/">
            `
    );

    return html;
  }
}
