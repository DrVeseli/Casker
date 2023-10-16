import pb from "./pbInit.js";
import currentUser from "./auth.js";
import { renderTask } from "./renderTask.js";


// Initial call to populate the tasks
async function fetchAndRenderTasks() {
    const tasks = await pb.collection('tasks').getFullList({ filter: `tasked ~ "${currentUser}" && status != "Completed"`, sort: "-prio",});

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = '';  // Clear the existing list

    

    tasks.forEach(task => {
        const taskElement = createtaskElement(task);
        taskList.appendChild(taskElement);
    });
}

function createtaskElement(task) {
    const li = createElementWithAttributes("li", {
        class: "flex justify-between px-1 py-3",
        'data-task-id': task.id
    });

    li.innerHTML = `
        <div class="flex px-2 min-w-0 gap-x-4">
            <div class="min-w-0 flex-auto">
                <p class="text-m font-semibol leading-6 text-gray-100">${task.title}</p>
                <p class="text-sm leading-6 text-gray-100">${task.body}</p>

            </div>
        </div>
        <div class="shrink-0 sm:flex sm:flex-col sm:items-end">
            <p id="notif" class="text-sm text-end leading-6 text-gray-50">${task.prio}</p>
            <date class="text-sm  leading-6 text-gray-50">${formatDate(task.deadline)}</date>
        </div>
    `;

    li.addEventListener("click", async () => {
        await renderTask(task);


        
        // Remove 'bg-blue-700' class from all conversation elements
        document.querySelectorAll('li.border-2').forEach((element) => {
            element.classList.remove('border-2', 'rounded-xl', 'p-2', 'm-2', 'bg-slate-800', 'border-slate-500');
        });
    
        // Add 'bg-blue-700' class to the clicked element
        li.classList.add('border-2', 'rounded-xl', 'p-2', 'm-2', 'bg-slate-800', 'border-slate-500');

        const middleColumn = document.getElementById("mainContent");
        middleColumn.scrollIntoView({ behavior: 'smooth' });
        
        });
    

    function createElementWithAttributes(tag, attributes) {
        const element = document.createElement(tag);
        for (let key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        return element;
    }

    return li;
}


setTimeout(fetchAndRenderTasks, 100);  // delay by 1 second


function formatDate(timestamp) {
    const date = new Date(timestamp);

    // Extract date in the format YYYY-MM-DD
    const formattedDate = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });



    return `${formattedDate}`;
}

export default fetchAndRenderTasks