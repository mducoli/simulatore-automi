import { Component } from 'solid-js'

const Output: Component<{ value?: string }> = (props) => {
	return (
		<div class="form-control">
			<label class="label">
				<span class="label-text">Output</span>
			</label>
			<div class="card grid place-items-center rounded-lg bg-base-300 p-3">{props.value}</div>
		</div>
	)
}

export default Output
