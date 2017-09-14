// SETUP

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
  const name = $('.item-name').val();
  const reason = $('.item-reason').val();
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
    .then(item => console.log(item))
    .catch(error => console.log({ error }));
}

const clearInputs = () => {
  $('.item-name').val('');
  $('.item-reason').val('');
  $('.cleanliness-dropdown').val('Select a cleanliness...');
  $('.item-name').focus();
}

// EVENT LISTENERS
$('.garage-door').on('click', toggleDoor);
$('.new-item-form').on('submit', addItem);
