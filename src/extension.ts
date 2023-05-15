import * as vscode from "vscode";
import {
    CancellationToken,
    CustomTextEditorProvider,
    ExtensionContext,
    TextDocument,
    WebviewPanel,
    window,
    workspace,
    WorkspaceEdit,
} from "vscode";

export function activate(context: vscode.ExtensionContext) {
    const editor = new MockTextEditor(context);
    context.subscriptions.push(
        window.registerCustomEditorProvider(MockTextEditor.viewType, editor)
    );

    const api = {
        getText() {
            return editor.getText();
        },
        setText(text: string) {
            editor.setText(text);
        },
    };

    return api;
}

export function deactivate() {}

class MockTextEditor implements CustomTextEditorProvider {
    public static readonly viewType = "mock-te";

    private document: TextDocument;

    constructor(private readonly context: ExtensionContext) {}

    resolveCustomTextEditor(
        document: TextDocument,
        webviewPanel: WebviewPanel,
        token: CancellationToken
    ): Thenable<void> | void {
        this.document = document;
    }

    public getText(): string {
        return this.document.getText();
    }

    public async setText(text: string): Promise<boolean> {
        try {
            const edit = new WorkspaceEdit();
            edit.replace(
                this.document.uri,
                new vscode.Range(0, 0, this.document.lineCount, 0),
                text
            );

            return workspace.applyEdit(edit);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
