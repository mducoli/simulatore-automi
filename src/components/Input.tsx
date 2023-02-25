import { Component } from 'solid-js'
import { possible_inputs, setInput, update } from '../scripts/program'

const Input: Component = () => {
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
					e.currentTarget.value = e.currentTarget.value
						.split('')
						.filter((v) => possible_inputs.has(v))
						.join('')
					setInput(e.currentTarget.value)
					update()
				}}
			/>
		</div>
	)
}

export default Input
