import * as vscode from 'vscode';

 
export class SampleWebviewViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'sample.webviewView';

  constructor(private readonly _context: vscode.ExtensionContext) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true
    };

    webviewView.webview.html = this.getHtmlForWebview();
  }

  private getHtmlForWebview(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"></head>
      <body>
        <h1>Hello from WebviewView!</h1>
        <p>Пример минимального WebviewViewProvider.</p>
      </body>
      </html>
    `;
  }
}