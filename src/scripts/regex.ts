const token = /((?!->)[^,\s#])/.source

const list = /%(,+%)*/.source.replaceAll('%', token)

const line = /^[ \t]*%1+[ \t]+%2[ \t]*->[ \t]*%1+([ \t]+%1*[ \t]*)?$/.source
	.replaceAll('%1', token)
	.replaceAll('%2', list)

export const regex = { token, list, line }
