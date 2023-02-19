import { Setter } from 'solid-js';
import { Buffer } from 'buffer';

export function save(code: string, s0: string, sf: string) {
	const json = {
		code,
		s0,
		sf
	};

	return Buffer.from(JSON.stringify(json)).toString('base64');
}

export function load(code?: Setter<string>, s0?: Setter<string>, sf?: Setter<string>) {
	try {
		const json = JSON.parse(Buffer.from(window.location.hash, 'base64').toString());
		if (!json.code || !json.s0 || !json.sf) {
			console.error('Error loading data');
			return null;
		}

		code && code(json.code);
		s0 && s0(json.s0);
		sf && sf(json.sf);
		return json as { code: string; s0: string; sf: string };
	} catch {
		return null;
	}
}
