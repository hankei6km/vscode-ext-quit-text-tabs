import type { TabInputText, TabInputTextDiff } from 'vscode'
import type { Tab } from 'vscode'

type TabInput = typeof TabInputText | typeof TabInputTextDiff

export function getTargetTabs(
  targetTypes: TabInput[],
  tabs: readonly Tab[]
): Tab[] {
  return tabs.filter((tab) => {
    return targetTypes.some((targetType) => {
      return tab.input instanceof targetType
    })
  })
}
