import { ICommandRunner } from "./command_runner"
import { Context } from "../context"

export class BuiltinCommandRunner implements ICommandRunner {
  names(): string[] {
    return ["cd", "history"]
  }

  async run(cmdName: string, context: Context): Promise<void> {
    switch (cmdName) {
      case "cd":
        this._cd(context)
        break
      case "history":
        await this._history(context)
        break
      }
  }

  private _cd(context: Context) {
    const { args } = context
    if (args.length < 1) {
      // Do nothing.
      return;
    } else if (args.length > 1) {
      throw new Error("cd: too many arguments")
    }

    let path = args[0]
    if (path == "-") {
      const oldPwd = context.environment.get("OLDPWD")
      if (oldPwd === null) {
        throw new Error("cd: OLDPWD not set")
      }
      path = oldPwd
    }

    const { FS } = context.fileSystem
    const oldPwd = FS.cwd()
    FS.chdir(path)
    context.environment.set("OLDPWD", oldPwd)
    context.environment.set("PWD", FS.cwd())
  }

  private async _history(context: Context) {
    // TODO: support flags to clear, etc, history.
    const { history, stdout } = context
    await history.write(stdout)
  }
}
