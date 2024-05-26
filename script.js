
function displayProfiles(pageNumber, profilesPerPage, profiles) {
    const startIndex = (pageNumber - 1) * profilesPerPage;
    const endIndex = startIndex + profilesPerPage;
    const currentPageProfiles = profiles.slice(startIndex, endIndex);


    const cardWrapper = document.querySelector('.card-wrapper');
    cardWrapper.innerHTML = ''; 


    currentPageProfiles.forEach(user => {

        const cardHTML = `
            <div class="card swiper-slide">
                <div class="image-content">
                    <span class="overlay"></span>
                    <div class="card-image">
                        <img width="100%" height="100%" src="${user.avatar}" alt="" class="card-img" />
                    </div>
                </div>
                <div class="card-content">
                    <h2 class="name">${user.first_name} ${user.last_name}</h2>
                    <p class="email">📧: ${user.email}</p>
                    <p class="description">${user.bio}</p>
                    <button class="button">View more</button>
                </div>
            </div>
        `;

        cardWrapper.innerHTML += cardHTML;
        const profileCount = document.querySelector('.slide-number');
        profileCount.textContent = `${profiles.length} people`;
    });

  
    var swiper = new Swiper(".slide-content", {
        slidesPerView: 3,
        spaceBetween: 25,
        centerSlide: true,
        grabCursor: true,
        // loop: true,
        // pagination: {
        //     el: ".swiper-pagination",
        //     clickable: true,
        //     dynamicBullets: true,
        // },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            520: {
                slidesPerView: 2,
            },
            950: {
                slidesPerView: 3,
            }
        }
    });
}
function searchProfiles(query, profiles) {
    query = query.toLowerCase();
    return profiles.filter(profile =>
        profile.first_name.toLowerCase().includes(query) ||
        profile.last_name.toLowerCase().includes(query)
    );
}


fetch('https://ms-hop.azurewebsites.net/api/users')
    .then(response => response.json())
    .then(data => {
        const profiles = data; 
        const profilesPerPage = 10; 
        const totalPages = Math.ceil(profiles.length / profilesPerPage); 


        displayProfiles(1, profilesPerPage, profiles);

        function handlePaginationClick(event) {
            console.log('event: ', event);
            const pageNumber = parseInt(event.target.dataset.page);

            displayProfiles(pageNumber, profilesPerPage, profiles);
            updatePaginationButtons(pageNumber, totalPages);
        }

  
        function updatePaginationButtons(currentPage, totalPages) {
            const paginationContainer = document.querySelector('.pagination-container');
            paginationContainer.innerHTML = '';


            const prevButton = document.createElement('button');
            prevButton.innerHTML = '&lt;';
            prevButton.classList.add('pagination-button');
            prevButton.classList.toggle('disabled', currentPage === 1);
            prevButton.dataset.page = currentPage - 1;
            prevButton.addEventListener('click', handlePaginationClick);
            paginationContainer.appendChild(prevButton);


            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                button.dataset.page = i;
                button.classList.add('pagination-button');
                if (i === currentPage) {
                    button.classList.add('active');
                }
                button.addEventListener('click', handlePaginationClick);
                paginationContainer.appendChild(button);
            }


            const nextButton = document.createElement('button');
            nextButton.innerHTML = '&gt;';
            nextButton.classList.add('pagination-button');
            nextButton.classList.toggle('disabled', currentPage === totalPages);
            nextButton.dataset.page = currentPage + 1;
            nextButton.addEventListener('click', handlePaginationClick);
            paginationContainer.appendChild(nextButton);
        }


        updatePaginationButtons(1, totalPages);
        const searchInput = document.querySelector('.search-input');
        searchInput.addEventListener('input', event => {
            const query = event.target.value;
            const filteredProfiles = searchProfiles(query, profiles);
            console.log('filteredProfiles: ', filteredProfiles);
            const filteredTotalPages = Math.ceil(filteredProfiles.length / profilesPerPage);


            displayProfiles(1, profilesPerPage, filteredProfiles);
            updatePaginationButtons(1, filteredTotalPages);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });