const {getTodos, addTodo, updateTodo, removeTodo} = require('./database');


module.exports = (router) => {
	router.get('/todos', async (request, response) => {
		const todos = await getTodos();
		response
			.status(200)
			.json({
				success: true,
				todos,
			});
	});

	router.post('/todos', async (request, response) => {
		const todo = await addTodo(request.body);
		response
			.status(201)
			.json({
				success: true,
				todo,
			});
	});

	router.patch('/todos/:todoId', async (request, response) => {
		const todoId = request.params.todoId;
		const todo = await updateTodo(todoId, request.body.done);
		response
			.status(200)
			.json({
				success: true,
				todo,
			})
	});

	router.delete('/todos/:todoId', async (request, response) => {
		const todoId = request.params.todoId;
		await removeTodo(todoId);
		response
			.status(200)
			.json({
				success: true,
			});
	});
};
