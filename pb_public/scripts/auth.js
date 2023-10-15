import pb from "./pbInit.js";

if (!pb.authStore.isValid) {
    window.location.href = "/login.html";
}
let currentUser = pb.authStore.model.id

const record = await pb.collection('users').getOne(currentUser, {});

let avatarImg = document.getElementById('avatar');

// 2. Construct the URL
let imgUrl = `/api/files/_pb_users_auth_/${currentUser}/${record.avatar}`;

// 3. Set the src attribute
avatarImg.setAttribute('src', imgUrl);

console.log(currentUser)

export default currentUser
