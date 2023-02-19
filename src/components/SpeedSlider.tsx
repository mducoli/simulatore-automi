import { Component } from 'solid-js';

const SpeedSlider: Component<{ value: number; onChange: (v: number) => any }> = (props) => {
	return (
		<div class="form-control mr-auto">
			<label class="label">
				<span class="label-text">Velocità: {(101 - props.value) * 10} ms / iterazione</span>
			</label>
			<input
				type="range"
				min="1"
				max="100"
				value={props.value}
				class="range range-xs my-auto w-52"
				onChange={(e) => {
					props.onChange(parseInt((e.target as any).value));
				}}
			/>
		</div>
	);
};

export default SpeedSlider;
