import * as fs from 'fs';

export class File {

	content: string;
	path: string;
	errorLines: number[] = [];

	constructor(path: string) {
		this.path = path;
	}

	async read() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, (err: Error, content: Buffer) => {
				if (err) {
					reject(err);
				} else {
					this.content = content.toString();

					resolve(this.content);
				}
			});
		});
	}

	check() {
		const content = this.content.replace(/\/\*[\s\S]*\*\//, '');
		const allLines = this.content.split('\n');
		const lines = content.split('\n').filter((line: string) => line.trim().indexOf('//') !== 0);

		this.errorLines = [];

		lines.forEach((line: string, index: number) => {
			line = line.split('//')[0];

			if (/[а-яА-ЯёЁ]/.test(line)) {
				this.errorLines.push(allLines.indexOf(line) + 1);
			}
		});

		return this.errorLines.length === 0;
	}
}