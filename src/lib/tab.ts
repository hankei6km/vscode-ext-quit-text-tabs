import type {
  Tab,
  TabInputCustom,
  TabInputText,
  TabInputTextDiff,
  TabInputWebview
} from 'vscode'

type TabInput = typeof TabInputText | typeof TabInputTextDiff
type TabAddional = typeof TabInputWebview | typeof TabInputCustom

export type TabSelector = (tab: Tab) => boolean

export function tabSelectorText(targetTypes: TabInput[]): TabSelector {
  return (tab: Tab) => {
    return targetTypes.some((targetType) => {
      return tab.input instanceof targetType
    })
  }
}

export function tabSelectorVeiwType(
  targetTypes: TabAddional[],
  viewTypes: string[]
): TabSelector {
  return (tab: Tab) => {
    return targetTypes.some((targetType) => {
      return (
        tab.input instanceof targetType &&
        viewTypes.includes(tab.input.viewType)
      )
    })
  }
}

export function getTargetTabs(
  tabSelectors: TabSelector[],
  tabs: readonly Tab[]
): Tab[] {
  return tabs.filter((tab) => {
    return tabSelectors.some((isTarget) => isTarget(tab))
  })
}
