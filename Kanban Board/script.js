 const form = document.querySelector('form');
const dropZone = document.querySelectorAll('.drop-zone');
const inputElement = document.querySelector('#task-name')

let tasks = JSON.parse(localStorage.getItem('tasksData')) || [];

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = inputElement.value.trim()
    if(taskText !== '') {
        const newTask = {
            id: Date.now(),
            title: taskText,
            status: 'todo'
        }
    tasks.push(newTask);
    localStorage.setItem('tasksData', JSON.stringify(tasks))
    form.reset();
    renderTasks(tasks)

    }
   
})

function renderTasks (tasksArray) {
    dropZone.forEach(zone => {
        zone.innerHTML = ''
    })
    tasksArray.forEach(task => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('task-card');
        newDiv.innerHTML = `<p>${task.title}</p>
        <button class="delete-btn">X</button>
       `;
       const deletebtn = newDiv.querySelector('.delete-btn')
       deletebtn.addEventListener('click', (e) => {
        e.stopPropagation()
        removeTask(task.id)
       })
        newDiv.setAttribute('draggable', 'true')

        newDiv.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id)
        })
        

     const targetSelector = '#' + task.status + ' .drop-zone';
    const targetDropZone = document.querySelector(targetSelector)
    
    if (targetDropZone) {
      targetDropZone.appendChild(newDiv);
    }}

)}
renderTasks(tasks); 


document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
    })
    zone.addEventListener('drop', (e) => {
        e.preventDefault();

        const draggedTaskId = Number(e.dataTransfer.getData('text/plain'));
        
        const newStatus = zone.parentElement.id;
        tasks = tasks.map(task => {
            if(task.id === draggedTaskId) {
                return {...task, status: newStatus}
                
            }
            return task;
        })
        localStorage.setItem('tasksData', JSON.stringify(tasks))
        renderTasks(tasks);

        })

})
function removeTask (targetId) {
    tasks = tasks.filter(task => task.id !== targetId)
    localStorage.setItem('tasksData', JSON.stringify(tasks))
    renderTasks(tasks);
}
