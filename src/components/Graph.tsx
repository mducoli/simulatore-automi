import { Component, createEffect } from 'solid-js'
import { graphviz } from 'd3-graphviz'

import './Graph.css'
import { graph } from '../scripts/program'

const Graph: Component = () => {
	createEffect(async () => {
		graphviz('#graph').fit(true).scale(1).zoom(false).renderDot(graph())
	})

	return (
		<div
			id="graph"
			style="text-align: center;"
			class="w-full"
			onClick={(e) => {
				e.preventDefault()
			}}
		></div>
	)
}

export default Graph
