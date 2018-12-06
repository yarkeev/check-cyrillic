#!/usr/bin/env node

import * as fs from 'fs';
import { EventEmitter } from 'events';
import * as commander from 'commander';
import { App } from './App';

export interface IPackage {
	version: string;
}

class Cli extends EventEmitter {

	protected pkg: IPackage;
	protected app: App;

	constructor() {
		super();

		this.parsePkg();

		const options = commander
			.option('-s, --source <source>', 'source files')
			.version(this.pkg.version)
			.parse(process.argv);

		this.app = new App({
			source: options.source,
		});

		this.app.on('ready', () => this.emit('ready'));
	}

	parsePkg() {
		this.pkg = JSON.parse(fs.readFileSync('./package.json').toString());
	}

	check() {
		return this.app.check();
	}

}

const cli = new Cli();

cli.on('ready', () => {
	process.exit(cli.check() ? 0 : 1);
});