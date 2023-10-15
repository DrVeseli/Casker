// sendMessage.js
import pb from "./pbInit.js";
import currentUser from "./auth.js";
import { getCurrentConversationId } from "./currentConversation.js";

export async function sendMessage() {
    const conversationId = getCurrentConversationId();

    if (!conversationId) {
        console.error("No conversation selected");
        return;
    }

    // Get the message text from the textarea
    const messageText = document.getElementById('messageInput').value;
    
    if (!messageText.trim()) {
        console.error("Message cannot be empty");
        return;
    }

    // Message object
    const message = {
        sender: currentUser,
        conversation: conversationId,
        text: messageText
    };

    try {
        // Save the message
        await pb.collection('messages').create(message);
        
        // Clear the textarea after sending
        document.getElementById('messageInput').value = '';

    } catch (error) {
        console.error("Error sending message:", error);
    }
}
