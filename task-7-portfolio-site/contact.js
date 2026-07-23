const form = document.querySelector('#contact-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');

const nameError = document.querySelector('#name-error');
const emailError = document.querySelector('#email-error');
const messageError = document.querySelector('#message-error');
const successMessage = document.querySelector('#success-message');

function isValidEmail(value) {
  // simple, good-enough client-side check — not meant to replace server-side validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  let isValid = true;
  nameError.textContent = '';
  emailError.textContent = '';
  messageError.textContent = '';
  successMessage.classList.add('is-hidden');

  if (nameInput.value.trim() === '') {
    nameError.textContent = 'Please enter your name.';
    isValid = false;
  }

  if (emailInput.value.trim() === '') {
    emailError.textContent = 'Please enter your email.';
    isValid = false;
  } else if (!isValidEmail(emailInput.value.trim())) {
    emailError.textContent = 'Please enter a valid email address.';
    isValid = false;
  }

  if (messageInput.value.trim() === '') {
    messageError.textContent = 'Please write a message.';
    isValid = false;
  }

  if (!isValid) return;

  // no backend for this task — just confirm the form worked
  successMessage.classList.remove('is-hidden');
  form.reset();
});
