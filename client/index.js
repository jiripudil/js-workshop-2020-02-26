import {TodoApp} from './TodoApp.js';
import './style.css';

const onReady = () => {
	const todoApp = new TodoApp();
	todoApp.baseUrl = 'http://localhost:4000';
	todoApp.initialize(document.querySelector('.todoList'));
};

if (document.readyState !== 'complete') {
	document.addEventListener('DOMContentLoaded', onReady);
} else {
	onReady();
}
