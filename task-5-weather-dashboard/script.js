// ---- weather code -> icon + label (Open-Meteo WMO codes) ----
const WEATHER_CODES = {
  0: { icon: '☀️', label: 'Clear sky' },
  1: { icon: '🌤️', label: 'Mainly clear' },
  2: { icon: '⛅', label: 'Partly cloudy' },
  3: { icon: '☁️', label: 'Overcast' },
  45: { icon: '🌫️', label: 'Fog' },
  48: { icon: '🌫️', label: 'Depositing fog' },
  51: { icon: '🌦️', label: 'Light drizzle' },
  53: { icon: '🌦️', label: 'Drizzle' },
  55: { icon: '🌧️', label: 'Dense drizzle' },
  61: { icon: '🌧️', label: 'Light rain' },
  63: { icon: '🌧️', label: 'Rain' },
  65: { icon: '🌧️', label: 'Heavy rain' },
  71: { icon: '🌨️', label: 'Light snow' },
  73: { icon: '🌨️', label: 'Snow' },
  75: { icon: '❄️', label: 'Heavy snow' },
  80: { icon: '🌧️', label: 'Rain showers' },
  95: { icon: '⛈️', label: 'Thunderstorm' },
  96: { icon: '⛈️', label: 'Thunderstorm w/ hail' }
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { icon: '🌡️', label: 'Unknown' };
}

// ---- element references ----
const form = document.querySelector('#search-form');
const cityInput = document.querySelector('#city');

const loadingEl = document.querySelector('#loading');
const errorEl = document.querySelector('#error');
const errorText = document.querySelector('#error-text');
const currentWeatherEl = document.querySelector('#current-weather');
const forecastEl = document.querySelector('#forecast');

// ---- UI state helpers: only one state visible at a time ----
function showLoading() {
  loadingEl.classList.remove('is-hidden');
  errorEl.classList.add('is-hidden');
  currentWeatherEl.classList.add('is-hidden');
  forecastEl.classList.add('is-hidden');
}

function showError(message) {
  errorText.textContent = message;
  errorEl.classList.remove('is-hidden');
  loadingEl.classList.add('is-hidden');
  currentWeatherEl.classList.add('is-hidden');
  forecastEl.classList.add('is-hidden');
}

function showResults() {
  loadingEl.classList.add('is-hidden');
  errorEl.classList.add('is-hidden');
  currentWeatherEl.classList.remove('is-hidden');
  forecastEl.classList.remove('is-hidden');
}

// ---- form submit ----
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const city = cityInput.value.trim();
  if (!city) {
    showError('Please enter a city name.');
    return;
  }

  showLoading();

  try {
    // step 1: turn city name into coordinates
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );

    if (!geoRes.ok) {
      throw new Error('Location lookup failed. Try again in a moment.');
    }

    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`Couldn't find "${city}". Check the spelling and try again.`);
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // step 2: fetch current weather + 4-day forecast (today + next 3 days)
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current_weather=true` +
      `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
      `&forecast_days=4&timezone=auto`
    );

    if (!weatherRes.ok) {
      throw new Error('Weather service is unavailable right now.');
    }

    const weatherData = await weatherRes.json();

    renderCurrent(weatherData, `${name}, ${country}`);
    renderForecast(weatherData);
    showResults();

  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
  }
});

// ---- render current weather ----
function renderCurrent(data, locationLabel) {
  const info = getWeatherInfo(data.current_weather.weathercode);

  document.querySelector('#current-city').textContent = locationLabel;
  document.querySelector('#current-icon').textContent = info.icon;
  document.querySelector('#current-temp').textContent = Math.round(data.current_weather.temperature);
  document.querySelector('#current-condition').textContent = info.label;
}

// ---- render 3-day forecast (skip index 0, which is today) ----
function renderForecast(data) {
  forecastEl.innerHTML = '';

  const days = data.daily.time;
  const maxTemps = data.daily.temperature_2m_max;
  const minTemps = data.daily.temperature_2m_min;
  const codes = data.daily.weathercode;

  for (let i = 1; i < days.length; i++) {
    const info = getWeatherInfo(codes[i]);
    const dayLabel = new Date(days[i]).toLocaleDateString('en-US', { weekday: 'short' });

    const card = document.createElement('div');
    card.className = 'forecast-day';

    const label = document.createElement('p');
    label.className = 'forecast-day__label';
    label.textContent = dayLabel;

    const icon = document.createElement('p');
    icon.className = 'forecast-day__icon';
    icon.textContent = info.icon;

    const temps = document.createElement('p');
    temps.className = 'forecast-day__temps';
    temps.innerHTML = `${Math.round(maxTemps[i])}° <span>${Math.round(minTemps[i])}°</span>`;

    card.appendChild(label);
    card.appendChild(icon);
    card.appendChild(temps);
    forecastEl.appendChild(card);
  }
}
