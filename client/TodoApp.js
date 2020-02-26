function TodoApp() {
	this.baseUrl = 'https://my.todo.app';

	this.initialize = function (todoList) {
		this.todoList = todoList;

		// load todos
		$.ajax(this.baseUrl + '/todos', {
			success: function (response) {
				if ( ! response.success) {
					window.alert('Došlo k chybě při načítání dat.');
					return;
				}

				// remove loading sign
				document.querySelector('.loading').remove();

				// insert todos one by one
				for (var i = 0; i < response.todos.length; i++) {
					var todo = response.todos[i];
					var todoItem = createTodoItem(todo);

					// todos come sorted from the server, so simple append() is enough here
					this.todoList.append(todoItem);
				}
			}.bind(this)
		});

		document.querySelector('.addTodo-form').addEventListener('submit', (event) => {
			event.preventDefault();

			var inputElement = event.target.querySelector('.addTodo-form-input');
			var text = inputElement.value;
			addTodo(text, () => {
				inputElement.value = '';
			});
		});
	}.bind(this);


	function createTodoItem(todo) {
		var todoElement = document.createElement('li');
		todoElement.classList.add('todoList-todo');
		todoElement.dataset.id = todo.id;
		todoElement.dataset.createdAt = todo.created_at;

		if (todo.done) {
			todoElement.classList.add('todoList-todo--done');
		}

		var checkboxElement = document.createElement('input');
		checkboxElement.classList.add('todoList-todo-checkbox');
		checkboxElement.type = 'checkbox';
		checkboxElement.checked = !!todo.done;
		checkboxElement.addEventListener('click', (event) => {
			var id = event.target.closest('.todoList-todo').dataset.id;
			changeTodoDone(id, event.target.checked);
		});

		var textElement = document.createElement('span');
		textElement.classList.add('todoList-todo-text');
		textElement.innerText = todo.text;

		var removeButtonElement = document.createElement('button');
		removeButtonElement.classList.add('todoList-todo-remove');
		removeButtonElement.innerHTML = '&times;';
		removeButtonElement.addEventListener('click', (event) => {
			var id = event.target.closest('.todoList-todo').dataset.id;
			removeTodo(id);
		});

		var labelElement = document.createElement('label');
		labelElement.classList.add('todoList-todo-wrapper');
		labelElement.append(checkboxElement);
		labelElement.append(textElement);
		labelElement.append(removeButtonElement);

		todoElement.append(labelElement);
		return todoElement;
	}

	var insertTodoItem = function (todoElement) {
		var checked = todoElement.querySelector('.todoList-todo-checkbox').checked;
		var childrenElements = checked
			? this.todoList.querySelectorAll('.todoList-todo.todoList-todo--done')
			: this.todoList.querySelectorAll('.todoList-todo:not(.todoList-todo--done)');

		if (childrenElements.length === 0) {
			this.todoList[checked ? 'append' : 'prepend'](todoElement);
			return;
		}

		if (childrenElements.item(0).dataset.createdAt < todoElement.dataset.createdAt) {
			this.todoList.insertBefore(todoElement, childrenElements.item(0));
			return;
		}

		var inserted = false;
		childrenElements.forEach((element) => {
			if ( ! inserted && element.dataset.createdAt < todoElement.dataset.createdAt) {
				this.todoList.insertBefore(todoElement, element);
				inserted = true;
			}
		});

		if ( ! inserted) {
			this.todoList.insertAfter(todoElement, childrenElements.item(childrenElements.length - 1));
		}
	}.bind(this);


	var addTodo = function (text, callback) {
		$.ajax(this.baseUrl + '/todos', {
			method: 'POST',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify({text: text}),
			success: (response) => {
				if ( ! response.success) {
					alert('Při zpracování požadavku došlo k chybě.');
					return;
				}

				var todoElement = createTodoItem(response.todo);
				todoElement.style.display = 'none';
				insertTodoItem(todoElement);
				//todoElement.slideDown();
				callback();
			}
		})
	}.bind(this);

	var changeTodoDone = function (id, done) {
		$.ajax(this.baseUrl + '/todos/' + id, {
			method: 'PATCH',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify({done: done}),
			success: (response) => {
				if ( ! response.success) {
					alert('Při zpracování požadavku došlo k chybě.');
					return;
				}

				var todoElement = document.querySelector(`.todoList-todo[data-id="${id}"]`);
				todoElement.querySelector('.todoList-todo-checkbox').checked = !!response.todo.done;

				// todoElement.remove();
				this.todoList.removeChild(todoElement);
				todoElement.classList.toggle('todoList-todo--done');
				insertTodoItem(todoElement);
			}
		})
	}.bind(this);

	var removeTodo = function (id) {
		// send request to delete the item
		$.ajax(this.baseUrl + '/todos/' + id, {
			method: 'DELETE',
			success: (response) => {
				if ( ! response.success) {
					alert('Při zpracování požadavku došlo k chybě.');
					return;
				}

				// if successful, animate away and then remove the item
				var todoElement = document.querySelector(`.todoList-todo[data-id="${id}"]`);
				todoElement.remove();
			}
		});
	}.bind(this);

	return this;
}
