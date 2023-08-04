import * as vscode from 'vscode'
import { TabInputText, TabInputTextDiff } from 'vscode'
import type { Tab, TabGroup } from 'vscode'
import { getTargetTabs } from './lib/tab'

function getTextTabs(tabGroups: readonly TabGroup[]): Tab[] {
  const tabs: Tab[] = []

  for (const tabGroup of tabGroups) {
    // append th return of getTargetTabs to tabs
    tabs.push(...getTargetTabs([TabInputText, TabInputTextDiff], tabGroup.tabs))
  }

  return tabs
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.quitTextTabs',
    async () => {
      const tabs = getTextTabs(vscode.window.tabGroups.all)
      await vscode.window.tabGroups.close(tabs)
    }
  )

  context.subscriptions.push(disposable)
}
