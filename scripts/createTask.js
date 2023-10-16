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
    titleInput.classList = 'input input-bordered w-full';
    titleInput.id = 'convtitle';
    form.appendChild(titleInput);

    // Input for task body
    const bodyInput = document.createElement('input');
    bodyInput.type = 'text';
    bodyInput.placeholder = 'Task body';
    bodyInput.classList = 'input input-bordered w-full mt-2';
    bodyInput.id = 'convbody';
    form.appendChild(bodyInput);

    const users = await fetchUsers();

    // Main container for the custom dropdown
    const dropdownDiv = document.createElement('div');
    dropdownDiv.classList.add('custom-dropdown', 'dropdown', 'w-full', 'mt-4', 'mb-4', 'cursons-pointer', 'border-2', 'rounded-xl', 'border-slate-700', 'p-2');
    
    // The element that you click to toggle the dropdown
    const dropdownToggle = document.createElement('div');
    dropdownToggle.innerText = 'Select Users';
    dropdownToggle.onclick = function() {
        userList.classList.toggle('hidden');  // Toggle visibility of the list
    };
    
    // List of users
    const userList = document.createElement('ul');
    userList.classList.add('hidden');  // Initially hidden
    
    users.forEach(user => {
        // Exclude the current user from the list
        if (user.id !== currentUser) {
            // Create the main div container for the user
            const userLi = document.createElement('div');
            userLi.classList = 'form-control';
    
            // Create the label for the user
            const userLabel = document.createElement('label');
            userLabel.htmlFor = `user_${user.id}`;
            userLabel.classList = 'label cursor-pointer';
    
            // Create the span that holds the username
            const userSpan = document.createElement('span');
            userSpan.classList = 'label-text';
            userSpan.innerText = user.username;
    
            // Create the checkbox for the user
            const userCheckbox = document.createElement('input');
            userCheckbox.type = 'checkbox';
            userCheckbox.value = user.id;
            userCheckbox.classList = 'checkbox';
            userCheckbox.id = `user_${user.id}`;
    
            // Append the elements in the correct order
            userLabel.appendChild(userSpan);
            userLabel.appendChild(userCheckbox);
            userLi.appendChild(userLabel);
            userList.appendChild(userLi);
        }
    });
    
    
    // Append the dropdown toggle and user list to the main container
    dropdownDiv.appendChild(dropdownToggle);
    dropdownDiv.appendChild(userList);
    
    // Append the main container to the form
    form.appendChild(dropdownDiv);


    // prio slider
    const prioSlider = document.createElement('input');
    prioSlider.type = 'range';
    prioSlider.min = '1';
    prioSlider.max = '5';
    prioSlider.value = '3';  // Default value
    prioSlider.classList = 'w-full flex justify-between text-xs px-2';
    prioSlider.id = 'prioSlider';
    form.appendChild(prioSlider);

    const prioLabel = document.createElement('div');
    prioLabel.innerText = `Priority: ${prioSlider.value}`;
    prioLabel.classList = 'block'
    prioSlider.oninput = () => { prioLabel.innerText = `Priority: ${prioSlider.value}`; }
    form.appendChild(prioLabel);



    // Create and append the input for date selection
    const dateInput = document.createElement("input");
    dateInput.classList.add("input", 'input-bordered', 'block', 'mt-4')
    dateInput.id = "dueDate";
    dateInput.type = "date";
    form.appendChild(dateInput);


    // Confirm button
    const confirmButton = document.createElement('div');
    confirmButton.innerText = 'Create';
    confirmButton.classList = 'btn mt-4 bg-blue-700 text-white'
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
