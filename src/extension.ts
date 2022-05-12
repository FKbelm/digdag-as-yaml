import * as vscode from 'vscode';
import * as Schema from "./schema.json";

export async function activate(context: vscode.ExtensionContext) {
	const redhadVscodeYaml = vscode.extensions.getExtension("redhat.vscode-yaml")!;
	if (!redhadVscodeYaml.isActive) {
		console.log("wait yaml extension");
		await redhadVscodeYaml.activate();
	}
	try {
		redhadVscodeYaml.exports.registerContributor(
			"digdag",
			(uri: string) => {
				if (uri.endsWith(".dig")) {
					return "digdag:digdag";
				}
				return undefined;
			},
			(uri: string) => {
				if (uri === "digdag:digdag") {
					return JSON.stringify(Schema);
				}
				return undefined;
			}
		);
	} catch (ex) {
		console.error(ex);
	}
}

export function deactivate() { }
