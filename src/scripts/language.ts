import { StreamParser, StringStream, HighlightStyle } from '@codemirror/language'
import { tags } from "@lezer/highlight"
import { regex } from './regex';
import { CompletionContext } from "@codemirror/autocomplete"
import { linter as _linter, Diagnostic } from "@codemirror/lint"
import { EditorView } from 'codemirror';

export const parser: StreamParser<string> = {
    token: (stream, state) => {

        if (stream.match("#")) {
            stream.skipToEnd()
            return "comment"
        };

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
    { tag: tags.comment, color: "#6a9955" },
    { tag: tags.punctuation, color: "#d4d4d4" },
    { tag: tags.string, color: "#ce9178" },
    { tag: tags.keyword, color: "#569cd6" }
])

export const style_light = HighlightStyle.define([
    { tag: tags.invalid, color: "#ff0000", },
    { tag: tags.comment, color: "#008000" },
    { tag: tags.punctuation, color: "#000000" },
    { tag: tags.string, color: "#a31515" },
    { tag: tags.keyword, color: "#0000ff" }
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

    for (let [i, line] of view.state.doc.toJSON().entries()) {

        line = line.replace(/\s+/g, ' ').trim()
        line = line.split("#")[0]
        if (line == '') {
            continue
        }

        const ll = view.state.doc.line(i + 1)

        if (!line.match(regex.line)) {
            diagnostics.push({
                from: ll.from,
                to: ll.to,
                severity: "error",
                message: "Sintassi errata"
            })
        }
    }

    return diagnostics
})

export const theme = EditorView.theme({
    '&': { backgroundColor: '#1e1e1e' },
    '.cm-lintRange-error': { backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="6" height="3">%3Cpath%20d%3D%22m0%202.5%20l2%20-1.5%20l1%200%20l2%201.5%20l1%200%22%20stroke%3D%22%23ed4b4b%22%20fill%3D%22none%22%20stroke-width%3D%22.7%22%2F%3E</svg>') !important` },
    '.cm-cursor': { borderLeft: "2px solid #aeafad" },
    '.cm-activeLine': { background: 'rgba(0,0,0,0)', "box-shadow": 'inset 0px -2px 0px #282828, inset 0px 2px 0px #282828' }
})

export const theme_light = EditorView.theme({
    '&': { backgroundColor: '#ffffff' },
    '.cm-lintRange-error': { backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="6" height="3">%3Cpath%20d%3D%22m0%202.5%20l2%20-1.5%20l1%200%20l2%201.5%20l1%200%22%20stroke%3D%22%23e51400%22%20fill%3D%22none%22%20stroke-width%3D%22.7%22%2F%3E</svg>') !important` },
    '.cm-cursor': { borderLeft: "2px solid #000000" },
    '.cm-activeLine': { background: 'rgba(0,0,0,0)', "box-shadow": 'inset 0px -2px 0px #eeeeee, inset 0px 2px 0px #eeeeee' }
})