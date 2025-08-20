import { ExtensionContext } from "vscode";
import { Command } from "../../core/commands/command";
import * as vscode from "vscode";
import { currentLocale } from "../../extension";
import { GlobalState } from "../../core/helpers/global_state";


export class Authorization extends Command {
  registerCommand: string = "learn_lambda.authorization";
  async command(context: ExtensionContext): Promise<void> {
    const userInput = await vscode.window.showInputBox({
      prompt: currentLocale.locale.writeToken(),
    });
    if (userInput) {
      vscode.window.showInformationMessage(`Вы ввели: ${userInput}`);
      context.globalState.update(GlobalState.token, userInput);
    } else {
      vscode.window.showErrorMessage("");
    }
  }
}
