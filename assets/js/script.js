document.addEventListener('DOMContentLoaded', function() {
    // --- Core Navigation and Menu Elements ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.page-link'); // For smooth scrolling (desktop and mobile)
    const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('.page-link-mobile') : []; // Links specific to mobile menu
    const desktopNavLinks = document.querySelectorAll('.nav-link'); // For active state styling
    const allPages = document.querySelectorAll('.page'); // Assuming your main content sections have class 'page'

    // --- Dynamic Content Containers ---
    const eventGridContainer = document.getElementById('eventGridContainer');
    const eventFilterButtons = document.querySelectorAll('.event-filter-button');
    const latestNewsContainer = document.getElementById('latestNewsContainer'); // For news on homepage
    const newsGridContainer = document.getElementById('newsGridContainer'); // For dedicated news page (if applicable)
    const eventsListContainer = document.getElementById('eventsContainer'); // For the other event section (long list)

    // --- Helper Function: Capitalize ---
    // Moved inside DOMContentLoaded or can be global if truly needed elsewhere
    function capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    // --- Page Navigation Function ---
    // This function will handle showing/hiding different content sections based on URL hash
    function showPage(pageId) {
        allPages.forEach(page => {
            if (page.id === pageId) {
                page.classList.remove('hidden'); // Show the target page
            } else {
                page.classList.add('hidden'); // Hide other pages
            }
        });

        // Update active state for desktop nav links
        desktopNavLinks.forEach(link => {
            if (link.classList.contains('nav-link')) {
                if (link.getAttribute('href') === `#${pageId}`) {
                    link.classList.add('nav-link-active');
                } else {
                    link.classList.remove('nav-link-active');
                }
            }
        });
    }

    // --- Mobile Menu Toggle ---
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
        });

        // Close the mobile menu when a link inside it is clicked
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('open');
            });
        });
    }

    // --- Smooth Scrolling for Navigation Links (both desktop and mobile) ---
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault(); // Prevent default anchor link behavior

                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }

                // If it's a mobile menu link, close the menu after clicking
                if (mobileMenu && mobileMenu.classList.contains('open') && this.classList.contains('page-link-mobile')) {
                    mobileMenu.classList.remove('open');
                }
                // Update URL hash for consistent navigation
                history.pushState(null, null, href);
            } else if (!href.startsWith('#') && href !== 'javascript:void(0);') {
                // For external links or full page reloads, let default behavior
                // but if it's a mobile menu link, close the menu before navigating
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                }
            }
        });
    });

    // --- Handle initial page load based on URL hash ---
    function handlePageNavigation() {
        const initialPageId = window.location.hash ? window.location.hash.substring(1) : 'home';
        const validPage = document.getElementById(initialPageId);

        if (validPage && validPage.classList.contains('page')) {
            showPage(initialPageId);
        } else {
            showPage('home'); // Default to home if hash is invalid or missing
            history.replaceState(null, null, '#home'); // Correct the URL hash
        }
    }

    // Listen to hash changes for browser back/forward buttons
    window.addEventListener('popstate', handlePageNavigation);

    // Initial page load call
    handlePageNavigation();


    // --- Set current year in footer ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Event handling for "Upcoming Events" section (using dummy data from previous logic) ---
    // Note: This block uses the *hardcoded* eventsData. If you fully rely on JSON,
    // you can remove this dummy data and the renderEvents function below.
    const eventsData = [
        // Your existing dummy event data here...
        {
            id: 'event1',
            type: 'Ongoing',
            tags: ['Workshop', 'Tech'],
            image: 'https://placehold.co/400x200/FFC107/333333?text=Hackathon',
            title: 'Annual Hackathon 2025',
            date: 'August 10, 2025',
            time: '9:00 AM - 5:00 PM',
            location: 'Innovation Hub',
            description: 'Join us for our annual hackathon and build innovative solutions!',
            link: '#'
        },
        {
            id: 'event2',
            type: 'UpComing',
            tags: ['Seminar', 'Entrepreneurship'],
            image: 'https://placehold.co/400x200/28A745/FFFFFF?text=Seminar',
            title: 'Startup Pitching Session',
            date: 'September 5, 2025',
            time: '2:00 PM - 4:00 PM',
            location: 'Auditorium',
            description: 'Entrepreneurs showcase their ideas to potential investors.',
            link: '#'
        },
        {
            id: 'event3',
            type: 'Past',
            tags: ['Workshop', 'Coding'],
            image: 'https://placehold.co/400x200/007BFF/FFFFFF?text=Coding',
            title: 'Introduction to Python',
            date: 'July 15, 2025',
            time: '10:00 AM - 1:00 PM',
            location: 'Lab 301',
            description: 'A beginner-friendly workshop on Python programming.',
            link: '#'
        },
        {
            id: 'event4',
            type: 'Festival',
            tags: ['Culture', 'Innovation'],
            image: 'https://placehold.co/400x200/DC3545/FFFFFF?text=TechFest',
            title: 'Tech Fest 2024',
            date: 'November 12, 2024',
            time: 'Full Day',
            location: 'College Campus',
            description: 'Our annual technology festival with various competitions.',
            link: '#'
        },
        {
            id: 'event5',
            type: 'Coded',
            tags: ['Competition', 'Programming'],
            image: 'https://placehold.co/400x200/6610F2/FFFFFF?text=CodeJam',
            title: 'Inter-College Code Jam',
            date: 'June 20, 2025',
            time: '1:00 PM - 6:00 PM',
            location: 'Online',
            description: 'A competitive programming event for students.',
            link: '#'
        },
        {
            id: 'event6',
            type: 'Sports',
            tags: ['Fitness', 'Teamwork'],
            image: 'https://placehold.co/400x200/17A2B8/FFFFFF?text=SportsDay',
            title: 'IEDC Sports Day',
            date: 'October 1, 2025',
            time: 'All Day',
            location: 'College Ground',
            description: 'Annual sports event to promote fitness and team spirit.',
            link: '#'
        },
        {
            id: 'event7',
            type: 'Music',
            tags: ['Performance', 'Entertainment'],
            image: 'https://placehold.co/400x200/FD7E14/FFFFFF?text=MusicNight',
            title: 'Music Night',
            date: 'December 1, 2025',
            time: '7:00 PM - 10:00 PM',
            location: 'Open Air Theatre',
            description: 'An evening of musical performances by talented students.',
            link: '#'
        }
    ];

    function renderEvents(filter = 'All') {
        if (!eventGridContainer) return; // Exit if container not found
        eventGridContainer.innerHTML = ''; // Clear existing events
        const filteredEvents = filter === 'All' ? eventsData : eventsData.filter(event => event.type === filter);

        filteredEvents.forEach(event => {
            const eventCard = `
                <div class="event-card">
                    <img src="${event.image}" alt="${event.title}" class="event-card-image">
                    <div class="event-card-content">
                        <div class="event-card-tags">
                            ${event.tags.map(tag => `<span class="event-tag">${tag}</span>`).join('')}
                        </div>
                        <h3 class="event-card-title">${event.title}</h3>
                        <p class="event-card-meta">
                            <span>Date:</span> ${event.date} <br>
                            <span>Time:</span> ${event.time} <br>
                            <span>Location:</span> ${event.location}
                        </p>
                        <p class="event-card-description">${event.description}</p>
                        <a href="${event.link}" class="event-card-link">
                            Learn More <i data-lucide="arrow-right" class="lucide"></i>
                        </a>
                    </div>
                </div>
            `;
            eventGridContainer.insertAdjacentHTML('beforeend', eventCard);
        });
        // After rendering, re-initialize lucide icons for newly added elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Initial render of all events if the container exists
    if (eventGridContainer) {
        renderEvents('All');
    }

    // Add event listeners to filter buttons
    eventFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            eventFilterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderEvents(this.textContent);
        });
    });

    // --- News section dynamic content loading (using dummy data from previous logic) ---
    // Note: This block uses the *hardcoded* newsData. If you fully rely on JSON,
    // you can remove this dummy data and the renderNews function below.
    const newsData = [
        // Your existing dummy news data here...
        {
            id: 'news1',
            image: 'https://placehold.co/600x400/007BFF/FFFFFF?text=News+1',
            category: 'Innovation',
            title: 'IEDC Secures Top Spot in State Innovation Rankings',
            date: 'July 28, 2025',
            description: 'MET\'S IEDC has been recognized for its outstanding contributions to the startup ecosystem in Kerala, securing the first position in the latest state innovation rankings.'
        },
        {
            id: 'news2',
            image: 'https://placehold.co/600x400/28A745/FFFFFF?text=News+2',
            category: 'Events',
            title: 'Successful Completion of "Ideate & Innovate" Workshop',
            date: 'July 20, 2025',
            description: 'Our recent "Ideate & Innovate" workshop saw massive participation, empowering students with critical thinking and problem-solving skills for entrepreneurship.'
        },
        {
            id: 'news3',
            image: 'https://placehold.co/600x400/FFC107/333333?text=News+3',
            category: 'Partnership',
            title: 'New Collaboration with TechCorp Solutions Announced',
            date: 'July 10, 2025',
            description: 'MET\'S IEDC is proud to announce a strategic partnership with TechCorp Solutions, aiming to provide enhanced mentorship and internship opportunities for our students.'
        },
        {
            id: 'news4',
            image: 'https://placehold.co/600x400/DC3545/FFFFFF?text=News+4',
            category: 'Student Success',
            title: 'Student Startup "AquaPure" Secures Seed Funding',
            date: 'July 5, 2025',
            description: 'Congratulations to "AquaPure," a student-led startup from our incubation center, for successfully raising seed funding to scale their sustainable water purification solution.'
        }
    ];

    function renderNews(container, newsItems) {
        if (!container) return; // Exit if container not found
        container.innerHTML = ''; // Clear existing news
        newsItems.forEach(news => {
            const newsCard = `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden card-hover">
                    <img src="${news.image}" alt="${news.title}" class="w-full h-56 object-cover">
                    <div class="p-6">
                        <span class="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">${news.category}</span>
                        <h3 class="text-xl font-bold text-dark mb-2">${news.title}</h3>
                        <p class="text-secondary text-sm mb-4">${news.date}</p>
                        <p class="text-gray-700 leading-relaxed mb-4">${news.description}</p>
                        <a href="news.html#${news.id}" class="text-primary hover:text-blue-700 font-semibold transition">Read More &rarr;</a>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', newsCard);
        });
        if (typeof lucide !== 'undefined') {
            lucide.createIcons(); // Re-create
