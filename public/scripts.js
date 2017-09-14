// SETUP

// FUNCTIONS
const toggleDoor = () => {
  $('.garage-door').toggleClass('garage-open');
}

// EVENT LISTENERS
$('.garage-door').on('click', toggleDoor);

