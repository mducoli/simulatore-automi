import { StreamParser, StringStream, HighlightStyle } from '@codemirror/language'
import { tags } from "@lezer/highlight"
import { regex } from './regex';
import { CompletionContext } from "@codemirror/autocomplete"
import { linter as _linter, Diagnostic } from "@codemirror/lint"

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

const a = [1, 2, "██", () => { }] // █
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

    const lineAtIndex = (line: number) => {
        for (let i = 0; i < view.state.doc.length; i++) {
            const ll = view.state.doc.lineAt(i)
            if (ll.number == line) return ll
        }
        return null
    }

    for (let [i, line] of view.state.doc.toJSON().entries()) {

        line = line.replace(/\s+/g, ' ').trim()
        line = line.split("#")[0]
        if (line == '') {
            continue
        }

        const ll = lineAtIndex(i + 1)

        if (ll && !line.match(regex.line)) {
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