import * as assert from 'assert'
//import {setup,teardown} from 'mocha'

import * as vscode from 'vscode'

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.')

  function waitTagGroups(num: number): Promise<void> {
    return new Promise<void>((resolve) => {
      const id = setInterval(() => {
        if (vscode.window.tabGroups.all.length === num) {
          clearInterval(id)
          resolve()
        }
      }, 10)
    })
  }
  function waitTabs(num: number): Promise<void> {
    return new Promise<void>((resolve) => {
      const id = setInterval(() => {
        if (vscode.window.tabGroups.activeTabGroup.tabs.length === num) {
          clearInterval(id)
          resolve()
        }
      }, 10)
    })
  }
  function waitTabsNot(num: number): Promise<void> {
    return new Promise<void>((resolve) => {
      const id = setInterval(() => {
        if (vscode.window.tabGroups.activeTabGroup.tabs.length !== num) {
          clearInterval(id)
          resolve()
        }
      }, 10)
    })
  }
  // close all tabGroups each tests in before
  setup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllGroups')
    // wait
    await waitTagGroups(1)
    await waitTabs(0)
  })
  // reset settings each tests in after
  teardown(async () => {
    await vscode.workspace
      .getConfiguration()
      .update('quitTextTabs.viewtypes', undefined)
  })

  test('quit text tabs', async () => {
    // precheck
    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 0)

    // open keyboard shortcuts(non text tabs)
    await vscode.commands.executeCommand(
      'workbench.action.openGlobalKeybindings'
    )
    // create new text tab
    await vscode.commands.executeCommand(
      'workbench.action.files.newUntitledFile'
    )

    // wait
    await waitTabs(2)

    // run "quitTextTabs" command
    await vscode.commands.executeCommand('extension.quitTextTabs')
    // wait
    await waitTabsNot(2)

    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 1)
  })

  test('quit text tabs(with markdown preview)', async () => {
    // precheck
    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 0)

    // create new text tab
    await vscode.commands.executeCommand(
      'workbench.action.files.newUntitledFile'
    )

    // open preview
    await vscode.commands.executeCommand(
      'markdown.showPreview',
      vscode.Uri.file('README.md')
    )

    // wait
    await waitTabs(2)

    // run "quitTextTabs" command
    await vscode.commands.executeCommand('extension.quitTextTabs')
    // wait
    await waitTabsNot(2)
    await waitTabsNot(1)

    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 0)
  })

  test('quit text tabs(viewStyles is empty array)', async () => {
    // precheck
    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 0)

    // set [] to "quitTextTabs.viewtypes"
    await vscode.workspace
      .getConfiguration()
      .update('quitTextTabs.viewtypes', [])

    // create new text tab
    await vscode.commands.executeCommand(
      'workbench.action.files.newUntitledFile'
    )

    // open preview
    await vscode.commands.executeCommand(
      'markdown.showPreview',
      vscode.Uri.file('README.md')
    )

    // wait
    await waitTabs(2)

    // run "quitTextTabs" command
    await vscode.commands.executeCommand('extension.quitTextTabs')
    // wait
    await waitTabsNot(2)

    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 1)
  })

  test('quit text tabs(viewStyles is added)', async () => {
    // precheck
    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 0)

    // set [] to "quitTextTabs.viewtypes"
    await vscode.workspace
      .getConfiguration()
      .update('quitTextTabs.viewtypes', [
        'test.view',
        'mainThreadWebview-markdown.preview'
      ])

    // create new text tab
    await vscode.commands.executeCommand(
      'workbench.action.files.newUntitledFile'
    )

    // open preview
    await vscode.commands.executeCommand(
      'markdown.showPreview',
      vscode.Uri.file('README.md')
    )

    // wait
    await waitTabs(2)

    // run "quitTextTabs" command
    await vscode.commands.executeCommand('extension.quitTextTabs')
    // wait
    await waitTabsNot(2)
    await waitTabsNot(1)

    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 0)
  })

  test('quit text tabs(text tab only)', async () => {
    // precheck
    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 0)

    // create new text tab x2
    await vscode.commands.executeCommand(
      'workbench.action.files.newUntitledFile'
    )
    await vscode.commands.executeCommand(
      'workbench.action.files.newUntitledFile'
    )

    // wait
    await waitTabs(2)

    // run "quitTextTabs" command
    await vscode.commands.executeCommand('extension.quitTextTabs')
    // wait
    await waitTabsNot(2)
    await waitTabsNot(1)

    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 0)
  })

  test('quit text tabs(not exists text tabs)', async () => {
    // precheck
    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 0)

    // open keyboard shortcuts(non text tabs)
    await vscode.commands.executeCommand(
      'workbench.action.openGlobalKeybindings'
    )

    // wait
    await waitTabs(1)

    // run "quitTextTabs" command
    await vscode.commands.executeCommand('extension.quitTextTabs')
    // wait
    // TODO: 待つ方法を再検討
    await waitTabsNot(0)

    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 1)
  })

  test('quit text tabs(not exists any tabs)', async () => {
    // precheck
    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 0)

    // run "quitTextTabs" command
    await vscode.commands.executeCommand('extension.quitTextTabs')
    // wait
    // タブの数をチェックしたいというよりも、
    // コマンドがエラーにならないかの確認が主な目的
    await waitTabs(0)

    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 0)
  })

  test('quit text tabs(multiple tab groups)', async () => {
    // precheck
    assert.equal(vscode.window.tabGroups.all.length, 1)
    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 0)

    // open keyboard shortcuts(non text tabs)
    await vscode.commands.executeCommand(
      'workbench.action.openGlobalKeybindings'
    )
    // create new text tab
    await vscode.commands.executeCommand(
      'workbench.action.files.newUntitledFile'
    )

    // wait
    await waitTabs(2)

    // create new tab group
    await vscode.commands.executeCommand('workbench.action.splitEditor')

    // wait
    await waitTagGroups(2)
    await waitTabs(1)

    // create new text tab
    await vscode.commands.executeCommand(
      'workbench.action.files.newUntitledFile'
    )

    // wait
    // splited + created = 2
    await waitTabs(2)

    // run "quitTextTabs" command
    await vscode.commands.executeCommand('extension.quitTextTabs')
    // wait
    await waitTagGroups(1)
    await waitTabsNot(2)

    assert.equal(vscode.window.tabGroups.activeTabGroup.tabs.length, 1)
    // waitTagGroups により 1 であることは確定しているが、念のため
    assert.equal(vscode.window.tabGroups.all.length, 1)
  })
})
