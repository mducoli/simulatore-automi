import { Component, createEffect } from 'solid-js'
import { graphviz } from 'd3-graphviz'
import { graph } from '../scripts/program'

import './Graph.css'

const Graph: Component = () => {
	createEffect(() => {
		graphviz('#graph').fit(true).scale(1).zoom(false).renderDot(graph())
	})

	return (
		<div
			id="graph"
			style="text-align: center;"
			class="flex w-full"
			onClick={(e) => {
				e.preventDefault()
			}}
		></div>
	)
}

export default Graph
