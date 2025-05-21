
document.querySelector('.filter-togle').addEventListener('click', function () {
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;

    sidebar.classList.toggle('show-sidebar');
    body.classList.toggle('no-scroll');
});

// Menutup sidebar saat mencapai footer
window.addEventListener('scroll', function () {
    const sidebar = document.querySelector('.sidebar');
    const footer = document.querySelector('#footer');
    const body = document.body;

    const footerTop = footer.getBoundingClientRect().top;
    const sidebarBottom = sidebar.getBoundingClientRect().bottom;
    if (sidebarBottom >= footerTop) {
        sidebar.classList.remove('show-sidebar');
        body.classList.remove('no-scroll');
    }
});

document.addEventListener('click', function (event) {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.filter-togle');
    const body = document.body;

    if (sidebar.classList.contains('show-sidebar') &&
        !sidebar.contains(event.target) &&
        !toggleButton.contains(event.target)) {
        sidebar.classList.remove('show-sidebar');
        body.classList.remove('no-scroll');
    }
});

