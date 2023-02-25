import { StreamParser, StringStream, HighlightStyle } from '@codemirror/language'
import { tags } from "@lezer/highlight"
import { regex } from './regex';
import { CompletionContext } from "@codemirror/autocomplete"
import { linter as _linter, Diagnostic } from "@codemirror/lint"

export const parser: StreamParser<string> = {
    token: (stream, state) => {

        if (stream.column() == 0) {
            // full line comment
            if (stream.match(/^\s*#.*$/)) {
                stream.skipToEnd()
                return "lineComment"
            };
        }

        if (stream.match(",")) {
            return "punctuation"
        }

        if (stream.match(new RegExp(regex.token + '+'))) {
            return "string"
        }


        if (stream.match("->")) {
            return "keyword"
        }

        stream.next();
        return "";
    }
};

export const style = HighlightStyle.define([
    { tag: tags.invalid, color: "#ff0000", },
    { tag: tags.lineComment, color: "#6a9955" },
    { tag: tags.punctuation, color: "#d4d4d4" },
    { tag: tags.string, color: "#ce9178" },
    { tag: tags.keyword, color: "#569cd6" }
])

export const completition = (ctx: CompletionContext) => {
    let word = ctx.matchBefore(/\w*/)
    if (!word) return null
    if (word.from == word.to && !ctx.explicit) return null
    return {
        from: word.from,
        options: [
            {
                label: "->", type: "keyword", info: `usage:
            current_state inputs -> next_state output` },
        ]
    }
}

export const linter = _linter(view => {
    let diagnostics: Diagnostic[] = []

    let chs = 0
    for (let [i, line] of view.state.doc.toJSON().entries()) {

        line = line.replace(/\s+/g, ' ').trim()
        if (line == '' || line.startsWith('#')) {
            chs += line.length + 1
            continue
        }

        if (!line.match(regex.line)) {
            diagnostics.push({
                from: chs,
                to: chs + line.length,
                severity: "error",
                message: "Sintassi errata"
            })
        }

        chs += line.length + 1
    }

    return diagnostics
})