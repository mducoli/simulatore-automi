const token = /((?!->)[^,\s])/.source

const list = /%(,+%)*/.source.replaceAll('%', token)

export const regex_line = /^[ \t]*%+[ \t]+#[ \t]*->[ \t]*%+([ \t]+%*[ \t]*)?$/.source
	.replaceAll('%', token)
	.replaceAll('#', list)
