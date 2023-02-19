import { Component } from 'solid-js';
import { ProgramManager } from './Program';

const Input: Component<{
	program: ProgramManager;
	setOutput: (a: { state: string; output: string }) => any;
}> = (props) => {
	return (
		<div class="form-control w-full">
			<label class="label">
				<span class="label-text">Input</span>
			</label>
			<input
				type="text"
				placeholder="Type here"
				class="input-bordered input w-full"
				onInput={(e) => {
					const value = (e.target as any).value as string;
					if (value.split('').every((v) => props.program.possible_inputs.has(v))) {
						props.setOutput(props.program.emulate(value));
					} else {
						(e.target as any).value = value
							.split('')
							.filter((v) => props.program.possible_inputs.has(v))
							.join('');
					}
				}}
			/>
		</div>
	);
};

export default Input;
