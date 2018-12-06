import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as glob from 'glob';
import { File } from './File';

export interface IAppOptions {
	source: string;
}

export class App extends EventEmitter{

	protected options: IAppOptions;
	protected files: File[] = [];
	protected ignoreFiles: string[] = [];

	constructor(options: IAppOptions) {
		super();

		this.options = options;

		glob(this.options.source, (err: Error, files: string[]) => {
			if (err) {
				console.log(err);
			} else {
				this.run(files);
			}
		});
	}

	async run(files: string[]) {
		console.log('Start check cyrillic symbols');

		try {
			await this.readIgnore();
			await this.readFiles(files);
			this.emit('ready');
		} catch (err) {
			console.log('Failed check files: ', err);
		}
	}

	async readIgnore() {
		return new Promise((resolve, reject) => {
			const pathToIgnore = '.check-cyrillic-ignore';

			if (fs.existsSync(pathToIgnore)) {
				fs.readFile(pathToIgnore, (err: Error, content: Buffer) => {
					if (err) {
						reject(err);
					} else {
						this.ignoreFiles = content.toString().split('\n');

						resolve();
					}
				});
			} else {
				resolve();
			}
		});
	}

	async readFiles(files: string[]) {
		return new Promise(async (resolve, reject) => {
			this.files = files
				.filter((path: string) => this.ignoreFiles.indexOf(path) === -1)
				.map((path: string) => new File(path));

			try {
				await Promise.all(this.files.map((file: File) => file.read()));

				resolve();
			} catch (err) {
				console.log('Failed read files: ', err);
				reject(err);
			}
		});
	}

	check() {
		let failedCheckCount = 0;

		this.files.forEach((file: File) => {
			if (!file.check()) {
				failedCheckCount++;
				console.log(`Cyrillic characters found in file ${file.path} on lines: ${file.errorLines.join(', ')}`);
			}
		});

		if (failedCheckCount === 0) {
			console.log(`Files with cyrillic characters not found`);
		} else {
			console.log(`Check failed, found ${failedCheckCount} files`);
		}

		return failedCheckCount === 0;
	}

}