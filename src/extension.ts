import * as vscode from 'vscode'
import {
  TabInputText,
  TabInputTextDiff,
  TabInputWebview,
  TabInputCustom
} from 'vscode'
import type { Tab, TabGroup } from 'vscode'
import type { TabSelector } from './lib/tab'
import { getTargetTabs, tabSelectorVeiwType, tabSelectorText } from './lib/tab'

function getTextTabs(
  tabSelctors: TabSelector[],
  tabGroups: readonly TabGroup[]
): Tab[] {
  const tabs: Tab[] = []

  for (const tabGroup of tabGroups) {
    // append th return of getTargetTabs to tabs
    tabs.push(...getTargetTabs(tabSelctors, tabGroup.tabs))
  }

  return tabs
}

export function activate(context: vscode.ExtensionContext) {
  const tabSelectors = [
    tabSelectorText([TabInputText, TabInputTextDiff]),
    tabSelectorVeiwType(
      [TabInputWebview, TabInputCustom],
      ['mainThreadWebview-markdown.preview']
    )
  ]
  const disposable = vscode.commands.registerCommand(
    'extension.quitTextTabs',
    async () => {
      const tabs = getTextTabs(tabSelectors, vscode.window.tabGroups.all)
      await vscode.window.tabGroups.close(tabs)
    }
  )

  context.subscriptions.push(disposable)
}
