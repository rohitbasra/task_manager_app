window.addEventListener('load', () => {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const nameInput = document.querySelector('#name');
    const newTaskForm = document.querySelector('#new-task-form');

    const username = localStorage.getItem('username') || '';

    nameInput.value = username;

    nameInput.addEventListener('change', (e) => {
        localStorage.setItem('username', e.target.value);
    })

    newTaskForm.addEventListener('submit', e => {
        e.preventDefault();

        const task = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().toLocaleString()
        }
        const
            options = {
                method
                    :
                    'POST'
                ,
                headers
                    : {
                    'Content-Type'
                        :
                        'application/json'
                    // Specify the content type as JSON
                },
                body
                    :
                    JSON
                        .
                        stringify
                        (task)
                // Convert data to JSON string
            };

        tasks.push(task);

        localStorage.setItem('tasks', JSON.stringify(tasks));


        e.target.reset();

        fetch("http://localhost:8000/api/task/create", options).then(response => {
            if (!response.ok) {
                throw new Error("Netweorerr");

            }
            return response.json();
        })
            .then(data => {
                console.log("success");

            });
        // This is used to reset the checkbox and task input field after adding an task

        DisplayTasks()
    })

    DisplayTasks()
})

function DisplayTasks() {
    const taskList = document.querySelector('#task-list');

    taskList.innerHTML = "";    // It is used to reset the list after adding an task

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const actions = document.createElement('div');
        const edit = document.createElement('button');
        const deleteButton = document.createElement('button');

        input.type = 'checkbox';
        input.checked = task.done; // It checks whether a task is done or not
        span.classList.add('bubble');

        if (task.category == 'personal') {
            span.classList.add('personal');
        } else {
            span.classList.add('business');
        }

        content.classList.add('task-content');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        content.innerHTML = `<input type = "text" value = "${task.content}" readonly >`;

        edit.innerHTML = 'Edit';
        deleteButton.innerHTML = 'Delete';

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);

        taskItem.appendChild(label);
        taskItem.appendChild(content);
        taskItem.appendChild(actions);

        taskList.appendChild(taskItem);

        if (task.done) {
            taskItem.classList.add('done');
        }

        input.addEventListener('change', (e) => {
            task.done = e.target.checked;
            localStorage.setItem('tasks', JSON.stringify(tasks));

            if (task.done) {
                taskItem.classList.add('done');
            } else {
                taskItem.classList.remove('done');
            }
            DisplayTasks()
        })

        edit.addEventListener('click', (e) => {
            const input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();
            input.addEventListener('blur', (e) => {
                input.setAttribute('readonly', true);
                task.content = e.target.value;
                localStorage.setItem('tasks', JSON.stringify(tasks));

                DisplayTasks()
            })
        })

        

        deleteButton.addEventListener('click', (e) => {
            tasks = tasks.filter(t => t != task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            DisplayTasks()
        })

    })
}