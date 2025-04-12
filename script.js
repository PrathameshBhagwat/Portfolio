document.addEventListener('DOMContentLoaded', function() {
    // Menu icon functionality
    let menuIcon = document.querySelector('#menu-icon');
    let navbar = document.querySelector('.navbar');

    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };

    // Close menu when clicking a link
    let navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        });
    });

    // Function to handle both scrolling and active section highlighting
    function handleScroll() {
        // Close menu when scrolling (optional, can be removed if you want menu to stay open)
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
        
        // Active link highlighting
        let sections = document.querySelectorAll('section');
        let top = window.scrollY;
        
        sections.forEach(sec => {
            let offset = sec.offsetTop - 150;
            let height = sec.offsetHeight;
            let id = sec.getAttribute('id');

            if(top >= offset && top < offset + height) {
                navLinks.forEach(links => {
                    links.classList.remove('Active');
                });
                let currentLink = document.querySelector('.navbar a[href*=' + id + ']');
                if(currentLink) {
                    currentLink.classList.add('Active');
                }
            }
        });
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Call once on page load to set initial active state
    handleScroll();
    
    // Handle the about image hover functionality 
    let aboutImg = document.querySelector('.about-img-content img');
    let aboutImgDiv = document.querySelector('.about-img-div');
    
    if(aboutImg && aboutImgDiv) {
        aboutImgDiv.addEventListener('click', function() {
            aboutImg.style.opacity = aboutImg.style.opacity === '0' ? '1' : '0';
        });
    }
});