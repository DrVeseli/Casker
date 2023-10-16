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
    nameInput.classList = 'input input-bordered w-full';
    nameInput.id = 'convName';
    form.appendChild(nameInput);
 
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
    

    // Confirm button
    const confirmButton = document.createElement('button');
    confirmButton.innerText = 'Create';
    confirmButton.classList = 'btn bg-blue-700 text-white'
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
