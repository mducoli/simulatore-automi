import { ColorTranslator } from 'colortranslator';
import Map2 from 'map2';
import { Accessor, Component, createSignal, Setter } from 'solid-js';
import { load, save } from '../scripts/saving';
import { getCSSVar } from '../scripts/utils';

const P: Component<{ onChange: (v: ProgramManager) => any; setWarn: Setter<string> }> = (props) => {
	const [code, setCode] = createSignal(``);
	const [s0, setS0] = createSignal('');
	const [sf, setSf] = createSignal('');

	if (load()) {
		const l = load();
		setCode(l.code);
		setS0(l.s0);
		setSf(l.sf);
		console.log('FIRST LOAD');
	}

	return (
		<div class="form-control flex-grow">
			<label class="label">
				<span class="label-text">Programma</span>
			</label>
			<textarea
				class="textarea-bordered textarea h-96 w-full"
				placeholder="S0 1 -> S1 F"
				disabled={new URLSearchParams(window.location.search).has('disabled')}
				onInput={(e) => {
					setCode((e.target as any).value);
					const pgm = new ProgramManager((e.target as any).value as string, s0, sf);
					props.onChange(pgm);
					if (pgm.errors.length > 0) {
						props.setWarn('Error parsing line(s) ' + pgm.errors.join(' '));
					} else {
						props.setWarn('');
					}
				}}
				value={code()}
			></textarea>
			<div class="flex w-full gap-3">
				<div class="form-control w-full max-w-xs">
					<label class="label">
						<span class="label-text">Stato iniziale</span>
					</label>
					<input
						type="text"
						placeholder="S0"
						class="input-bordered input w-full max-w-xs"
						value={s0()}
						onInput={(e) => {
							setS0((e.target as any).value);
						}}
						disabled={new URLSearchParams(window.location.search).has('disabled')}
					/>
				</div>
				<div class="form-control w-full max-w-xs">
					<label class="label">
						<span class="label-text">Stato finale</span>
					</label>
					<input
						type="text"
						placeholder="Sf"
						class="input-bordered input w-full max-w-xs"
						value={sf()}
						onInput={(e) => {
							setSf((e.target as any).value);
						}}
						disabled={new URLSearchParams(window.location.search).has('disabled')}
					/>
				</div>
				{!new URLSearchParams(window.location.search).has('disabled') && (
					<button
						class="btn-primary btn mt-9 ml-auto"
						onClick={() => {
							console.log(code(), s0(), sf());
							window.location.hash = save(code(), s0(), sf());
						}}
					>
						Save
					</button>
				)}
			</div>
		</div>
	);
};

export default P;

type State = string;
type Input = string;
type Output = string;
export class ProgramManager {
	code: Map2<State, Input, [State, Output]> = new Map2();
	errors: number[] = [];
	possible_inputs: Set<string> = new Set();
	s0: Accessor<string>;
	sf: Accessor<string>;
	colored: string[] = [];

	constructor(v: string, s0: Accessor<string>, sf: Accessor<string>) {
		this.s0 = s0;
		this.sf = sf;
		for (const [i, ins] of v.split('\n').entries()) {
			if (
				(ins.match(/->/g) || []).length > 1 ||
				!ins.match(/^(\s+)?\S+\s\S(\s+)?->(\s+)?\S+\s\S+(\s+)?$/)
			) {
				this.errors.push(i + 1);
				continue;
			}
			const p = ins.split('->').map((v) => v.trim());
			const a = p[0].split(' ');
			const b = p[1].split(' ');

			this.code.set(a[0], a[1], [b[0], b[1]]);
			this.possible_inputs.add(a[1]);
		}
	}

	getGraphData(): string {
		let res = `node [shape = doublecircle]; "${this.sf()}";\nnode [shape = circle];\n`;
		for (const [S1, i, [S2, o]] of this.code.entries()) {
			res += `"${S1}" -> "${S2}" [label = "${i}/${o}"];\n`;
		}
		for (const s of this.colored) {
			res += `"${s}" [color="${new ColorTranslator(`hsl(${getCSSVar('p')})`).HEX}"]\n`;
		}
		return res;
	}

	emulate(input: string): { state: string; output: string } {
		let state = this.s0();
		let output = '';

		for (const c of input) {
			if (!this.possible_inputs.has(c)) {
				console.warn('Invalid input');
				continue;
			}

			console.log(this.code);
			console.log(state, c);
			const [s, o] = this.code.get(state, c);
			state = s;
			output = o;
		}

		return {
			state,
			output
		};
	}
}
