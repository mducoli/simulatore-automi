import { Component } from 'solid-js'
import Graph from './components/Graph'
import Input from './components/Input'
import Output from './components/Output'
import Program from './components/Program'
import { coloured, output } from './scripts/program'

const App: Component = () => {
	return (
		<div class="container mx-auto my-3">
			<div class="flex gap-3">
				<Input />
				<Output value={output()} />
				<div class="form-control">
					<label class="label">
						<span class="label-text">Stato</span>
					</label>
					<span class="my-auto mx-auto">{coloured()}</span>
				</div>
			</div>

			<div class="mt-12 flex flex-wrap gap-3">
				<Graph />
				<Program />
			</div>
		</div>
	)
}

export default App
