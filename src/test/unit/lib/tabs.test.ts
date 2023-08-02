import * as assert from 'assert'
import { getTargetTabs } from '../../../lib/tab'

class Mock1 {
  constructor() {}
}
class Mock2 {
  constructor() {}
}
class Mock3 {
  constructor() {}
}
suite('Tabs Test Suite', () => {
  test('getTargetTabs', () => {
    assert.deepEqual(getTargetTabs([], []), [])
    const tabs = [{ input: new Mock1() }, { input: new Mock2() }]
    assert.deepEqual(
      getTargetTabs(
        [Mock1, Mock2] as any,
        [...tabs, { input: new Mock3() }] as any
      ),
      tabs
    )
  })
})
