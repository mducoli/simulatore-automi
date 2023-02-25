import Fa from 'solid-fa'
import { Component, onCleanup, onMount } from 'solid-js'
import { code, errLines, s0, setCode, setS0, setSf, sf, update } from '../scripts/program'
import { save } from '../scripts/saving'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

const Program: Component = () => {
	let loop: number

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
	})

	onCleanup(() => {
		clearInterval(loop)
	})

	return (
		<div class="form-control flex-grow">
			<label class="label">
				<span class="label-text">Programma</span>
			</label>
			<textarea
				class="textarea-bordered textarea h-96 w-full"
				placeholder="S0 1 -> S1 F"
				disabled={new URLSearchParams(window.location.search).has('disabled')}
				value={code()}
				onInput={(e) => {
					setCode(e.currentTarget.value)
				}}
			></textarea>
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
				<div class='mt-9 flex gap-2'>
					<div class='my-auto'>{errLines().length > 0 && <Fa icon={faCircleXmark} />}</div>
					<span class='my-auto'>{errLines().length > 0 ? "Error parsing line(s): " + errLines().join(' ') : ""}</span>
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
