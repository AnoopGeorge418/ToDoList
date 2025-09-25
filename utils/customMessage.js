// Custom function for message display
function ShowMessage(type, message="", duration=3000){
    const msg = document.getElementById(type);

    if (!msg) return;
    if (message) msg.textContent = message;

    msg.classList.add("show");
    setTimeout(() => {
        msg.classList.remove("show");
    }, duration);
}

export default ShowMessage;

