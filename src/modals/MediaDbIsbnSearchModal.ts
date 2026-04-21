import { Modal, Setting, TextComponent, Notice } from 'obsidian';
import type MediaDbPlugin from '../main';

export class MediaDbIsbnSearchModal extends Modal {
	plugin: MediaDbPlugin;
	query = '';
	submitCallback: (isbn: string) => void;

	constructor(plugin: MediaDbPlugin, submitCallback: (isbn: string) => void) {
		super(plugin.app);
		this.plugin = plugin;
		this.submitCallback = submitCallback;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl('h2', { text: 'Search by ISBN' });

		const textComponent = new TextComponent(contentEl);
		textComponent.setPlaceholder('Enter ISBN-10 or ISBN-13');
		textComponent.inputEl.style.width = '100%';
		textComponent.onChange(value => (this.query = value));
		textComponent.inputEl.addEventListener('keydown', (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				this.submit();
			}
		});

		contentEl.createDiv({ cls: 'media-db-plugin-spacer' });

		new Setting(contentEl)
			.addButton(btn => {
				btn.setButtonText('Cancel');
				btn.onClick(() => this.close());
			})
			.addButton(btn => {
				btn.setButtonText('Search');
				btn.setCta();
				btn.onClick(() => this.submit());
			});
		
		textComponent.inputEl.focus();
	}

	submit() {
		if (!this.query.trim()) {
			new Notice('Please enter an ISBN');
			return;
		}
		this.submitCallback(this.query.trim());
		this.close();
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
