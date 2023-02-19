import { ColorTranslator } from 'colortranslator';
import { Component, createEffect } from 'solid-js';
import { getCSSVar } from '../scripts/utils';
import { ProgramManager } from './Program';

const Graph: Component<{ program: ProgramManager; colored: string[] }> = (props) => {
	createEffect(() => {
		props.program.colored = props.colored;

		const b = new ColorTranslator(
			getComputedStyle(document.querySelector('html')).getPropertyValue('background-color')
		).HEX;
		const a = new ColorTranslator(`hsl(${getCSSVar('bc')})`).HEX;

		d3.select('#graph').graphviz().zoom(false).renderDot(`digraph finite_state_machine {
            fontname="Helvetica,Arial,sans-serif"
            bgcolor="${b}"
            node [fontname="Helvetica,Arial,sans-serif" fontcolor="${a}" color="${a}"]
            edge [fontname="Helvetica,Arial,sans-serif" fontcolor="${a}" color="${a}"]
            rankdir=LR;
            node [shape = circle];
            ${props.program.getGraphData()}
        }`);
	});

	return (
		<div
			id="graph"
			style="text-align: center;"
			class="w-min"
			onClick={(e) => {
				console.log(e);
				e.preventDefault();
			}}
		></div>
	);
};

export default Graph;
