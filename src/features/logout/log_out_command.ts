import { ExtensionContext } from "vscode";
import { Command } from "../../core/commands/command";
import { TypedEvent } from "../../core/helpers/typed_event";
export class LogOut extends TypedEvent<void> {}

export const logout = new LogOut();
export class LogOutCommand extends Command {
  registerCommand: string = "learn_lambda.LogOut";
  async command(context: ExtensionContext): Promise<void> {
    logout.emit(undefined);
  }
}
