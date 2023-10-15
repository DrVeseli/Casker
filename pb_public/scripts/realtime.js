// realtime.js
import pb from "./pbInit.js";
import { renderMessages } from "./listMessages.js"; // Assuming you'll export this function
import { getCurrentConversationId } from "./currentConversation.js";
import currentUser from "./auth.js";
import { fetchAndRenderConversations } from "./listConvesations.js";

// MESSAGES

pb.collection('messages').subscribe('*', handleIncomingMessage);

let newMessagesCount = {}


async function handleIncomingMessage(event) {
    const currentConversationId = getCurrentConversationId();

    if (event.record.conversation === currentConversationId && event.action === "create") {
        let newMessage = await pb.collection('messages').getOne(event.record.id, {
            expand: 'sender',
        });
        renderMessages([newMessage]);
        sendNotificationForNewMessage(newMessage);
    } else {
        handleNewMessageForOtherConversations(event);
    }
}

function sendNotificationForNewMessage(newMessage) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const notificationPayload = {
            title: `New message from ${newMessage.expand.sender.username}`,
            body: newMessage.text,
        };
        navigator.serviceWorker.controller.postMessage(notificationPayload);
    }
}



function handleNewMessageForOtherConversations(event) {
    const conversationId = event.record.conversation;
    const currentUserId = event.record.sender;

    // Increment the counter for the conversation the message belongs to
    newMessagesCount[conversationId] = (newMessagesCount[conversationId] || 0) + 1;

    // Update the notification counter in the DOM
    if (event.record.sender === currentUserId) {
        const notifElement = document.querySelector(`[data-conversation-id="${conversationId}"] #notif`);
        if (notifElement) {
            notifElement.textContent = newMessagesCount[conversationId];
        }
    }
}


//CONVERSATIONS

pb.collection('conversations').subscribe('*', handleNewConversation);
console.log("connected to convs")

async function handleNewConversation(event) {
    if (event.action === "create" && event.record.users.includes(currentUser)) {
        fetchAndRenderConversations();
        console.log("new conversation")
    }
}