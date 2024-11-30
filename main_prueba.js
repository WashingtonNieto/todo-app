const tasksList = document.querySelector('#tasks-list');
const newTaskInput = document.querySelector('#new-task-input');
const addTaskButton = document.querySelector('#add-task-button');

const tasks = [];

const app = {
    tasks,
    tasksList,
    newTaskInput,
};


window.onload = function(){
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    app.tasks = savedTasks.map((task) => {
        return createTask(task.title, task.isCompleted);
    }); 
    app.tasks.forEach((task) => {
        return addTaskToList(task,app.tasksList);
    });
}

function saveTasksToLocalStorage(tasks){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}


//crea el objeto de la tarea
function createTask(title, isCompleted = false){
    return{
        id: Date.now(),
        title,
        isCompleted,
    };
}

//añadir el elemento html que representa la tarea a la lista
function addTaskToList(task, taskList){
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
}


//crea la tarea, agregarlo a la estructura de datos y llama la funcion
//que lo inserta en el html
function addTask(app){
    const newTaskTitle = app.newTaskInput.value;
    const newTask = createTask(newTaskTitle);
    app.tasks.push(newTask);

    addTaskToList(newTask, app.tasksList);
    saveTasksToLocalStorage(app.tasks);
    //para que borre el text y lo deje libre para la proxima tarea
    app.newTaskInput.value = '';
}

function createTaskElement(task){
    const taskElement = document.createElement('li');

    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.checked = task.isCompleted;
    taskCheckbox.addEventListener('change', () =>{
        task.isCompleted = taskCheckbox.checked;
        taskText.classList.toggle("completed",task.isCompleted)
        saveTasksToLocalStorage(app.tasks);
    });

    const taskText = document.createElement('span');
    taskText.textContent = task.title;
    taskText.classList.toggle("completed",task.isCompleted);

    const taskDeleteButton = document.createElement('button');
    taskDeleteButton.textContent = 'Eliminar';
    taskDeleteButton.className = 'delete-button';
    taskDeleteButton.addEventListener('click', () => {
        //eliminar la tarea de la vista
        taskElement.remove();

        const taskIndex = app.tasks.indexOf(task);
        if(taskIndex > -1){
            app.tasks.splice(taskIndex, 1);
        }
        saveTasksToLocalStorage(app.tasks);
    });

    taskElement.appendChild(taskCheckbox);
    taskElement.appendChild(taskText);
    taskElement.appendChild(taskDeleteButton);

    return taskElement;
}

addTaskButton.addEventListener('click', () => {
    addTask(app);
});

newTaskInput.addEventListener('keydown',(event) => {
    if(event.key === "Enter"){
        addTask(app);
    }
});