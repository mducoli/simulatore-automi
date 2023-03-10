import Fa from 'solid-fa'
import { Component, createEffect, onCleanup, onMount } from 'solid-js'
import { code, errLines, s0, setCode, setS0, setSf, sf, update } from '../scripts/program'
import { save } from '../scripts/saving'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { basicSetup, EditorView } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { isDarkTheme } from '../scripts/utils'
import { StreamLanguage, syntaxHighlighting } from '@codemirror/language'
import {
	commentLines,
	linter,
	parser,
	style,
	style_light,
	theme,
	theme_light
} from '../scripts/editor'
import { keymap } from '@codemirror/view'

const Program: Component = () => {
	let loop: number
	let editor: EditorView

	const renderEditor = () => {
		try {
			editor.destroy()
		} catch { }

		editor = new EditorView({
			doc: code(),
			extensions: [
				basicSetup,
				EditorView.updateListener.of((v) => {
					if (v.docChanged) {
						setCode(v.state.doc.toJSON().join('\n'))
					}
				}),
				keymap.of([{ key: 'CTRL-/', run: commentLines }]),
				EditorState.readOnly.of(new URLSearchParams(window.location.search).has('disabled')),
				StreamLanguage.define(parser),
				linter,
				EditorView.theme({
					'&': { maxHeight: '500px' },
					'.cm-gutter,.cm-content': { minHeight: '500px' },
					'.cm-scroller': { overflow: 'auto' }
				}),
				isDarkTheme() ? theme : theme_light,
				EditorView.darkTheme.of(isDarkTheme()),
				syntaxHighlighting(isDarkTheme() ? style : style_light)
			],
			parent: document.getElementById('code')!
		})
	}

	createEffect(() => {
		const _ = code()

		if (!editor) return
		if (code() == editor.state.doc.toJSON().join('\n')) return
		editor.dispatch({
			changes: { from: 0, to: editor.state.doc.length, insert: code() }
		})
	})

	onMount(() => {
		let tCode: string, tS0: string, sSf: string

		loop = setInterval(() => {
			if (code() != tCode || s0() != tS0 || sf() != sSf) {
				console.log('updating...')
				tCode = code()
				tS0 = s0()
				sSf = sf()
				update()
			}
		}, 500)

		renderEditor()

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', renderEditor)
	})

	onCleanup(() => {
		editor.destroy()
		clearInterval(loop)
		window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', renderEditor)
	})

	return (
		<div class="form-control w-full flex-grow">
			<label class="label">
				<span class="label-text">Programma</span>
			</label>
			<div id="code" class="text-base" style={!isDarkTheme() ? 'border: 1px solid #eeeeee' : ''} />
			<div class="flex w-full gap-3">
				<div class="form-control w-full max-w-xs">
					<label class="label">
						<span class="label-text">Stato iniziale</span>
					</label>
					<input
						type="text"
						placeholder="S0"
						class="input-bordered input w-full max-w-xs"
						disabled={new URLSearchParams(window.location.search).has('disabled')}
						value={s0()}
						onInput={(e) => {
							setS0(e.currentTarget.value)
						}}
					/>
				</div>
				<div class="form-control w-full max-w-xs">
					<label class="label">
						<span class="label-text">Stato finale</span>
					</label>
					<input
						type="text"
						placeholder="Sf"
						class="input-bordered input w-full max-w-xs"
						disabled={new URLSearchParams(window.location.search).has('disabled')}
						value={sf()}
						onInput={(e) => {
							setSf(e.currentTarget.value)
						}}
					/>
				</div>
				<div class="mt-9 flex gap-2">
					<div class="my-auto">{errLines().length > 0 && <Fa icon={faCircleXmark} />}</div>
					<span class="my-auto">
						{errLines().length > 0
							? errLines().length == 1
								? 'Errore alla linea ' + errLines().join(', ')
								: 'Errori alle linee ' + errLines().join(', ')
							: ''}
					</span>
				</div>

				{!new URLSearchParams(window.location.search).has('disabled') && (
					<button
						class="btn-primary btn mt-9 ml-auto"
						onClick={() => {
							save(code(), s0(), sf())
						}}
					>
						Save
					</button>
				)}
			</div>
		</div>
	)
}

export default Program
