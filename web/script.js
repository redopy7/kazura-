document.getElementById('toggle-btn').addEventListener('click', function () {
    document.body.classList.toggle('light-mode');
    const isLightMode = document.body.classList.contains('light-mode');
    this.textContent = isLightMode ? 'Dark Mode' : 'Light Mode';
});
