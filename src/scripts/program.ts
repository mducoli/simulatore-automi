import Color from 'color'
import Map2 from 'map2'
import { createSignal } from 'solid-js'
import { regex_line } from './regex'
import { load } from './saving'
import { bg_color, getCSSVar } from './utils'

const [input, setInput] = createSignal('')
const [output, setOutput] = createSignal('')
const [coloured, setColoured] = createSignal('')
const [s0, setS0] = createSignal('')

const [sf, setSf] = createSignal('')
const [code, setCode] = createSignal('')
const [graph, setGraph] = createSignal('')
const [errLines, setErrLines] = createSignal<number[]>([])

export { input, setInput, output, graph, code, setCode, s0, setS0, sf, setSf, errLines, coloured }

const graph_map: Map2<string, string, [string, string]> = new Map2()
const program_map: Map2<string, string, [string, string]> = new Map2()

export const possible_inputs: Set<string> = new Set()

let tCode: string
export const update = () => {
	// parse code
	if (code() != tCode) {
		tCode = code()
		parse()
	} else {
		console.log('skipping parsing')
	}
	// execute input
	execute()
	// compile graph
	compile_graph()
}

const parse = () => {
	let errLines: number[] = []
	graph_map.clear()
	program_map.clear()
	possible_inputs.clear()

	for (let [i, line] of code().split('\n').entries()) {
		line = line.replace(/\s+/g, ' ').trim()
		if (line == '') {
			continue
		}

		if (!line.match(regex_line)) {
			errLines.push(i + 1)
			continue
		}

		const p = line.split('->').map((v) => v.trim())
		const a = p[0].split(' ')
		const b = p[1].split(' ')

		graph_map.set(a[0], a[1], [b[0], b[1]])
		for (const inp of a[1].split(',')) {
			program_map.set(a[0], inp, [b[0], b[1]])
			possible_inputs.add(inp)
		}
	}

	setErrLines(errLines)
}

const compile_graph = () => {
	const base_color = new Color(`hsl(${getCSSVar('bc')})`).hex()
	const primary_color = new Color(`hsl(${getCSSVar('p')})`).hex()

	let res = ''
	if (sf() != '') {
		res += `node [shape = doublecircle]; "${sf()}";\n`
	}
	res += 'node [shape = circle];\n'
	for (const [S1, i, [S2, o]] of graph_map.entries()) {
		res += `"${S1}" -> "${S2}" [label = "${o ? i + '/' + o : i}"];\n`
	}
	if (coloured()) {
		res += `"${coloured()}" [color="${primary_color}"]\n`
	}

	const graph = `digraph finite_state_machine {
            fontname="Helvetica"
            bgcolor="${bg_color.hex()}"
            node [fontname="Helvetica" fontcolor="${base_color}" color="${base_color}"]
            edge [fontname="Helvetica" fontcolor="${base_color}" color="${base_color}"]
            rankdir=LR;
            node [shape = circle width=0.5];
            ${res}
        }`

	setGraph(graph)
}

const execute = () => {
	let state = s0()
	let output = ''

	for (const c of input()) {
		if (!possible_inputs.has(c)) {
			console.warn('Invalid input')
			continue
		}

		if (!program_map.has(state, c)) {
			setColoured('')
			setOutput('')
			return
		}

		const [s, o] = program_map.get(state, c) as [string, string]
		state = s
		output = o
	}

	setColoured(state)
	setOutput(output)
}

load(setCode, setS0, setSf)
update()
