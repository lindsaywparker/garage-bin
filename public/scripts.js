// FUNCTIONS
const toggleDoor = () => {
  $('.garage-door').toggleClass('garage-open');
}

const addItem = (e) => {
  e.preventDefault();
  postItem();
  clearInputs();
}

const postItem = () => {
  const name = $('.item-name-input').val();
  const reason = $('.item-reason-input').val();
  const cleanliness = $('.cleanliness-dropdown').val();
  
  fetch('/api/v1/item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      reason,
      cleanliness,
    }),
  })
    .then(res => res.json())
    .then(item => {
      buildListItem([item]);
      updateCounters([item]);
    })
    .catch(error => console.log({ error }));
}

const clearInputs = () => {
  $('.item-name-input').val('');
  $('.item-reason-input').val('');
  $('.cleanliness-dropdown').val('Select a cleanliness...');
  $('.item-name-input').focus();
}

const buildListItem = (array) => {
  if (!array.length) $('.items-display').text('Your garage is empty!  I don\'t believe it.');
  
  array.forEach((item) => {
      $('.items-display').prepend(`
        <div class="item-card">
          <div class="item-name collapsed">
            ${item.name}
            <div class="item-details">
              <p class="item-reason">${item.reason}</p>
              <label for="cleanliness-dropdown">
                Cleanliness:
                <select
                  class="cleanliness-dropdown"
                  name="cleanliness-dropdown"
                  required
                >
                  <option disabled>Change cleanliness...</option>
                  <option value="Sparkling">Sparkling</option>
                  <option value="Dusty">Dusty</option>
                  <option value="Rancid">Rancid</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      `)
  })
}

const loadItems = () => {
  fetch('api/v1/item')
    .then(res => res.json())
    .then(items => {
      buildListItem(items);
      fetchCounts(items);
    })
    .catch(error => console.log({ error }))
}

const toggleDetails = (e) => {
  $(e.target).toggleClass('collapsed');
}

const fetchCounts = (array) => {
  const counters = {
    total: array.length,
  };
  
  array.forEach((item) => {
    if (!counters[item.cleanliness.toLowerCase()]) {
      counters[item.cleanliness.toLowerCase()] = 0;
    }
    counters[item.cleanliness.toLowerCase()] += 1;
  });
  
  const cleanlinessLevel = Object.keys(counters);

  cleanlinessLevel.forEach(level => $(`.${level}-items-counter`).text(counters[level]))
}

const updateCounters = (array) => {
  const level = array[0].cleanliness.toLowerCase();
  const currentCount = parseInt($(`.${level}-items-counter`).text());
  const newCount = currentCount + 1;
  
  const currentTotal = parseInt($('.total-items-counter').text());
  const newTotal = currentTotal + 1;
  
  $(`.${level}-items-counter`).text(newCount);
  $('.total-items-counter').text(newTotal);
}

// SETUP
loadItems();

// EVENT LISTENERS
$('.garage-door').on('click', toggleDoor);
$('.new-item-form').on('submit', addItem);
$('.items-display').on('click', '.item-name', toggleDetails);
