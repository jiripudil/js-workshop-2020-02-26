function TodoApp() {
	this.baseUrl = 'https://my.todo.app';

	var $todoList = $('.todoList');
	this.initialize = $.proxy(function () {
		// load todos
		$.ajax(this.baseUrl + '/todos', {
			success: $.proxy(function (response) {
				if ( ! response.success) {
					window.alert('Došlo k chybě při načítání dat.');
					return;
				}

				// remove loading sign
				$('.loading').remove();

				// insert todos one by one
				for (var i = 0; i < response.todos.length; i++) {
					var todo = response.todos[i];
					var $todo = createTodo(todo);

					// todos come sorted from the server, so simple append() is enough here
					$todoList.append($todo);
				}
			}, this)
		});
	}, this);

	var createTodo = $.proxy(function (todo) {
		var $todo = $('<li />');
		$todo.addClass('todoList-todo');
		$todo.data('id', todo.id);
		$todo.data('createdAt', todo.createdAt);

		if (todo.done) {
			$todo.addClass('todoList-todo--done');
		}

		var $checkbox = $('<input />');
		$checkbox.addClass('todoList-todo-checkbox');
		$checkbox.attr('type', 'checkbox');
		$checkbox.attr('checked', !!todo.done);

		var $label = $('<label />');
		$label.addClass('todoList-todo-text');
		$label.append($checkbox);
		$label.append(todo.text);

		$todo.append($label);
		return $todo;
	}, this);

	return this;
}
