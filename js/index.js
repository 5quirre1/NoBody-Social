function toggleFileInput() {
    const feridinhaBtn = document.getElementById("feridinhaBtn");
    const fileInput = document.getElementById("fileInput");
    const feridinhaStart = document.getElementById("feridinhaStart");

    const isFileInputVisible = fileInput.style.display === "block";
    fileInput.style.display = isFileInputVisible ? "none" : "block";
    feridinhaStart.style.display = isFileInputVisible ? "none" : "block";


}
    
document.addEventListener("DOMContentLoaded", () => {
            const profilePic = localStorage.getItem("profilePic");
            if (profilePic) {
                document.getElementById("profile-pic").src = profilePic;
            }
            const savedName = localStorage.getItem("profileName");
            if (savedName) {
                document.querySelector(".username").textContent = savedName;
            }
        });

        function saveName() {
            const newName = document.getElementById("new-name").value;
            if (newName) {
                localStorage.setItem("profileName", newName);
                document.querySelector(".username").textContent = newName;
                closeProfileSettings();
            }
        }
        function uploadProfilePicture() {
            const file = document.getElementById("profile-upload").files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const profilePicUrl = reader.result;
                    localStorage.setItem("profilePic", profilePicUrl);
                    document.getElementById("profile-pic").src = profilePicUrl;
                };
                reader.readAsDataURL(file);
            }
        }

        function openPostModal() {
            const modal = document.getElementById("post-form-modal");
            modal.style.visibility = 'visible';
            modal.style.opacity = 1;
            setTimeout(() => {
                modal.querySelector(".modal-content").style.opacity = 1;
            }, 300);
        }

        document.addEventListener("keydown", function(event) {
            if (event.key === "Escape") {
                closePostModal();
                closeProfileSettings();
            }
        });

        document.addEventListener("click", function(event) {
            const modal = document.getElementById("post-form-modal");
            const profileSettingsModal = document.getElementById("profile-settings-modal");
            if (event.target === modal) {
                closePostModal();
            }

            if (event.target === profileSettingsModal) {
                closeProfileSettings();
            }
        });

        function closePostModal() {
            const modal = document.getElementById("post-form-modal");
            modal.style.opacity = 0;
            modal.style.visibility = 'hidden';
            modal.querySelector(".modal-content").style.opacity = 0;
        }

        function createPost() {
    const title = document.getElementById("post-title").value;
    const description = document.getElementById("post-description").value;
    const mediaLink = document.getElementById("post-media-link").value;

    if (title && description) {
        const post = {
            title,
            description,
            mediaUrl: mediaLink,
            mediaType: mediaLink ? (mediaLink.includes("youtube.com") ? "video" : getMediaType(mediaLink)) : null,
            timestamp: new Date().toLocaleString(),
        };

        let posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts.push(post);
        localStorage.setItem("posts", JSON.stringify(posts));

        document.getElementById("post-title").value = "";
        document.getElementById("post-description").value = "";
        document.getElementById("post-media-link").value = "";

        loadPosts();
        closePostModal();
    } else {
        alert("Please fill out all fields.");
    }
}

function getMediaType(mediaUrl) {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const videoExtensions = ["mp4", "webm", "ogg"];
    const audioExtensions = ["mp3", "wav", "ogg"];
    
    const extension = mediaUrl.split('.').pop().toLowerCase();
    
    if (imageExtensions.includes(extension)) {
        return "image";
    } else if (videoExtensions.includes(extension)) {
        return "video";
    } else if (audioExtensions.includes(extension)) {
        return "audio";
    }
    return null;
}
document.addEventListener("DOMContentLoaded", loadPosts);

function loadPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.forEach((post, index) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        let mediaContent = "";

        if (post.mediaType === "image") {
            mediaContent = `<img src="${post.mediaUrl}" alt="Post Image">`;
        } else if (post.mediaType === "video") {
            if (post.mediaUrl.includes("youtube.com") || post.mediaUrl.includes("youtu.be")) {
                const videoId = post.mediaUrl.split("v=")[1]?.split("&")[0] || post.mediaUrl.split("/").pop();
                mediaContent = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=0" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            } else {
                mediaContent = `<iframe src="${post.mediaUrl}?autoplay=0" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            }
        } else if (post.mediaType === "audio") {
            mediaContent = `<audio controls><source src="${post.mediaUrl}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
        }

        const postHTML = `
            <h2>${post.title}</h2>
            <p>${post.description}</p>
            ${mediaContent}
            <p class="timestamp">${post.timestamp}</p>
            <div class="actions">
                <button class="post-btn" onclick="deletePost(${index})">Delete</button>
            </div>
        `;
        postElement.innerHTML = postHTML;
        postsContainer.appendChild(postElement);
    });
}




        function openProfileSettings() {
            const modal = document.getElementById("profile-settings-modal");
            modal.style.visibility = 'visible';
            modal.style.opacity = 1;
            setTimeout(() => {
                modal.querySelector(".modal-content").style.opacity = 1;
            }, 300);
        }

        function updateProfilePicture() {
            const file = document.getElementById("new-profile-pic").files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const profilePicUrl = reader.result;
                    localStorage.setItem("profilePic", profilePicUrl);
                    document.getElementById("profile-pic").src = profilePicUrl;
                };
                reader.readAsDataURL(file);
            }
        }

        function closeProfileSettings() {
            const modal = document.getElementById("profile-settings-modal");
            modal.style.opacity = 0;
            modal.style.visibility = 'hidden';
            modal.querySelector(".modal-content").style.opacity = 0;
        }
        function deletePost(index) {
            let posts = JSON.parse(localStorage.getItem("posts")) || [];
            posts.splice(index, 1);
            localStorage.setItem("posts", JSON.stringify(posts));
            loadPosts();
        }

        
        async function uploadToFeridinha() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("https://feridinha.com/upload", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to upload file.");
        }

        const result = await response.json();
        // this is pretty vroken but it works so uh :P
        if (result.success && result.url) {
            document.getElementById("post-media-link").value = result.url;
        } else if (result.url) {
            document.getElementById("post-media-link").value = result.url;
        } else {
            alert("Here ya go! " + (result.message));
        }
    } catch (error) {
        if (error instanceof TypeError) {
            alert("There was an some issue with the network request gregdfskj Please try again in a bit :\()");
        } else {
            alert("look in the console, there was some weird error");
        }
    }
}
