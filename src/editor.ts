'use strict'
import * as vscode from 'vscode'

export const getActiveLineText = (editor: vscode.TextEditor): string =>
    editor.document.lineAt(editor.selection.active.line).text

export const replaceActiveLine = async (editor: vscode.TextEditor, str: string): Promise<{}> =>
    await new Promise((resolve, reject) => {
        editor.edit(editBuilder => {
            const activeLine = editor.document.lineAt(editor.selection.active.line).range
            editBuilder.replace(activeLine, str)
            resolve()
        })
    })

export const insertNextLine = async (editor: vscode.TextEditor, str: string): Promise<{}> =>
    await new Promise((resolve, reject) => {
        editor.edit(editBuilder => {
            const currentPos = editor.selection.active
            editBuilder.insert(new vscode.Position(currentPos.line, 999), str)
            resolve()
        })
    })
