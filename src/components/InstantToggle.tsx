import { Component } from 'solid-js';

const InstantToggle: Component<{ value: boolean; onChange: (v: boolean) => any }> = (props) => {
	return (
		<div class="form-control">
			<label class="label">
				<span class="label-text">Instant</span>
			</label>
			<input
				type="checkbox"
				class="toggle my-auto mx-auto"
				checked={props.value}
				onChange={(e) => {
					props.onChange((e.target as any).checked as boolean);
				}}
			/>
		</div>
	);
};

export default InstantToggle;
