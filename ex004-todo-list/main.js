// selectors
const todoInput = document.querySelector('.todo-input');
const todoBtn = document.querySelector('.todo-btn');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

// methods
function getTodos() {
    document.getElementById('filter-todo').options[0].selected = true;    

    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    } 
    console.log(todos);
    
    todoList.innerHTML = ``;
    todos.forEach(function(todoItem) {
        todoList.innerHTML += `<div class="todo-item` + (todoItem.state==="completed" ? " completed-item" : "") + `">
            <li class="todo-item-name">${todoItem.name}</li>
            <button class="complete-btn"><i class="fas fa-check"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>`;
    });
}

function saveLocalTodos(todo) {
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    // check whether it's to modify or add
    let todoExist = false;
    let myBreakException = {};
    try {
        todos.forEach(todoItem => {
            if (todoItem.name == todo.name) {
                todoExist = true;
                // modify
                todoItem.name = todo.name;
                todoItem.state = todo.state;
                // quite the foreach loop
                throw myBreakException;
            }
        })
    } catch (e) {
        if (e !== myBreakException) throw e;
    }

    // add
    if (!todoExist) {
        todos.push(todo);
    }
    
    localStorage.setItem('todos', JSON.stringify(todos));
}

function removeLocalTodo(todo) {
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    // locate the item and remove
    todos.splice(todos.indexOf(todo), 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo(event) {
    event.preventDefault(); // prevent form submitting, browser won't refresh
    

    if (todoInput.value == "") {
        todoInput.classList.add('input-error');
        return;
    } else {
        if (todoInput.classList.contains('input-error')) {
            todoInput.classList.remove('input-error');
        }
    }
    
    /*
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-item');
    const todoLi = document.createElement('li');
    todoLi.innerText = 'hey';
    todoLi.classList.add('todo-item-name');
    todoDiv.appendChild(todoLi);
    const completeBtn = document.createElement('button');
    completeBtn.innerHTML = '<i class="fas fa-check"></i>';
    completeBtn.classList.add('complete-btn');
    todoDiv.appendChild(completeBtn);
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.classList.add('delete-btn');
    todoDiv.appendChild(deleteBtn);
    todoList.appendChild(todoDiv);
    */
    // re-implement above codes
    todoList.innerHTML += `<div class="todo-item">
            <li class="todo-item-name">${todoInput.value}</li>
            <button class="complete-btn"><i class="fas fa-check"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>`;

    // save to local storage
    let todoItem = new Object();
    todoItem["name"] = todoInput.value;
    todoItem["state"] = "uncompleted";
    saveLocalTodos(todoItem);

    todoInput.value = "";
}

function deleteCheck(e) {
    // e.target can be li.todo-item-name, i.fa-check, or i.fa-trash
    const item = e.target;
    if(item.classList[0] === 'delete-btn') {
        // item.parentNode.remove(); div.todo-item
        item.parentElement.classList.add('fall-effect');
        // removeLocalTodo(item.parentElement.children[0].textContent); // .innerText also works
        let todoItem = new Object();
        todoItem["name"] = item.parentElement.querySelector('.todo-item-name').textContent;
        todoItem["state"] = item.parentElement.classList.contains('completed-item') ? "completed" : "uncompleted";
        removeLocalTodo(todoItem);
        // item.parentElement.remove();
        item.parentElement.addEventListener('transitionend', function() {
            item.parentElement.remove();
        });
    }
    if(item.classList[0] === 'complete-btn') {
        // click it will add or remove the class
        item.parentElement.classList.toggle('completed-item');
        // modify local storage
        let todoItem = new Object();
        todoItem["name"] = item.parentElement.querySelector('.todo-item-name').textContent;
        todoItem["state"] = item.parentElement.classList.contains('completed-item') ? "completed" : "uncompleted";
        saveLocalTodos(todoItem); 
    }
}

function filterTodo(e) {
    const todoItems = todoList.childNodes;
    todoItems.forEach(function(todoItem) {
        switch(e.target.value) {
            case "all":
                todoItem.style.display = "flex";
                break;
            case "completed":
                if(todoItem.classList.contains('completed-item')) {
                    todoItem.style.display = "flex";
                } else {
                    todoItem.style.display = "none";
                }
                break;
            case "uncompleted":
                if(!todoItem.classList.contains('completed-item')) {
                    todoItem.style.display = "flex";
                } else {
                    todoItem.style.display = "none";
                }
                break;
        }
    });
}

// event listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);