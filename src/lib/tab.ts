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
export type TabIgnore = { pinned?: boolean }

export function tabSelectorText(targetTypes: TabInput[]): TabSelector {
  return (tab: Tab) => {
    return targetTypes.some((targetType) => {
      return tab.input instanceof targetType
    })
  }
}

function hasViewType(tab: Tab): tab is Tab & { input: { viewType: string } } {
  return typeof (tab as any).input?.viewType === 'string'
}
export function tabSelectorVeiwType(
  targetTypes: TabAddional[],
  viewTypes: RegExp[]
): TabSelector {
  return (tab: Tab) => {
    return targetTypes.some((targetType) => {
      return (
        tab.input instanceof targetType &&
        viewTypes.some(
          (viewType) => hasViewType(tab) && viewType.test(tab.input.viewType)
        )
      )
    })
  }
}

export function getTargetTabs(
  tabSelectors: TabSelector[],
  tabs: readonly Tab[],
  ignore: TabIgnore = {}
): Tab[] {
  return tabs.filter((tab) => {
    return tabSelectors.some(
      (isTarget) => isTarget(tab) && !(ignore.pinned && tab.isPinned)
    )
  })
}
