import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
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
    // html = html.replace(
    //   /<head>/,
    //   `<head>
    //             <base href="${webview.asWebviewUri(
    //               vscode.Uri.joinPath(this._extensionUri, "app", "dist")
    //             )}/">
    //         `
    // );
    html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
    <h1 id="lines-of-code-counter">0</h1>

    <script>
    try{
      const vscode = acquireVsCodeApi();
      vscode.postMessage({ command: 'myCommand', data: 'данные' });
    }catch(e){
    console.log(e)
    }
         
    </script>
</body>
</html>`;
    return html;
  }
}
