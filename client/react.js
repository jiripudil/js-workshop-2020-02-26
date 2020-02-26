import React, {useState} from 'react';
import {render} from 'react-dom';

const Application = () => {
	const [whom, setWhom] = useState('');
	const [age, setAge] = useState('');

	return (
		<>
			<div>
				<input
					type="text"
					value={whom}
					onChange={(event) => {
						setWhom(event.target.value);
					}}
				/>

				<input
					type="text"
					value={age}
					onChange={(event) => {
						setAge(event.target.value);
					}}
				/>
			</div>

			<h1>Hello {whom} ({age})</h1>
		</>
	);
};

document.addEventListener('DOMContentLoaded', () => {
	const mountElement = document.getElementById('reactApp');
	render(
		<Application />,
		mountElement,
	);
});
