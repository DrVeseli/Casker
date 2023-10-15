document.getElementById('enableNotificationsButton').addEventListener('click', function() {
    Notification.requestPermission().then(function(permission) {
        if (permission === "granted") {
            console.log("Notification permission granted.");
            // You can initiate some notification related logic here if required
        } else {
            console.log("Notification permission denied.");
        }
    });
});
