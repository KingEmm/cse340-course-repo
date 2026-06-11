
const alert = document.querySelector('.alert');

if (alert) {
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.height = '0';
    }, 5000);
    setTimeout(() => {
        alert.style.padding = '0';
        alert.style.margin = '0';
    }, 5500);
    // document.querySelector('body').removeChild(alert);
}