const taskInput = document.getElementById('taskInput');
const taskDescriptionInput = document.getElementById('taskDescriptionInput');
const dueDateInput = document.getElementById('dueDateInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const searchInput = document.getElementById('searchInput');
const taskList = document.getElementById('taskList');

let tasks = [];

// Load tasks from local storage when the page loads
loadTasks();

// Add Task
addTaskBtn.addEventListener('click', () => {
    const title = taskInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const dueDate = dueDateInput.value;

    if (title) {
        tasks.push({ title, description, dueDate, completed: false });
        saveTasks();
        displayTasks();
        clearInputs();
    }
});

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = storedTasks;
    displayTasks();
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = ''; // Clear previous tasks
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
    );

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task');
        taskItem.classList.toggle('completed', task.completed); // Add completed class if task is complete
        taskItem.innerHTML = `
            <span>${task.title} - ${task.description} (Due: ${task.dueDate || 'No due date'})</span>
            <button class="editBtn" data-index="${index}">Edit</button>
            <button class="completeBtn" data-index="${index}">${task.completed ? 'Undo' : 'Complete'}</button>
            <button class="deleteBtn" data-index="${index}">Delete</button>
        `;
        taskList.appendChild(taskItem);
    });
}

// Clear input fields
function clearInputs() {
    taskInput.value = '';
    taskDescriptionInput.value = '';
    dueDateInput.value = '';
}

// Task actions
taskList.addEventListener('click', (event) => {
    const index = event.target.dataset.index;
    
    if (event.target.classList.contains('editBtn')) {
        taskInput.value = tasks[index].title;
        taskDescriptionInput.value = tasks[index].description;
        dueDateInput.value = tasks[index].dueDate; // Populate the due date input
        tasks.splice(index, 1); // Temporarily remove the task to allow updating
        saveTasks();
        displayTasks();
    }
    
    if (event.target.classList.contains('completeBtn')) {
        tasks[index].completed = !tasks[index].completed; // Toggle completed status
        saveTasks();
        displayTasks();
    }
    
    if (event.target.classList.contains('deleteBtn')) {
        tasks.splice(index, 1); // Remove the task from the list
        saveTasks();
        displayTasks();
    }
});

// Search feature
searchInput.addEventListener('input', displayTasks);