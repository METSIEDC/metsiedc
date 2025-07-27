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

// Function to show the pop-up
function showPopup() {
    const popup = document.getElementById('welcome-popup'); // Target the new ID
    if (popup) {
        popup.classList.add('active'); // Add 'active' class to show it
    }
}

// Function to hide the pop-up
function hidePopup() {
    const popup = document.getElementById('welcome-popup'); // Target the new ID
    if (popup) {
        popup.classList.remove('active'); // Remove 'active' class to hide it
    }
}

// Show the pop-up when the page loads
window.addEventListener('load', showPopup);
