import { faBackwardStep, faForwardStep, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import Fa from 'solid-fa';
import { Component } from 'solid-js';

const Controls: Component<{ play?: boolean }> = (props) => {
	return (
		<div class="btn-group ml-auto">
			<button class="btn">
				<Fa icon={faBackwardStep} />
			</button>
			<button class="btn" classList={{ 'btn-active': props.play }}>
				<Fa icon={props.play ? faPause : faPlay} />
			</button>
			<button class="btn">
				<Fa icon={faForwardStep} />
			</button>
		</div>
	);
};

export default Controls;
