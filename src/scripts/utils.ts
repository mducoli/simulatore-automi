import Color from 'color'

export function getCSSVar(name: string) {
	const root = document.querySelector(':root')!
	const style = getComputedStyle(root)
	return style.getPropertyValue('--' + name)
}

export const bg_color = new Color(
	getComputedStyle(document.querySelector('html')!).getPropertyValue('background-color')
)
