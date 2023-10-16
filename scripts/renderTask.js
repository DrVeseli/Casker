import pb from "./pbInit.js";
import fetchAndRenderTasks from "./listTasks.js";

function renderTask(task) {
    // 1. Get the mainContent DOM element
    const mainContent = document.getElementById("mainContent");

    // 2. Clear the inner HTML
    mainContent.innerHTML = '';

            // Set the conversation name
            const currentConvNameElement = document.getElementById("currentConvName");
            currentConvNameElement.innerText = task.title;

    // 3. Populate the main content with task details
    const taskContent = `
        <div>
            <p><strong>Deadline:</strong> ${formatDate(task.deadline)}</p>
            <p class="mb-10"><strong>Priority:</strong> ${task.prio}</p>
        </div>
        <div>
            <strong>Description</strong>
            <p>${task.body}</p>
        </div>
        <div>
        <button id="completeTaskBtn" class="btn btn-accent mt-4">Complete</button>
        </div>
        <button><small>set to Inactive<small></button>

    `;

    mainContent.innerHTML = taskContent;

// Attach event listener to the "Complete" button
const completeBtn = document.getElementById("completeTaskBtn");
completeBtn.addEventListener("click", async () => {
    const data = { status: "Completed" };
    try {
        // 1. Update the task status first
        const record = await pb.collection('tasks').update(task.id, data);

        // 2. Once the update is successful, refresh the task list
        fetchAndRenderTasks();
        const tasksCollumn = document.getElementById("taskList");
        tasksCollumn.scrollIntoView({ behavior: 'smooth' });
        mainContent.innerHTML = '';

        // Optionally, provide some feedback to the user, e.g., updating the UI or showing a message
    } catch (error) {
        console.error("Error updating task status:", error);
        // Handle the error appropriately, maybe show an error message to the user
    }
});

}


function formatDate(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    return `${formattedDate}`;
}

export { renderTask };
