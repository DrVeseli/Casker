import pb from "./pbInit.js";
import currentUser from "./auth.js";

document.getElementById('newTask').addEventListener('click', async () => {
    await renderCreateTaskForm();
    document.getElementById("mainContent").scrollIntoView({ behavior: 'smooth' });
});

async function renderCreateTaskForm() {
    const mainContent = document.getElementById("mainContent");
    mainContent.innerHTML = ''; // Clear the main content

    // Create the form
    const form = document.createElement('form');
    form.id = 'createTaskForm';

    // Input for task title
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Task title';
    titleInput.classList = 'mt-1 w-full border-2 h-10 rounded-xl text-black p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm';
    titleInput.id = 'convtitle';
    form.appendChild(titleInput);

    // Input for task body
    const bodyInput = document.createElement('input');
    bodyInput.type = 'text';
    bodyInput.placeholder = 'Task body';
    bodyInput.classList = 'mt-1 w-full border-2 h-10 rounded-xl text-black p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm';
    bodyInput.id = 'convbody';
    form.appendChild(bodyInput);

    // Dropdown for user selection
    const userDropdown = document.createElement('select');
    userDropdown.multiple = true;
    userDropdown.id = 'userSelect';
    userDropdown.classList = 'mt-1 w-full border-2 bg-slate-500 rounded-xl text-black p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm'
    const users = await fetchUsers();
    users.forEach(user => {
        // Exclude the current user from the dropdown list
        if (user.id !== currentUser) {
            const userLabel = document.createElement('label');
            const userCheckbox = document.createElement('input');
            userCheckbox.type = 'checkbox';
            userCheckbox.value = user.id;
            userCheckbox.id = `user_${user.id}`;
    
            userLabel.htmlFor = `user_${user.id}`;
            userLabel.innerText = user.username;
            userLabel.prepend(userCheckbox);
            
            form.appendChild(userLabel);
        }
    });
    
    form.appendChild(userDropdown);


    // prio slider
    const prioSlider = document.createElement('input');
    prioSlider.type = 'range';
    prioSlider.min = '1';
    prioSlider.max = '5';
    prioSlider.value = '3';  // Default value
    prioSlider.classList = 'mt-1 w-full h-10';
    prioSlider.id = 'prioSlider';
    form.appendChild(prioSlider);

    const prioLabel = document.createElement('label');
    prioLabel.innerText = `Priority: ${prioSlider.value}`;
    prioSlider.oninput = () => { prioLabel.innerText = `Priority: ${prioSlider.value}`; }
    form.appendChild(prioLabel);



    // Create and append the input for date selection
    const dateInput = document.createElement("input");
    dateInput.classList.add("bg-gray-500", "rounded-full", "my-2", "ml-2")
    dateInput.id = "dueDate";
    dateInput.type = "date";
    mainContent.appendChild(dateInput);

    // Confirm button
    const confirmButton = document.createElement('button');
    confirmButton.innerText = 'Create';
    confirmButton.classList = 'p-2 bg-blue-500 text-white rounded mt-2 w-1/6'
    confirmButton.type = 'button'; // Prevent form submission
    confirmButton.addEventListener('click', createConversation);
    form.appendChild(confirmButton);

    mainContent.appendChild(form);
}

async function fetchUsers() {
    console.log("fetching")

    return await pb.collection('users').getFullList({});
}

async function createConversation() {
    const title = document.getElementById('convtitle').value;
    const body = document.getElementById('convbody').value;
    const prio = document.getElementById('prioSlider').value;
    const dueDate = document.getElementById("dueDate").value;
    
    const selectedUsers = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    // Include current user in the conversation
    const data = {
        title: title,
        body: body,
        tasked: selectedUsers,
        tasker: currentUser,
        prio: prio,
        deadline: dueDate || "2020-09-22 12:00:00.000Z",
        status: "Active",
    };

    try {
        const record = await pb.collection('tasks').create(data);
        mainContent.innerHTML = ''; // Clear the main content

        console.log('New task created:', record);
    } catch (error) {
        console.error('Error creating task:', error);
    }
}
