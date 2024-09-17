(function () {
	function createAppTitle(title) {
		 let appTitle = document.createElement('h2');
		 appTitle.innerHTML = title;
		 return appTitle;
	}

	function createToDoItemForm() {
		 let form = document.createElement('form');
		 let input = document.createElement('input');
		 let buttonWrapper = document.createElement('div');
		 let button = document.createElement('button');

		 form.classList.add('input-group', 'mb-3');
		 input.classList.add('form-control');
		 input.placeholder = 'Введите название нового дела';
		 buttonWrapper.classList.add('input-group-append');
		 button.classList.add('btn', 'btn-primary');
		 button.textContent = 'Добавить дело';
		 button.setAttribute('disabled', 'true');

		 buttonWrapper.append(button);
		 form.append(input);
		 form.append(buttonWrapper);

		 return {
			  form,
			  input,
			  button,
		 };
	}

	function createToDoList() {
		 let list = document.createElement('ul');
		 list.classList.add('list-group');
		 return list;
	}

	function createToDoItem(todo) {
		 let item = document.createElement('li');

		 let buttonGroup = document.createElement('div');
		 let doneButton = document.createElement('button');
		 let deleteButton = document.createElement('button');

		 item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
		 item.textContent = todo.name;
		 if (todo.done) {
			  item.classList.add('list-group-item-success');
		 }

		 buttonGroup.classList.add('btn-group', 'btn-group-sm');
		 doneButton.classList.add('btn', 'btn-success');
		 doneButton.textContent = 'Готово';
		 deleteButton.classList.add('btn', 'btn-danger');
		 deleteButton.textContent = 'Удалить';

		 buttonGroup.append(doneButton);
		 buttonGroup.append(deleteButton);
		 item.append(buttonGroup);

		 return {
			  item,
			  doneButton,
			  deleteButton,
		 };
	}

	function loadTodos(key) {
		 let todos = localStorage.getItem(key);
		 try {
			  return todos ? JSON.parse(todos) : [];
		 } catch (e) {
			  console.error('Error parsing JSON from localStorage', e);
			  return [];
		 }
	}

	function saveTodos(key, todos) {
		 localStorage.setItem(key, JSON.stringify(todos));
	}

	function createTodoApp(container, title = 'Список дел', storageKey = '') {
		 let todos = loadTodos(storageKey);

		 let todoAppTitle = createAppTitle(title);
		 let todoItemForm = createToDoItemForm();
		 let todoList = createToDoList();

		 container.append(todoAppTitle);
		 container.append(todoItemForm.form);
		 container.append(todoList);

		 todoItemForm.input.addEventListener('input', function () {
			  todoItemForm.button.disabled = !todoItemForm.input.value;
		 });

		 todoItemForm.form.addEventListener('submit', function (e) {
			  e.preventDefault();

			  if (!todoItemForm.input.value) {
					return;
			  }

			  

			  let todo = {
					name: todoItemForm.input.value,
					done: false
			  };

			  todos.push(todo);
			  saveTodos(storageKey, todos);

			  let todoItem = createToDoItem(todo);
			  addTodoItem(todoList, todoItem, todos, storageKey);

			  todoItemForm.input.value = '';
			  todoItemForm.button.setAttribute('disabled', 'true');
		 });

		 todos.forEach(todo => {
			  let todoItem = createToDoItem(todo);
			  addTodoItem(todoList, todoItem, todos, storageKey);
		 });
	}

	function addTodoItem(todoList, todoItem, todos, storageKey) {
		 todoItem.doneButton.addEventListener('click', function () {
			  todoItem.item.classList.toggle('list-group-item-success');
			  let todo = todos.find(t => t.name === todoItem.item.firstChild.textContent);
			  if (todo) {
					todo.done = !todo.done;
					saveTodos(storageKey, todos);
			  }
		 });

		 todoItem.deleteButton.addEventListener('click', function () {
			  if (confirm('Вы уверены?')) {
					todoItem.item.remove();
					let index = todos.findIndex(t => t.name === todoItem.item.firstChild.textContent);
					if (index !== -1) {
						 todos.splice(index, 1);
						 saveTodos(storageKey, todos);
					}
			  }
		 });

		 todoList.append(todoItem.item);
	}

	window.createTodoApp = createTodoApp;
})();
