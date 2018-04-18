$(function () {
	var todoApp = new TodoApp();
	todoApp.baseUrl = 'http://localhost:4000';
	todoApp.initialize($('.todoList'));
});
