// currentConversation.js


export function setCurrentConversationId(id) {
    localStorage.setItem('currentConversationId', id);

}

export function getCurrentConversationId() {
    return localStorage.getItem('currentConversationId');
    
}

