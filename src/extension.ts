import * as vscode from "vscode";
import { CurrentLocale } from "./core/locale/locale";
import { RunOnCurrentFile } from "./features/run_on_current_file/run_on_current_file_command";
import { SyncTask } from "./features/sync_task/sync_task_command";
import { EnterTokenCommand } from "./features/enter_token/enter_token_command";
const { SidebarProvider } = require("./SidebarProvider");

export let currentLocale = new CurrentLocale("");

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "myExtension-sidebar",
      sidebarProvider
    )
  );
  sidebarProvider.webview.onDidReceiveMessage(
    (message: { command: any; data: any }) => {
      console.log(message);
    }
  );
  currentLocale = new CurrentLocale(vscode.env.language);

  [new EnterTokenCommand(), new RunOnCurrentFile(), new SyncTask()].forEach(
    (command) =>
      context.subscriptions.push(
        vscode.commands.registerCommand(command.registerCommand, () =>
          command.command(context)
        )
      )
  );
}

export function deactivate() {}

 