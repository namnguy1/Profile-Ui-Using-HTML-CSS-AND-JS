// Function to display profiles based on the current page
function displayProfiles(pageNumber, profilesPerPage, profiles) {
    const startIndex = (pageNumber - 1) * profilesPerPage;
    const endIndex = startIndex + profilesPerPage;
    const currentPageProfiles = profiles.slice(startIndex, endIndex);

    // Select the card wrapper element
    const cardWrapper = document.querySelector('.card-wrapper');
    cardWrapper.innerHTML = ''; // Clear previous content

    // Loop through profiles for the current page
    currentPageProfiles.forEach(user => {
        // Create card HTML dynamically
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
        
        // Append the card HTML to the card wrapper
        cardWrapper.innerHTML += cardHTML;
    });

    // Initialize Swiper after adding cards dynamically
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

// Fetch data from the endpoint
fetch('https://ms-hop.azurewebsites.net/api/users')
    .then(response => response.json())
    .then(data => {
        const profiles = data; // Store profiles data
        const profilesPerPage = 10; // Number of profiles per page
        const totalPages = Math.ceil(profiles.length / profilesPerPage); // Calculate total pages

        // Display initial page (page 1)
        displayProfiles(1, profilesPerPage, profiles);

        // Function to handle pagination clicks
        function handlePaginationClick(event) {
            const pageNumber = parseInt(event.target.dataset.page);
            displayProfiles(pageNumber, profilesPerPage, profiles);
            updatePaginationButtons(pageNumber, totalPages);
        }

        // Function to update pagination buttons
        function updatePaginationButtons(currentPage, totalPages) {
            const paginationContainer = document.querySelector('.pagination-container');
            paginationContainer.innerHTML = ''; // Clear previous buttons

            // Previous button
            const prevButton = document.createElement('button');
            prevButton.innerHTML = '&lt;';
            prevButton.classList.add('pagination-button');
            prevButton.classList.toggle('disabled', currentPage === 1);
            prevButton.dataset.page = currentPage - 1;
            prevButton.addEventListener('click', handlePaginationClick);
            paginationContainer.appendChild(prevButton);

            // Page number buttons
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

            // Next button
            const nextButton = document.createElement('button');
            nextButton.innerHTML = '&gt;';
            nextButton.classList.add('pagination-button');
            nextButton.classList.toggle('disabled', currentPage === totalPages);
            nextButton.dataset.page = currentPage + 1;
            nextButton.addEventListener('click', handlePaginationClick);
            paginationContainer.appendChild(nextButton);
        }

        // Initialize pagination buttons for the first time
        updatePaginationButtons(1, totalPages);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
