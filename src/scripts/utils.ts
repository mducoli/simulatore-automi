import { createSignal } from 'solid-js'
import { compile_graph } from './program'

export function getCSSVar(name: string) {
	const root = document.querySelector(':root')!
	const style = getComputedStyle(root)
	return style.getPropertyValue('--' + name)
}

const [isDarkTheme, setIsDarkTheme] = createSignal(
	window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
)
export { isDarkTheme }

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
	setIsDarkTheme(event.matches)
	compile_graph()
})
