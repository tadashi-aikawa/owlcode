'use strict'
import * as vscode from 'vscode'
import { insertNextLine, getActiveLineText, getSelectionText } from './editor'
import * as editorUtil from './editor'

const toSnippetJson = (body: string): string => `
"<key>": {
    "prefix": "<prefix>",
    "body": [
${body}
    ]
}
`

// Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
// Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
const getBytes = (c: number | undefined): number =>
    c === undefined ? 0 :
        (c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4) ?
            1 : 2

const countLength = (str: string): number => str.split('')
    .map(x => getBytes(x.codePointAt(0)))
    .reduce((x, y) => x + y)

const replaceSelection = (replacer: (selectionText: string) => string) => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
        return
    }

    editorUtil.replaceSelection(editor, replacer(getSelectionText(editor)))
}

const encodeSelection = () => replaceSelection(encodeURI)
const decodeSelection = () => replaceSelection(decodeURI)
const transform2DropboxRowURI = () => replaceSelection(s => s
    .replace("https://www.dropbox.com/s", "https://dl.dropboxusercontent.com/s")
    .replace("?dl=0", "")
)
const transform2Snippet = () => replaceSelection(s =>
    toSnippetJson(s
        .replace(/"/g, `\\"`)
        .replace(/\t/g, "\\t")
        .split("\n")
        .map(x => `        "${x}",`)
        .join("\n")
    )
)

function setHeader(symbol: string) {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
        return
    }

    const titleLength = countLength(getActiveLineText(editor))
    insertNextLine(editor, `\n${symbol.repeat(titleLength)}`)
}

export function activate(context: vscode.ExtensionContext) {
    const register = vscode.commands.registerCommand

    context.subscriptions.push(
        register('extension.headerLV1', async () => await setHeader("=")),
        register('extension.headerLV2', async () => await setHeader("-")),
        register('extension.encodeSelection', async () => await encodeSelection()),
        register('extension.decodeSelection', async () => await decodeSelection()),
        register('extension.dropbox.transform_raw_uri', async () => await transform2DropboxRowURI()),
        register('extension.transform_to_snippet', async () => await transform2Snippet()),
    )
}

export function deactivate() {
}