import * as assert from 'assert'
import {
  tabSelectorText,
  getTargetTabs,
  tabSelectorVeiwType
} from '../../../lib/tab'

class MockText1 {
  constructor() {}
}
class MockText2 {
  constructor() {}
}
class MockViewType1 {
  viewType = 'mock1'
  constructor() {}
}
class MockOther1 {
  constructor() {}
}
class MockOther2 {
  viewType = 'mock2'
  constructor() {}
}
suite('Tabs Test Suite', () => {
  test('getTargetTabs', () => {
    assert.deepEqual(getTargetTabs([], []), [])
    const tabs = [
      { input: new MockText1() },
      { input: new MockText2() },
      { input: new MockViewType1() }
    ]
    const tabSelectors = [
      tabSelectorText([MockText1, MockText2] as any),
      tabSelectorVeiwType([MockViewType1] as any, [/mock1$/])
    ]
    assert.deepEqual(
      getTargetTabs(tabSelectors, [
        ...tabs,
        { input: new MockOther1() },
        { input: new MockOther2() }
      ] as any),
      tabs
    )
  })

  test('getTargetTabs(ignore: pinned)', () => {
    assert.deepEqual(getTargetTabs([], []), [])
    const tabs = [
      { input: new MockText1() },
      { input: new MockText2() },
      { input: new MockViewType1() }
    ]
    const tabSelectors = [
      tabSelectorText([MockText1, MockText2] as any),
      tabSelectorVeiwType([MockViewType1] as any, [/mock1$/])
    ]
    assert.deepEqual(
      getTargetTabs(
        tabSelectors,
        [
          ...tabs,
          { input: new MockText1(), isPinned: true },
          { input: new MockOther2() }
        ] as any,
        { pinned: true }
      ),
      tabs
    )
  })
})
