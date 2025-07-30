document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
        });

        // Optional: Close the mobile menu when a link inside it is clicked
        const mobileMenuLinks = mobileMenu.querySelectorAll('.page-link-mobile');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('open');
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('.page-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Check if the href is an internal anchor link (starts with # and is not just '#')
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
                // If it's a mobile menu link, close the menu
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                }
            } else if (!href.startsWith('#') && href !== 'javascript:void(0);') {
                // For external links or full page reloads, let default behavior
                // but if it's a mobile menu link, close the menu before navigating
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                }
            }
        });
    });

    // Handle active navigation link styling
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.7 // Adjust this value as needed. Higher means more of the section must be visible.
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('nav-link-active');
                    if (link.getAttribute('href').includes(currentSectionId)) {
                        link.classList.add('nav-link-active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Event handling for the "Upcoming Events" section
    const eventGridContainer = document.getElementById('eventGridContainer');
    const eventFilterButtons = document.querySelectorAll('.event-filter-button');

    // Dummy event data (replace with actual data fetched from a backend if applicable)
    const eventsData = [
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
        eventGridContainer.innerHTML = ''; // Clear existing events
        const filteredEvents = filter === 'All'
            ? eventsData
            : eventsData.filter(event => event.type === filter);

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
        lucide.createIcons();
    }

    // Initial render of all events
    renderEvents('All');

    // Add event listeners to filter buttons
    eventFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            eventFilterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            this.classList.add('active');
            renderEvents(this.textContent);
        });
    });

    // News section dynamic content loading
    const latestNewsContainer = document.getElementById('latestNewsContainer');
    const newsData = [
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
    }

    // Render the latest 2 news items on the homepage
    if (latestNewsContainer) {
        renderNews(latestNewsContainer, newsData.slice(0, 2));
    }

    // Lucide Icons (ensure this is at the end or after elements using lucide icons are rendered)
    // Make sure you have included the Lucide JS library in your HTML <head>
    // <script src="https://cdn.jsdelivr.net/npm/lucide@latest"></script>
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('read-more-btn')) {
    const targetId = e.target.getAttribute('data-target');
    const content = document.getElementById(targetId);

    if (content.classList.contains('hidden')) {
      content.classList.remove('hidden');
      e.target.textContent = 'Show Less ↑';
    } else {
      content.classList.add('hidden');
      e.target.textContent = 'Read More →';
    }
  }
});




fetch('assets/data/events.json')
  .then(res => res.json())
  .then(events => {
    const container = document.getElementById('eventsContainer');

    events.forEach(event => {
      const buttonClass = event.buttonDisabled 
        ? 'bg-gray-400 cursor-not-allowed' 
        : 'bg-accent hover:bg-green-600';
      const buttonAttrs = event.buttonDisabled 
        ? 'title="Applications Closed"' 
        : '';

      const card = `
        <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-start card-hover transition-all duration-300">
          <img src="${event.image}" alt="Event" class="w-full md:w-1/3 h-48 object-cover rounded-md mb-4 md:mb-0 md:mr-6">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-primary mb-2">${event.title}</h3>
            <p class="text-sm text-secondary mb-1"><span class="font-semibold">Date:</span> ${event.date}</p>
            <p class="text-sm text-secondary mb-3"><span class="font-semibold">Venue:</span> ${event.venue}</p>
            <p class="text-secondary text-sm mb-4">${event.description}</p>
            <a href="${event.link}" class="inline-block text-white py-2 px-4 rounded-lg transition duration-300 ${buttonClass}" ${buttonAttrs}>
              ${event.buttonText}
            </a>
          </div>
        </div>
      `;

      container.innerHTML += card;
    });
  })
  .catch(error => console.error('Error loading events:', error));

  fetch('assets/data/grid-events.json')
  .then(res => res.json())
  .then(events => {
    const container = document.getElementById('eventGridContainer');

    events.forEach(event => {
      const tagsHTML = event.tags.map(tag => `<span class="event-tag">${tag}</span>`).join('');

      const prizeLines = event.prizes
        ? Object.entries(event.prizes)
            .map(([key, value]) => `<p class="event-card-meta"><span>${capitalize(key)}:</span> ${value}</p>`)
            .join('')
        : '';

      const card = `
        <div class="event-card">
          <img src="${event.image}" alt="${event.title}" class="event-card-image">
          <div class="event-card-content">
            <div class="event-card-tags">${tagsHTML}</div>
            <h3 class="event-card-title">${event.title}</h3>
            <p class="event-card-meta"><span>Date:</span> ${event.date} | <span>Venue:</span> ${event.venue}</p>
            ${prizeLines}
            <p class="event-card-description">
              ${event.description}
              <a href="${event.readMoreLink}" class="event-card-link">
                Read More <i data-lucide="arrow-right"></i>
              </a>
            </p>
          </div>
        </div>
      `;

      container.innerHTML += card;
    });
  });

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
document.addEventListener('DOMContentLoaded', () => {
  fetch('assets/data/news.json')
    .then(res => res.json())
    .then(newsItems => {
      const container = document.getElementById('latestNewsContainer');

      if (!container) {
        console.warn('News container not found.');
        return;
      }

      newsItems.forEach(news => {
        const article = `
          <article class="flex bg-light p-6 rounded-lg shadow-md">
            <img src="${news.image}" alt="${news.title}" class="w-1/3 h-auto object-cover rounded-md mr-6">
            <div>
              <h3 class="text-xl font-semibold text-primary mb-2">${news.title}</h3>
              <p class="text-sm text-secondary mb-1">${news.date}</p>
              <p class="text-secondary text-sm mb-3">${news.description}</p>
              <a href="${news.readMoreLink}" class="text-accent hover:underline font-medium page-link">Read More</a>
            </div>
          </article>
        `;
        container.innerHTML += article;
      });
    })
    .catch(error => console.error('Error loading news:', error));
});

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('newsGridContainer');

  if (!container) return;

  fetch('assets/data/news.json')
    .then(res => res.json())
    .then(newsItems => {
      newsItems.forEach((news, index) => {
        const card = `
          <article class="bg-white rounded-lg shadow-md flex flex-col overflow-hidden transition hover:shadow-lg">
            <img src="${news.image}" alt="${news.title}" class="w-full h-56 object-cover">
            <div class="p-6 flex flex-col flex-grow">
              <p class="text-sm text-secondary mb-1">${news.date}</p>
              <h3 class="text-lg font-bold text-dark mb-2">${news.title}</h3>
              <p class="text-sm text-secondary mb-4">${news.description}</p>

              <!-- Hidden Full Text -->
              <div id="full-${index}" class="hidden text-sm text-secondary mb-4">${news.fullText}</div>

              <!-- Toggle Button -->
              <button class="text-accent font-semibold hover:underline mt-auto read-more-btn" data-target="full-${index}">
                Read More →
              </button>
            </div>
          </article>
        `;
        container.innerHTML += card;
      });
    })
    .catch(err => console.error('Error loading news:', err));
});
// script.js
            // Update active state for desktop nav links (only for main page links, not buttons)
            desktopNavLinks.forEach(link => {
                if (link.classList.contains('nav-link')) { // Apply active style only to actual nav-links
                    if (link.getAttribute('href') === `#${pageId}`) {
                        link.classList.add('nav-link-active');
                    } else {
                        link.classList.remove('nav-link-active');
                    }
                }
            });

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('href').substring(1);
                showPage(pageId);
                // Update URL hash
                history.pushState(null, null, `#${pageId}`);
            });
        });
        
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('href').substring(1);
                showPage(pageId);
                // Close mobile menu
                document.getElementById('mobile-menu').classList.remove('open');
                // Update URL hash
                history.pushState(null, null, `#${pageId}`);
            });
        });


        // Handle initial page load based on URL hash
        function handlePageNavigation() {
            const initialPageId = window.location.hash ? window.location.hash.substring(1) : 'home';
            // Ensure a valid page ID is shown, default to home if not found
            const validPage = document.getElementById(initialPageId);
            if (validPage && validPage.classList.contains('page')) {
                 showPage(initialPageId);
            } else {
                 showPage('home');
                 history.replaceState(null, null, '#home'); // Correct the hash if invalid
            }
        }

        // Listen to hash changes for browser back/forward buttons
        window.addEventListener('popstate', handlePageNavigation);

        // Initial page load
        document.addEventListener('DOMContentLoaded', () => {
            handlePageNavigation();
            document.getElementById('currentYear').textContent = new Date().getFullYear();

            // Mobile menu toggle
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('open');
            });
        });
