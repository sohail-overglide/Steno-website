console.log('DUNA Landing Page Loaded');

// Ticker Animation (Cloning for infinite scroll)
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
    const clones = tickerTrack.innerHTML;
    tickerTrack.innerHTML += clones;
}

// Navbar Scroll Effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
