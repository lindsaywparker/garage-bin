// FUNCTIONS
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

const loadItems = (direction = null) => {
  $('.items-display').text('');
  fetch('api/v1/item')
    .then(res => res.json())
    .then(items => {
      buildListItem(items, direction);
      fetchCounts(items);
    })
    .catch(error => console.log({ error }))
}

const buildListItem = (array, direction) => {
  if (!array.length) $('.items-display').text('Your garage is empty!  I don\'t believe it.');

  let renderArray = array;
  
  if (direction) {
    const renderArray = array.sort((a, b) => {
      if (direction === 'A-Z') {
        return b.name.localeCompare(a.name);
      }
      return a.name.localeCompare(b.name);
    });
  }
  
  let fragment = document.createDocumentFragment();
  
  renderArray.forEach((item) => {
    const sparklingBool = item.cleanliness === 'Sparkling' ? 'selected' : '';
    const dustyBool = item.cleanliness === 'Dusty' ? 'selected' : '';
    const rancidBool = item.cleanliness === 'Rancid' ? 'selected' : '';
    
    const itemDiv = document.createElement('itemDiv');
    itemDiv.innerHTML = `
      <div class="item-card" id="${item.id}">
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
                <option value="Sparkling" ${sparklingBool}>Sparkling</option>
                <option value="Dusty" ${dustyBool}>Dusty</option>
                <option value="Rancid" ${rancidBool}>Rancid</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    `;
    fragment.prepend(itemDiv);
  });
  
  $('.items-display').prepend(fragment);
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

const changeCleanliness = (e) => {
  const newCleanliness = e.target.value;
  const itemId = parseInt($(e.target).parents('.item-card').attr('id'));
  fetch(`/api/v1/item/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cleanliness: newCleanliness,
    }),
  })
    .then(res => res.json())
    .then(changes => console.log(changes))
    .catch(error => console.log({ error }));
}

const sortItems = (e) => {
  const direction = e.target.innerText;
  loadItems(direction);
}

const clearInputs = () => {
  $('.item-name-input').val('');
  $('.item-reason-input').val('');
  $('.cleanliness-dropdown').val('Select a cleanliness...');
  $('.item-name-input').focus();
}

const toggleDoor = () => {
  $('main').toggleClass('garage-open');
}

const toggleDetails = (e) => {
  $(e.target).toggleClass('collapsed');
}

// SETUP
loadItems();

// EVENT LISTENERS
$('.garage-door').on('click', toggleDoor);
$('.sort-buttons').on('click', '.sort-az, .sort-za', sortItems);
$('.new-item-form').on('submit', addItem);
$('.items-display').on('click', '.item-name', toggleDetails)
                   .on('change', '.cleanliness-dropdown', changeCleanliness);
