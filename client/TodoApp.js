function TodoApp() {
	this.baseUrl = 'https://my.todo.app';

	this.initialize = $.proxy(function ($todoList) {
		this.$todoList = $todoList;

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
					var $todo = createTodoItem(todo);

					// todos come sorted from the server, so simple append() is enough here
					this.$todoList.append($todo);
				}
			}, this)
		});

		$('.addTodo-form').on('submit', function (event) {
			event.preventDefault();

			var $input = $('.addTodo-form-input');
			var text = $input.val();
			addTodo(text, function () {
				$input.val('');
			});
		});
	}, this);


	function createTodoItem(todo) {
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
		$checkbox.on('click', function () {
			var id = $(this).parents('.todoList-todo').attr('data-id');
			changeTodoDone(id, this.checked);
		});

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
	}

	var insertTodoItem = $.proxy(function ($todo) {
		var checked = $todo.find('.todoList-todo-checkbox').attr('checked');
		var $children = checked
			? this.$todoList.children('.todoList-todo.todoList-todo--done')
			: this.$todoList.children('.todoList-todo:not(.todoList-todo--done)');

		if ($children.length === 0) {
			this.$todoList[checked ? 'append' : 'prepend']($todo);
			return;
		}

		if ($children.first().attr('data-created-at') < $todo.attr('data-created-at')) {
			$children.first().before($todo);
			return;
		}

		var inserted = false;
		$children.each(function () {
			if ( ! inserted && $(this).attr('data-created-at') < $todo.attr('data-created-at')) {
				$(this).before($todo);
				inserted = true;
			}
		});

		if ( ! inserted) {
			$children.last().after($todo);
		}
	}, this);


	var addTodo = $.proxy(function (text, callback) {
		$.ajax(this.baseUrl + '/todos', {
			method: 'POST',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify({text: text}),
			success: function (response) {
				if ( ! response.success) {
					alert('Při zpracování požadavku došlo k chybě.');
					return;
				}

				var $todo = createTodoItem(response.todo);
				$todo.css('display', 'none');
				insertTodoItem($todo);
				$todo.slideDown();
				callback();
			}
		})
	}, this);

	var changeTodoDone = $.proxy(function (id, done) {
		$.ajax(this.baseUrl + '/todos/' + id, {
			method: 'PATCH',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify({done: done}),
			success: function (response) {
				if ( ! response.success) {
					alert('Při zpracování požadavku došlo k chybě.');
					return;
				}

				var $todo = $('.todoList-todo[data-id=' + id + ']');
				$todo.find('.todoList-todo-checkbox').attr('checked', !!response.todo.done);
				$todo.slideUp(undefined, undefined, function () {
					$todo.detach();
					insertTodoItem($todo);

					if (response.todo.done) {
						$todo.addClass('todoList-todo--done');

					} else {
						$todo.removeClass('todoList-todo--done');
					}

					$todo.slideDown();
				});
			}
		})
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
