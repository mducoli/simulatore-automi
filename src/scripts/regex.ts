const token = /((?!->)[^,\s])/.source

const list = /%(,+%)*/.source.replaceAll('%', token)

const line = /^[ \t]*%+[ \t]+#[ \t]*->[ \t]*%+([ \t]+%*[ \t]*)?$/.source
	.replaceAll('%', token)
	.replaceAll('#', list)


export const regex = { token, list, line }