export class TodoApp {
	constructor() {
		this.baseUrl = 'https://my.todo.app';
	}

	async initialize(todoList) {
		this.todoList = todoList;

		// load todos
		const response = await fetch(this.baseUrl + '/todos');
		if ( ! response.ok) {
			window.alert('Došlo k chybě při načítání dat.');
			return;
		}

		const {todos} = await response.json();

		// remove loading sign
		document.querySelector('.loading').remove();

		// insert todos one by one
		for (const todo of todos) {
			const todoItem = this.createTodoItem(todo);

			// todos come sorted from the server, so simple append() is enough here
			this.todoList.append(todoItem);
		}

		document.querySelector('.addTodo-form').addEventListener('submit', async (event) => {
			event.preventDefault();

			const inputElement = event.target.querySelector('.addTodo-form-input');
			const text = inputElement.value;
			await this.addTodo(text);
			inputElement.value = '';
		});
	}

	createTodoItem(todo) {
		const todoElement = document.createElement('li');
		todoElement.classList.add('todoList-todo');
		todoElement.dataset.id = todo.id;
		todoElement.dataset.createdAt = todo.created_at;

		if (todo.done) {
			todoElement.classList.add('todoList-todo--done');
		}

		const checkboxElement = document.createElement('input');
		checkboxElement.classList.add('todoList-todo-checkbox');
		checkboxElement.type = 'checkbox';
		checkboxElement.checked = !!todo.done;
		checkboxElement.addEventListener('click', (event) => {
			const id = event.target.closest('.todoList-todo').dataset.id;
			this.changeTodoDone(id, event.target.checked);
		});

		const textElement = document.createElement('span');
		textElement.classList.add('todoList-todo-text');
		textElement.innerText = todo.text;

		const removeButtonElement = document.createElement('button');
		removeButtonElement.classList.add('todoList-todo-remove');
		removeButtonElement.innerHTML = '&times;';
		removeButtonElement.addEventListener('click', (event) => {
			const id = event.target.closest('.todoList-todo').dataset.id;
			this.removeTodo(id);
		});

		const labelElement = document.createElement('label');
		labelElement.classList.add('todoList-todo-wrapper');
		labelElement.append(checkboxElement);
		labelElement.append(textElement);
		labelElement.append(removeButtonElement);

		todoElement.append(labelElement);
		return todoElement;
	}

	insertTodoItem(todoElement) {
		const checked = todoElement.querySelector('.todoList-todo-checkbox').checked;
		const childrenElements = checked
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

		let inserted = false;
		childrenElements.forEach((element) => {
			if ( ! inserted && element.dataset.createdAt < todoElement.dataset.createdAt) {
				this.todoList.insertBefore(todoElement, element);
				inserted = true;
			}
		});

		if ( ! inserted) {
			childrenElements.item(childrenElements.length - 1)
				.insertAdjacentElement('afterend', todoElement);
		}
	}


	async addTodo(text) {
		const response = await fetch(`${this.baseUrl}/todos`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({text}),
		});

		if (!response.ok) {
			alert('Při zpracování požadavku došlo k chybě.');
			return;
		}

		const {todo} = await response.json();

		const todoElement = this.createTodoItem(todo);
		this.insertTodoItem(todoElement);
		//todoElement.slideDown();
	}

	async changeTodoDone(id, done) {
		const response = await fetch(`${this.baseUrl}/todos/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
			body: JSON.stringify({done}),
		});

		if ( ! response.ok) {
			alert('Při zpracování požadavku došlo k chybě.');
			return;
		}

		const {todo} = await response.json();

		const todoElement = document.querySelector(`.todoList-todo[data-id="${id}"]`);
		todoElement.querySelector('.todoList-todo-checkbox').checked = !!todo.done;

		// todoElement.remove();
		this.todoList.removeChild(todoElement);
		todoElement.classList.toggle('todoList-todo--done');
		this.insertTodoItem(todoElement);
	};

	async removeTodo(id) {
		// send request to delete the item
		const response = await fetch(`${this.baseUrl}/todos/${id}`, {
			method: 'DELETE',
		});

		if ( ! response.ok) {
			alert('Při zpracování požadavku došlo k chybě.');
			return;
		}

		// if successful, animate away and then remove the item
		const todoElement = document.querySelector(`.todoList-todo[data-id="${id}"]`);
		todoElement.remove();
	}
}
