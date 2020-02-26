document.addEventListener('DOMContentLoaded', () => {
	const todoApp = new TodoApp();
	todoApp.baseUrl = 'http://localhost:4000';
	todoApp.initialize(document.querySelector('.todoList'));
});
