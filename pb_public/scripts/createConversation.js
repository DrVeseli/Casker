import pb from "./pbInit.js";
import currentUser from "./auth.js";

document.getElementById('newConv').addEventListener('click', async () => {
    await renderCreateConversationForm();
    document.getElementById("mainContent").scrollIntoView({ behavior: 'smooth' });
});

async function renderCreateConversationForm() {
    const mainContent = document.getElementById("mainContent");
    mainContent.innerHTML = ''; // Clear the main content

    // Create the form
    const form = document.createElement('form');
    form.id = 'createConvForm';

    // Input for conversation name
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Conversation Name';
    nameInput.classList = 'mt-1 w-full border-2 h-10 rounded-xl text-black p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm';
    nameInput.id = 'convName';
    form.appendChild(nameInput);
 
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
    const name = document.getElementById('convName').value;
    const selectedUsers = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    // Include current user in the conversation
    selectedUsers.push(currentUser);
    const data = {
        name,
        users: selectedUsers
    };

    try {
        const record = await pb.collection('conversations').create(data);
        console.log('New conversation created:', record);
    } catch (error) {
        console.error('Error creating conversation:', error);
    }
}
