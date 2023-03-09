import { Component, createEffect } from 'solid-js'
import { graphviz } from 'd3-graphviz'
import { graph } from '../scripts/program'

import './Graph.css'

const Graph: Component = () => {
	createEffect(() => {
		graphviz('#graph').fit(true).scale(1).zoom(false).renderDot(graph())

		// prettier-ignore
		// idk why but webkit doesn't recalculate max-width after un update
		if (navigator.userAgent.includes('AppleWebKit')) { const gr: any = document.getElementById('graph'); gr.style.zoom = 1.0000001; setTimeout(() => { gr.style.zoom = 1 }, 50) }
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
