import { Component, createEffect, createSignal } from 'solid-js';
import Input from './components/Input';
import Output from './components/Output';
import Graph from './components/Graph';
import Program, { ProgramManager } from './components/Program';
import Warning from './components/Warning';
// import { load } from './scripts/saving';

const App: Component = () => {
	const [instant, setInstant] = createSignal(window.localStorage.getItem('instant') == 'true');
	createEffect(() => {
		window.localStorage.setItem('instant', instant() + '');
	});

	const [speed, setSpeed] = createSignal(parseInt(window.localStorage.getItem('speed')) || 50);
	createEffect(() => {
		window.localStorage.setItem('speed', speed() + '');
	});

	const [warn, setWarn] = createSignal('');
	const [program, setProgram] = createSignal<ProgramManager>();

	// if (load()) {
	// 	const l = load();
	// 	const [s0, _1] = createSignal(l.s0);
	// 	const [sf, _2] = createSignal(l.sf);
	// 	const pgm = new ProgramManager(l.code, s0, sf);
	// 	setProgram(pgm);
	// }

	const [output, setOutput] = createSignal<{
		state: string;
		output: string;
	}>({ state: '', output: '' });

	const [colored, setColored] = createSignal<string[]>([]);

	createEffect(() => {
		if (program() && output().state != '') {
			setColored([output().state]);
		}
	});

	return (
		<div class="container mx-auto my-3">
			<div class="flex gap-3">
				<Input program={program()} setOutput={setOutput} />
				<Output value={output().output} />
				{/* <InstantToggle value={instant()} onChange={setInstant} /> */}
				<div class="form-control">
					<label class="label">
						<span class="label-text">Stato</span>
					</label>
					<span class="my-auto mx-auto">{output().state}</span>
				</div>
			</div>

			{/* {!instant() && (
				<div class="mt-3 flex gap-3">
					<Controls play={false} />
					<SpeedSlider value={speed()} onChange={setSpeed} />
				</div>
			)} */}

			{warn() != '' && <Warning msg={warn()}></Warning>}

			<div class="flex flex-wrap gap-3" classList={{ 'mt-3': warn() != '', 'mt-12': warn() == '' }}>
				<Graph program={program()} colored={colored()} />
				<Program onChange={setProgram} setWarn={setWarn} />
			</div>
		</div>
	);
};

export default App;
