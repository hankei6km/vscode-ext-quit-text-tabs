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

const tabTypeText = [
  { text: 'text', type: TabInputText },
  { text: 'textDiff', type: TabInputTextDiff },
  { text: 'webview', type: TabInputWebview },
  { text: 'custom', type: TabInputCustom },
  { text: 'notebook', type: vscode.TabInputNotebook },
  { text: 'notebookDiff', type: vscode.TabInputNotebookDiff },
  { text: 'terminal', type: vscode.TabInputTerminal }
]

export function getTabType(tab: Tab): string {
  const tabType = tabTypeText.find((tabType) => {
    return tab.input instanceof tabType.type
  })
  if (tabType) {
    return tabType.text
  } else {
    return 'unknown'
  }
}

export function activate(context: vscode.ExtensionContext) {
  const tabSelectorsBasic = tabSelectorText([TabInputText, TabInputTextDiff])

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.quitTextTabs', async () => {
      const viewTypes =
        vscode.workspace
          .getConfiguration()
          .get<string[]>('quitTextTabs.viewtypes') ?? []
      const tabs = getTextTabs(
        [
          tabSelectorsBasic,
          tabSelectorVeiwType([TabInputWebview, TabInputCustom], viewTypes)
        ],
        vscode.window.tabGroups.all
      )
      await vscode.window.tabGroups.close(tabs)
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.viewActiveTabInfo', async () => {
      const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab

      if (activeTab !== undefined) {
        const tabType = getTabType(activeTab)
        const t: Record<string, any> = {}
        // Print top-level properties of activeTab
        for (const i of Object.keys(activeTab).filter((i) => i !== 'group')) {
          // console.log(i, activeTab[i as keyof Tab])
          t[i] = activeTab[i as keyof Tab]
        }
        // create text document tab
        const textDocument = await vscode.workspace.openTextDocument({
          language: 'json',
          content: JSON.stringify(
            {
              tabType,
              info: t
            },
            null,
            2
          )
        })
        // show text document tab
        await vscode.window.showTextDocument(textDocument, {
          preview: false
        })
      } else {
        vscode.window.showErrorMessage('No active tab')
      }
    })
  )
}
