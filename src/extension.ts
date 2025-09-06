import * as vscode from "vscode";
import { CurrentLocale } from "./core/locale/locale";
import { RunOnCurrentFile } from "./features/run_on_current_file/run_on_current_file_command";
import {
  Panel,
  selectTaskEmitter,
  sendTaskEmitter,
} from "./features/panel/panel";
import { LogOutCommand } from "./features/logout/log_out_command";

export let currentLocale = new CurrentLocale("");

export function activate(context: vscode.ExtensionContext) {
  const panel = new Panel(context.extensionUri, context);
  const output = vscode.window.createOutputChannel("Мой OutputChannel");

  selectTaskEmitter.on(async (task) => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage("Открытый workspace не найден");
      return;
    }

    const fileUri = vscode.Uri.joinPath(
      workspaceFolders[0].uri,
      "src",
      "extension.ts"
    );

    try {
      const encoder = new TextEncoder();
      const uint8array = encoder.encode(task.code);
      await vscode.workspace.fs.writeFile(fileUri, uint8array);
      const doc = await vscode.workspace.openTextDocument(fileUri);
      await vscode.window.showTextDocument(doc);
      await vscode.commands.executeCommand("learn_lambda.runOnCurrentFile");
    } catch (error) {
      vscode.window.showErrorMessage(`Ошибка создания файла: ${String(error)}`);
    }
  });

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("myExtension-sidebar", panel)
  );

  currentLocale = new CurrentLocale(vscode.env.language);

  [new RunOnCurrentFile(), new LogOutCommand()].forEach((command) =>
    context.subscriptions.push(
      vscode.commands.registerCommand(command.registerCommand, () =>
        command.command(context)
      )
    )
  );

  output.show(true);

  // Вывести текст
  output.appendLine("Привет, это сообщение в OutputChannel");
}

export function deactivate() {}
