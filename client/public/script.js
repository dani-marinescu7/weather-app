const rootElement = document.getElementById('root');
const body = document.querySelector('body');

const loadEvent = function() {

    rootElement.insertAdjacentHTML('beforeend' ,`<div id="input">
    <label for="city-choice">Choose a city:</label>
    <input list="cities" id="city-choice" name="city-choice">
    <datalist class="list" id="cities"></datalist>
    </div>`);

    const input = document.getElementById('city-choice');
    const cityList = document.getElementById('cities');
    let favoriteCities = [];

    rootElement.insertAdjacentHTML('beforeend', `<div hidden id="spinner"></div>`);
    const spinner = document.getElementById("spinner");

    function loadData() {
        spinner.removeAttribute('hidden');
    }
    
    input.addEventListener('input', (event) => {
        console.log(event.target.value)
        if (event.target.value.length === 0 && favoriteCities.length > 0) {
            cityList.innerHTML = '';
            favoriteCities.map(city => {
                const option = document.createElement('option');
                option.value = city;
                option.onclick = loadData();
                cityList.appendChild(option);
            })
        } 
        if (event.target.value.length > 2) {
            cityList.innerHTML = '';
            const cityUrl = 'http://api.weatherapi.com/v1/search.json?key=890b12460e12477f96d113850231202&q=' + event.target.value;
            fetch(cityUrl)
                .then((response) => response.json())
                .then((data) => {
                    data.map(city => {
                        if (city.name.includes(event.target.value) || city.name.toLowerCase().includes(event.target.value)) {
                            cityList.innerHTML = '';
                            const option = document.createElement('option');
                            option.value = city.name;
                            option.onclick = loadData();
                            cityList.appendChild(option);
                        }
                    });
                    if (data.filter(city => city.name === event.target.value).length > 0) {
                        const wearherUrl = 'http://api.weatherapi.com/v1/current.json?key=890b12460e12477f96d113850231202&q=' + event.target.value;
                        fetch(wearherUrl)
                            .then((response) => response.json())
                            .then((data) => {
                                const widget = `<div class="container">
                                <div class="widget">
                                  <div class="details">
                                    <div class="temperature">${data.current.temp_c}°</div>
                                    <div class="summary">
                                      <p class="summaryText">${data.current.condition.text}</p>
                                      <button class="favorite_city" type="button">${favoriteCities.includes(data.location.name) ? '★' : '☆'}</button>
                                    </div>
                                    <div class="precipitation">Humidity: ${data.current.humidity}%</div>
                                    <div class="wind">Wind: ${data.current.wind_kph} km/h</div>
                                    <div class="location">${data.location.name}, ${data.location.country}</div>
                                  </div>
                                  <div class="pictoBackdrop"></div>
                                  <div class="pictoFrame"></div>
                                  <div class="pictoCloudBig"></div>
                                  <div class="pictoCloudFill"></div>
                                  <div class="pictoCloudSmall"></div>
                                  <div class="iconCloudBig"></div>
                                  <div class="iconCloudFill"></div>
                                  <div class="iconCloudSmall"></div>
                                  </div>
                                </div>`;
                                //spinner.setAttribute('hidden', '');
                                rootElement.childElementCount === 1 ? rootElement.insertAdjacentHTML('beforeend', widget) : rootElement.removeChild(rootElement.children[1]) && rootElement.insertAdjacentHTML('beforeend', widget);
                                const favButton = document.querySelector('button')
                                favButton.addEventListener('click', () => {
                                    if (favoriteCities.includes(data.location.name)) {
                                        var isAdded = true;
                                    } else {
                                        isAdded = false;
                                    }
                                    if (isAdded) {
                                        let i = favoriteCities.indexOf(data.location.name)
                                        favoriteCities.splice(i, 1)
                                        favButton.innerHTML = '☆';
                                        isAdded = false;
                                    } else {
                                        favoriteCities.push(data.location.name)
                                        favButton.innerHTML = '★';
                                        isAdded = true;
                                    }
                                });
                                fetch('https://api.pexels.com/v1/search?&&query=' + event.target.value, {
                                    headers: {
                                        Authorization: 'vokZK1d895UfAtMFtiAktnYmth1Za7kExBxESNjFJ4Amc7cCalAZWaKM'
                                    }
                                })
                                    .then((response) => response.json())
                                    .then((data) => body.style.backgroundImage = "url('" + data.photos[Math.floor(Math.random() * data.photos.length)].src.large +"')");
                            });
                    }
                });
        }
    });
}
  
window.addEventListener("load", loadEvent);