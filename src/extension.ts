'use strict'
import * as vscode from 'vscode'
import { insertNextLine, getActiveLineText, getSelectionText, replaceSelection } from './editor'

// Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
// Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
const getBytes = (c: number | undefined): number =>
    c === undefined ? 0 :
        (c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4) ?
            1 : 2

const countLength = (str: string): number => str.split('')
        .map(x => getBytes(x.codePointAt(0)))
        .reduce((x, y) => x + y)


function setHeader(symbol: string) {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
        return
    }

    const titleLength = countLength(getActiveLineText(editor))
    insertNextLine(editor, `\n${symbol.repeat(titleLength)}`)
}

function transform2DropboxRowURI() {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
        return
    }

    const url = getSelectionText(editor)
        .replace("https://www.dropbox.com/s", "https://dl.dropboxusercontent.com/s")
        .replace("?dl=0", "")

    replaceSelection(editor, url)
}

export function activate(context: vscode.ExtensionContext) {
    const register = vscode.commands.registerCommand

    context.subscriptions.push(
        register('extension.headerLV1', async () => await setHeader("=")),
        register('extension.headerLV2', async () => await setHeader("-")),
        register('extension.dropbox.transform_raw_uri', async () => await transform2DropboxRowURI()),
    )
}

export function deactivate() {
}