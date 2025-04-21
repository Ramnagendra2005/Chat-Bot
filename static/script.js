document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    let inputField = document.getElementById("user-input");
    let userText = inputField.value.trim();

    if (userText === "") return;

    let chatBox = document.getElementById("chat-box");

    // Append user message
    let userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.innerHTML = userText;
    chatBox.appendChild(userMessage);
    
    inputField.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Show typing indicator
    let typingIndicator = document.createElement("div");
    typingIndicator.classList.add("message", "bot-message");
    typingIndicator.innerHTML = "Thinking...";
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Send message to backend
    fetch("/chat", {
        method: "POST",
        body: JSON.stringify({ message: userText }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        chatBox.removeChild(typingIndicator); // Remove typing indicator
        let botMessage = document.createElement("div");
        botMessage.classList.add("message", "bot-message");
        botMessage.innerHTML = data.response;  // Ensure formatted response
        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
        chatBox.removeChild(typingIndicator);
        let errorMessage = document.createElement("div");
        errorMessage.classList.add("message", "bot-message");
        errorMessage.innerHTML = "Error: Unable to process request.";
        chatBox.appendChild(errorMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}
