import * as vscode from 'vscode'
import { TabInputText, TabInputTextDiff } from 'vscode'
import { getTargetTabs } from './lib/tab'

function quitTextTabs(curTabGroup: vscode.TabGroup): Thenable<boolean> {
  const tabs = getTargetTabs([TabInputText, TabInputTextDiff], curTabGroup.tabs)
  if (tabs.length > 0) {
    return vscode.window.tabGroups.close(tabs)
  }
  return Promise.resolve(true) // close() に [] を渡した場合、true になったので
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.quitTextTabs',
    async () => {
      await quitTextTabs(vscode.window.tabGroups.activeTabGroup)
    }
  )

  context.subscriptions.push(disposable)
}
