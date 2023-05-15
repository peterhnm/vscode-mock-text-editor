# Mock Text Editor

A mock-up for a VS Code Custom Text Editor to test the communication with
the [Miranum Copilot](https://github.com/FlowSquad/miranum-copilot).

1. Export the API of the custom text editor
    ```typescript
    // extension.ts
    const api = {
      getText() {
        return editor.getText();
      },
      setText(text: string) {
        editor.setText(text);
      },
    };
    return api;
    ```

2. Use the API in the [Miranum Copilot](https://github.com/FlowSquad/miranum-copilot/pull/18)
    ```typescript
    export class CopilotPanel {

      // ...

      private registerCommands(): void {
        const customTextEditor = extensions.getExtension("miragon-gmbh.mock-te"); // get extension with the extensionID
        const importedApi = customTextEditor?.exports;

        this.context.subscriptions.push(
          commands.registerCommand("copilot.setBpmn", () => {
            importedApi.setText("This is a test.");
          })
        );

        this.context.subscriptions.push(
          commands.registerCommand("copilot.getBpmn", () => {
            const bpmn = importedApi.getText();
            window.showInformationMessage(bpmn);
          })
        );
      }

      // ...

    }
    ```

## Important Notes:

1. Add `extensionDependencies` to
   the [package.json](https://github.com/FlowSquad/miranum-copilot/blob/feat/communication_btw_plugins/package.json#L35)
   of the calling extension
2. The called extension has to be activated. (Which is done by installing/activating the extension)
3. *To access the document, it must be open.*