'use strict'
import * as vscode from 'vscode'

const edit = (editor: vscode.TextEditor, editFunc: (editBuilder: vscode.TextEditorEdit) => void): Promise<{}> =>
    new Promise((resolve, reject) => {
        editor.edit(editBuilder => {
            editFunc(editBuilder)
            resolve()
        })
    })

export const getActiveLineText = (editor: vscode.TextEditor): string =>
    editor.document.lineAt(editor.selection.active.line).text

export const getSelectionText = (editor: vscode.TextEditor): string =>
    editor.document.getText(editor.selection)


export const replaceActiveLine = async (editor: vscode.TextEditor, str: string): Promise<{}> =>
    await edit(editor, editBuilder => {
        const activeLine = editor.document.lineAt(editor.selection.active.line).range
        editBuilder.replace(activeLine, str)
    })

export const replaceSelection = async (editor: vscode.TextEditor, str: string): Promise<{}> =>
    await edit(editor, editBuilder => editBuilder.replace(editor.selection, str))


export const insertNextLine = async (editor: vscode.TextEditor, str: string): Promise<{}> =>
    await edit(editor, editBuilder => editBuilder.insert(
        new vscode.Position(editor.selection.active.line, 999), str)
    )