import {addIcon, App, Command, Modal, Notice, Plugin} from 'obsidian';
import {AnkiConnector} from 'anki-markdown';

export default class AnkiMarkdownPlugin extends Plugin {
	connector: AnkiConnector = new AnkiConnector();
	actionsShown: boolean = false;
	icons: HTMLElement[] = [];
	commands: Command[] = [];

	async onload() {
		this.addActionsIfAnkiConnected()
		this.registerInterval(window.setInterval(() => this.addActionsIfAnkiConnected(), 10 * 1000));
		this.addGenerateCommand();
	}

	onunload() {
		this.icons.forEach(icon => icon.detach())
	}

	private async addActionsIfAnkiConnected() {
		const connected = await this.connector.checkConnection()
		if (connected && !this.actionsShown) {
			this.addActions();
			this.actionsShown = true;
		}
		if (!connected && this.actionsShown) {
			this.icons.forEach(e => e.detach())
			this.icons = []
			this.actionsShown = false;
		}
	}

	private addActions() {
		addIcon('push', `<path fill="currentColor" stroke="currentColor" d="M 27.00,3.53 C 18.43,6.28 16.05,10.38 16.00,19.00 16.00,19.00 16.00,80.00 16.00,80.00 16.00,82.44 15.87,85.73 16.74,88.00 20.66,98.22 32.23,97.00 41.00,97.00 41.00,97.00 69.00,97.00 69.00,97.00 76.63,96.99 82.81,95.84 86.35,88.00 88.64,82.94 88.00,72.79 88.00,67.00 88.00,67.00 88.00,24.00 88.00,24.00 87.99,16.51 87.72,10.42 80.98,5.65 76.04,2.15 69.73,3.00 64.00,3.00 64.00,3.00 27.00,3.53 27.00,3.53 Z M 68.89,15.71 C 74.04,15.96 71.96,19.20 74.01,22.68 74.01,22.68 76.72,25.74 76.72,25.74 80.91,30.85 74.53,31.03 71.92,34.29 70.70,35.81 70.05,38.73 67.81,39.09 65.64,39.43 63.83,37.03 61.83,36.00 59.14,34.63 56.30,35.24 55.08,33.40 53.56,31.11 56.11,28.55 56.20,25.00 56.24,23.28 55.32,20.97 56.20,19.35 57.67,16.66 60.89,18.51 64.00,17.71 64.00,17.71 68.89,15.71 68.89,15.71 Z M 43.06,43.86 C 49.81,45.71 48.65,51.49 53.21,53.94 56.13,55.51 59.53,53.51 62.94,54.44 64.83,54.96 66.30,56.05 66.54,58.11 67.10,62.74 60.87,66.31 60.69,71.00 60.57,74.03 64.97,81.26 61.40,83.96 57.63,86.82 51.36,80.81 47.00,82.22 43.96,83.20 40.23,88.11 36.11,87.55 29.79,86.71 33.95,77.99 32.40,74.18 30.78,70.20 24.67,68.95 23.17,64.97 22.34,62.79 23.39,61.30 25.15,60.09 28.29,57.92 32.74,58.49 35.44,55.57 39.11,51.60 36.60,45.74 43.06,43.86 Z" />`)
		addIcon('pull', `<path fill="currentColor" stroke="currentColor" d="M 27.00,3.53 C 18.43,6.28 16.05,10.38 16.00,19.00 16.00,19.00 16.00,80.00 16.00,80.00 16.00,82.44 15.87,85.73 16.74,88.00 20.66,98.22 32.23,97.00 41.00,97.00 41.00,97.00 69.00,97.00 69.00,97.00 76.63,96.99 82.81,95.84 86.35,88.00 88.64,82.94 88.00,72.79 88.00,67.00 88.00,67.00 88.00,24.00 88.00,24.00 87.99,16.51 87.72,10.42 80.98,5.65 76.04,2.15 69.73,3.00 64.00,3.00 64.00,3.00 27.00,3.53 27.00,3.53 Z M 68.89,15.71 C 74.04,15.96 71.96,19.20 74.01,22.68 74.01,22.68 76.72,25.74 76.72,25.74 80.91,30.85 74.53,31.03 71.92,34.29 70.70,35.81 70.05,38.73 67.81,39.09 65.64,39.43 63.83,37.03 61.83,36.00 59.14,34.63 56.30,35.24 55.08,33.40 53.56,31.11 56.11,28.55 56.20,25.00 56.24,23.28 55.32,20.97 56.20,19.35 57.67,16.66 60.89,18.51 64.00,17.71 64.00,17.71 68.89,15.71 68.89,15.71 Z M 43.06,43.86 C 49.81,45.71 48.65,51.49 53.21,53.94 56.13,55.51 59.53,53.51 62.94,54.44 64.83,54.96 66.30,56.05 66.54,58.11 67.10,62.74 60.87,66.31 60.69,71.00 60.57,74.03 64.97,81.26 61.40,83.96 57.63,86.82 51.36,80.81 47.00,82.22 43.96,83.20 40.23,88.11 36.11,87.55 29.79,86.71 33.95,77.99 32.40,74.18 30.78,70.20 24.67,68.95 23.17,64.97 22.34,62.79 23.39,61.30 25.15,60.09 28.29,57.92 32.74,58.49 35.44,55.57 39.11,51.60 36.60,45.74 43.06,43.86 Z" />`)

		this.icons.push(this.addRibbonIcon('push', 'Push to Anki', async (evt: MouseEvent) => {
			await this.pushToAnki();
		}));

		this.icons.push(this.addRibbonIcon('pull', 'Pull from Anki', async (evt: MouseEvent) => {
			await this.pullFromAnki();
		}));

		this.icons.push(this.addRibbonIcon('plus', 'Add deck from Anki', async (evt: MouseEvent) => {
			let names = await this.connector.getDeckNames()
			names = names.filter(checked => !names.find(n => n != checked && n.startsWith(checked)))
			new DecksModal(this.app, names, this.connector).open()
			new Notice(`Success`);
		}));
	}

	private async pullFromAnki() {
		const activeFile = this.app.workspace.getActiveFile()
		if (!activeFile) return
		try {
			const content = await this.app.vault.read(activeFile);
			const result = await this.connector.pullFile(content);
			await this.app.vault.modify(activeFile, result.markdown)
			new Notice(`Success`);
		} catch (e) {
			console.log(e)
			new Notice(`Error while pushing cards ${e?.message}`);
		}
	}

	private async pushToAnki() {
		const activeFile = this.app.workspace.getActiveFile()
		if (!activeFile) return
		try {
			const content = await this.app.vault.read(activeFile);
			const result = await this.connector.pushFile(content);
			await this.app.vault.modify(activeFile, result.markdown)
			new Notice(`Success\nAdded: ${result.ankiModificationsCounts?.addedCount}\nRemoved: ${result.ankiModificationsCounts?.removedCount}\nUpdated: ${result.ankiModificationsCounts?.updatedCount}\nUnchanged: ${result.ankiModificationsCounts?.unchangedCount}`);
		} catch (e) {
			console.log(e)
			new Notice(`Error while pushing cards ${e?.message}`);
		}
	}

	private addGenerateCommand() {
		this.commands.push(this.addCommand({
			id: 'anki-markdown-generate',
			name: 'Anki Markdown generate',
			checkCallback: (checking: boolean) => {
				const activeFile = this.app.workspace.getActiveFile();
				if (activeFile) {
					this.app.vault.read(activeFile).then(content => {
						if (content.trim().startsWith("---")) {
							// If checking is true, we're simply "checking" if the command can be run.
							// If checking is false, then we want to actually perform the operation.
							if (!checking) {
								this.pushToAnki()
								this.connector.exportAnkiPackage(content)
								const article = this.connector.generateArticle(content)
								if (article) {
									const parentPath = activeFile.parent?.path
									const path = parentPath ? parentPath + "/" : ""
									this.app.vault.create(path + article.name, article.content)
								}
							}
							return true;
						}
					})
				}
				return true;
			}
		}));
	}
}

class DecksModal extends Modal {
	constructor(app: App, public names: Array<string>, public connector: AnkiConnector) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.createEl('h3', {text: 'Add deck'})
		const modalContainer = contentEl.createDiv({cls: 'anki-decks-container'});
		this.names.map((deckName: string) => {
			modalContainer.createEl("p")
				.createEl("a", {text: deckName, cls: 'anki-decks-item'})
				.addEventListener('click', async (e) => {
					try {
						const data = await this.connector.createFile(deckName)
						const fileName = deckNameToFileName(deckName)
						const activeFilePath = this.app.workspace.getActiveFile()?.parent?.path
						const path = activeFilePath ? activeFilePath + "/" : ""
						const file = await this.app.vault.create(path + "/" + fileName, data.markdown)
						this.app.workspace.getLeaf().openFile(file);
					} catch (e) {
						new Notice(`Error ${e.message}`);
					}
					this.close();
				});
		});
	}

	onClose() {
		this.contentEl.empty();
	}
}

function deckNameToFileName(deckName: string): string {
	return deckName.replace(/::/g, "__") + ".md"
}
