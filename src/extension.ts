import * as vscode from 'vscode';
import * as Schema from "./schema.json";

async function updateCustomTags() {
	const includeTag = "!include Mapping";

	let customTags = vscode.workspace.getConfiguration('yaml', null).get<string[]>("customTags");
	if (!Array.isArray(customTags)) {
		customTags = [includeTag];
	} else if (!customTags.includes(includeTag)) {
		customTags.push(includeTag);
	}
	// eslint-disable-next-line curly
	else return;

	await vscode.workspace.getConfiguration('yaml', null).update('customTags', customTags, vscode.ConfigurationTarget.Global);
}
export async function activate(context: vscode.ExtensionContext) {
	const redhadVscodeYaml = vscode.extensions.getExtension("redhat.vscode-yaml")!;
	if (!redhadVscodeYaml.isActive) {
		console.log("wait yaml extension");
		await redhadVscodeYaml.activate();
	}
	try {
		updateCustomTags();
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
