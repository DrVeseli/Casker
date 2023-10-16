import pb from "./pbInit.js";


document.getElementById('logouthbutton').addEventListener('click', function() {
    pb.authStore.clear();
    console.log("logged out")
    location.reload();
})
