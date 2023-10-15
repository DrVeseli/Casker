import pb from "./pbInit.js";
import currentUser from "./auth.js";
import { setCurrentConversationId } from "./currentConversation.js";
import { fetchAndRenderMessages } from "./listMessages.js";




// Initial call to populate the conversations
async function fetchAndRenderConversations() {
    
    const conversations = await pb.collection('conversations').getFullList({ filter: `users ~ "${currentUser}"` });

    const conversationsList = document.getElementById("conversationsList");
    conversationsList.innerHTML = '';  // Clear the existing list

    conversations.forEach(conversation => {
        const conversationElement = createConversationElement(conversation);
        conversationsList.appendChild(conversationElement);
    });
}

function createConversationElement(conversation) {
    const newMessagesCount = {};
    const li = createElementWithAttributes("li", {
        class: "flex justify-between px-1 py-3",
        'data-conversation-id': conversation.id
    });

    li.innerHTML = `
        <div class="flex px-2 min-w-0 gap-x-4">
            </img class="h-10 w-10 flex-none border border-gray-50 rounded-full" src="" alt="">
            <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibol leading-6 text-gray-100">${conversation.name}</p>
            </div>
        </div>
        <div class="shrink-0 sm:flex sm:flex-col sm:items-end">
            <p id="notif" class="text-sm leading-6 text-gray-50"></p>
        </div>
    `;

    li.addEventListener("click", async () => {
        setCurrentConversationId(conversation.id);
        await fetchAndRenderMessages();

        // Reset the counter for the clicked conversation
        const conversationId = conversation.id;
        newMessagesCount[conversationId] = 0;
    
        // Update the notification counter in the DOM
        const notifElement = li.querySelector("#notif");
        if (notifElement) {
        notifElement.textContent = '';}
        
        // Remove 'bg-blue-700' class from all conversation elements
        document.querySelectorAll('li.bg-blue-700').forEach((element) => {
            element.classList.remove('bg-blue-700');
        });
    
        // Add 'bg-blue-700' class to the clicked element
        li.classList.add('bg-blue-700');

        // Set the conversation name
        const currentConvNameElement = document.getElementById("currentConvName");
        currentConvNameElement.innerText = conversation.name;

        const middleColumn = document.getElementById("messageInput");
        middleColumn.scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
            document.getElementById("messageInput").focus();
        }, 1000)    });
    
    

    function createElementWithAttributes(tag, attributes) {
        const element = document.createElement(tag);
        for (let key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        return element;
    }

    return li;
}
setTimeout(fetchAndRenderConversations, 100);  // delay by 1 second


export { fetchAndRenderConversations };