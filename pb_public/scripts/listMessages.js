import pb from "./pbInit.js";
import currentUser from "./auth.js";
import { getCurrentConversationId } from "./currentConversation.js";
import { sendMessage } from "./sendMessage.js";


export async function fetchAndRenderMessages() {
    const conversationId = getCurrentConversationId();
    mainContent.innerHTML = ''; // Clear previous messages

    if (!conversationId) {
        console.error("No conversation selected");
        return;
    }

    const messages = await pb.collection('messages').getList(1, 40, {
        filter: `conversation="${conversationId}"`,
        sort: "-created",
        expand: 'sender'
    });

    renderMessages(messages.items);
    renderChatbox();
}
let previousSenderId = null;

export async function renderMessages(messages) {
    const mainContent = document.getElementById("mainContent");


    messages.reverse().forEach(message => {
        const isCurrentUser = message.expand.sender.id === currentUser;

        const messageElement = createElementWithAttributes('div', {
            class: `w-4/5 ${isCurrentUser ? 'ml-auto' : 'mr-auto'} ${message.expand.sender.id === previousSenderId ? 'mt-px' : 'mt-4'}`
        });

        // Create a container for the username and timestamp
        const headerElement = createElementWithAttributes('div', {
            class: 'flex justify-between'
        });

        // Only show the username and timestamp if the sender is different from the previous message's sender
        if (message.expand.sender.id !== previousSenderId) {
            const usernameElement = createElementWithAttributes('h6', {
                class: 'text-s'
            });
            usernameElement.innerText = message.expand.sender.username;

            const dateElement = createElementWithAttributes('span', {
                class: 'text-gray-400 text-sm'
            });
            dateElement.innerText = formatDate(message.created);

            // Append the username and timestamp to the header container
            headerElement.appendChild(usernameElement);
            headerElement.appendChild(dateElement);
        }

        // Message text element
        const textElement = createElementWithAttributes('p', {
            class: `px-4 py-2 rounded-xl ${isCurrentUser ? 'bg-gray-700 text-white' : 'bg-blue-700 text-white'}`
        });
        textElement.innerText = message.text;

        // Append the header container and text element to the main message element
        messageElement.appendChild(headerElement);
        messageElement.appendChild(textElement);

        mainContent.appendChild(messageElement);
        scrollToBottom();

        // Update the previousSenderId for the next iteration
        previousSenderId = message.expand.sender.id;
    });
}




// Rendeer Chatbox

function renderChatbox() {
    const mainContent = document.getElementById("mainContent");

    // Create the chat input container
    const chatInputContainer = createElementWithAttributes('div', {
        class: 'border-t p-4 flex absolute bottom-0 left-0 w-full'
    });

    // Create the input element
    const messageInput = createElementWithAttributes('textarea', {
        id: 'messageInput',
        rows: '1',
        class: 'p-2 border rounded text-gray-900 w-5/6 resize-y',
        placeholder: 'Type your message...'
    });

    // Create the send button
    const sendButton = createElementWithAttributes('button', {
        id: 'sendButton',
        class: 'ml-2 p-2 bg-blue-500 text-white rounded w-1/6 overflow'
    });
    sendButton.innerText = 'Send';

    // Append the input and send button to the container
    chatInputContainer.appendChild(messageInput);
    chatInputContainer.appendChild(sendButton);

    // Append the chat input container to the main content
    mainContent.appendChild(chatInputContainer);

    // Event listener for the send button
    sendButton.addEventListener('click', sendMessage);

    // Event listener to detect the "Enter" key on the input
    messageInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevents line break in textarea
            sendMessage();
        }
    });
}


function createElementWithAttributes(tag, attributes) {
    const element = document.createElement(tag);
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    return element;
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchAndRenderMessages();
});


function formatDate(timestamp) {
    const date = new Date(timestamp);

    // Extract date in the format YYYY-MM-DD
    const formattedDate = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    // Extract time in the format HH:MM
    const formattedTime = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false  // Use 24-hour format
    });

    return `${formattedDate} ${formattedTime}`;
}

function scrollToBottom() {
    const mainContent = document.getElementById("mainContent");
    mainContent.scrollTop = mainContent.scrollHeight;
}
