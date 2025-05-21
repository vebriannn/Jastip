// preview.js
document.getElementById('image').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        document.getElementById('preview').src = e.target.result;
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});
