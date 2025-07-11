fetch('events.json')
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

  fetch('grid-events.json')
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
fetch('news.json')
  .then(res => res.json())
  .then(newsItems => {
    const container = document.getElementById('latestNewsContainer');

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
  });
