export function getCSSVar(name: string) {
	const root = document.querySelector(':root');
	const style = getComputedStyle(root);
	return style.getPropertyValue('--' + name);
}
