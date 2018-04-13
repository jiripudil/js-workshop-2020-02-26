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
		$todo.attr('data-id', todo.id);
		$todo.attr('data-created-at', todo.created_at);

		if (todo.done) {
			$todo.addClass('todoList-todo--done');
		}

		var $checkbox = $('<input />');
		$checkbox.addClass('todoList-todo-checkbox');
		$checkbox.attr('type', 'checkbox');
		$checkbox.attr('checked', !!todo.done);

		var $text = $('<span />');
		$text.addClass('todoList-todo-text');
		$text.text(todo.text);

		var $removeButton = $('<button />');
		$removeButton.addClass('todoList-todo-remove');
		$removeButton.html('&times;');
		$removeButton.on('click', function () {
			var id = $(this).parents('.todoList-todo').attr('data-id');
			removeTodo(id);
		});

		var $label = $('<label />');
		$label.addClass('todoList-todo-wrapper');
		$label.append($checkbox);
		$label.append($text);
		$label.append($removeButton);

		$todo.append($label);
		return $todo;
	}, this);

	var removeTodo = $.proxy(function (id) {
		// send request to delete the item
		$.ajax(this.baseUrl + '/todos/' + id, {
			method: 'DELETE',
			success: function (response) {
				if ( ! response.success) {
					alert('Při zpracování požadavku došlo k chybě.');
					return;
				}

				// if successful, animate away and then remove the item
				var $todo = $('.todoList-todo[data-id=' + id + ']');
				$todo.slideUp(undefined, undefined, function () {
					$todo.remove();
				});
			}
		});
	}, this);

	return this;
}
