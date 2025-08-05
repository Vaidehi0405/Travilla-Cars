if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}

// let deferredPrompt;
// window.addEventListener("beforeinstallprompt", (event) => {
//   event.preventDefault();
//   deferredPrompt = event;
//   document.getElementById("install-btn").style.display = "block";
// });

// document.getElementById("install-btn").addEventListener("click", () => {
//   deferredPrompt.prompt();
// });
//--------------------------------------------------------------------------------
// mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile__nav');
// Open Mobile Nav
menuToggle.addEventListener("click", () => {
  mobileMenu.style.transform = "translateX(100%)";
});
// Close Mobile Nav
closeMobileNav.addEventListener("click", () => {
  mobileMenu.style.transform = "translateX(0%)";
});

let activeSubmenu = null;
// Function to toggle submenus
function toggleSubMenu(submenu) {
    if (activeSubmenu && activeSubmenu !== submenu) {
        activeSubmenu.classList.remove("show");
    }
    submenu.classList.toggle("show");
    activeSubmenu = submenu.classList.contains("show") ? submenu : null;
}

const menuButtons = document.querySelectorAll(".menu-btn");


menuButtons.forEach((btn) => {
    const submenu = btn.nextElementSibling;

    btn.addEventListener("click", (e) => {
        if (submenu.classList.contains("show")) {
            submenu.classList.remove("show");
            activeSubmenu = null;
        } else {
            toggleSubMenu(submenu);
        }
    });

    btn.addEventListener("mouseenter", () => {
        if (activeSubmenu && activeSubmenu !== submenu) {
            toggleSubMenu(submenu);
        }
    });
});
document.addEventListener("click", (e) => {
    if (!e.target.closest(".group")) {
        document.querySelectorAll(".submenu").forEach((menu) => {
            menu.classList.remove("show");
        });
        activeSubmenu = null;
    }
});
//--------------------------------------------------------------------------------
let currentSlide = 0;
let sliderData = [];
let slideInterval;
let c= 0;
// Function to fetch slider data from JSON
async function fetchSliderData() {
  try {
    const response = await fetch('slider-data.json');
    const data = await response.json();
    sliderData = data.slides;
    initializeSlider();
  } catch (error) {
    console.error('Error fetching slider data:', error);
  }
}

// Function to show a specific slide
function showSlide(index) {
  const slide = sliderData[index];
  document.getElementById('slider-image').src = slide.image;
  document.getElementById('slider-title').textContent = slide.title;
  document.getElementById('slider-description').textContent = slide.description;
}

// Function to move to the next slide
function nextSlide() {
  currentSlide = (currentSlide + 1) % sliderData.length;
  showSlide(currentSlide);
}

// Function to move to the previous slide
function prevSlide() {
  currentSlide = (currentSlide - 1 + sliderData.length) % sliderData.length;
  showSlide(currentSlide);
}

// Function to initialize the slider
function initializeSlider() {
  showSlide(currentSlide);
  slideInterval = setInterval(nextSlide, 5000); // Change slide every 10 seconds

  // Add event listeners to navigation buttons
  // document.getElementById('prev-btn').addEventListener('click', () => {
  //   clearInterval(slideInterval);
  //   prevSlide();
  //   slideInterval = setInterval(nextSlide, 10000);
  // });

  // document.getElementById('next-btn').addEventListener('click', () => {
  //   clearInterval(slideInterval);
  //   nextSlide();
  //   slideInterval = setInterval(nextSlide, 10000);
  // });
}

// Fetch data and initialize slider when the page loads
document.addEventListener('DOMContentLoaded',function(){
    displayCards();
    fetchSliderData();
    fetchTestimonialsData();
} );
async function fetchCardsData() {
    const data= await fetch('cards.json');
    const response= await data.json();
    return response;
}
async function displayCards() {
    const cardData= await fetchCardsData();
    const cards = document.querySelectorAll('#cards');
    cards.forEach((card)=> {
    card.querySelector('img').src = cardData.cards[c].image;
    card.querySelector('h2').textContent = cardData.cards[c].rating;
    card.querySelector('h2').textContent = cardData.cards[c].title; 
    card.querySelector('span').textContent = cardData.cards[c].location;
    card.querySelector('span').textContent = cardData.cards[c].fuelType;
    card.querySelector('span').textContent = cardData.cards[c].gearType;
    card.querySelector('span').textContent = cardData.cards[c].seats;
    card.querySelector('span').textContent = cardData.cards[c].price;
    c++;
    });
}
//--------------------------------------------------------------------------------
//tab functionality
// Global variable for selected type
let selectedType = "Tours"; // Default active tab

// Tabs functionality
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    // Update the selected tab (type)
    selectedType = this.dataset.type;

    // Manage tab highlighting
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("bg-black", "text-white"));
    this.classList.add("bg-black", "text-white");
  });
});

// Form submission functionality
document.getElementById("hotelSearchForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  // Read input values
  const location = document.getElementById("location").value.trim();
  const guests = parseInt(document.getElementById("guests").value.trim());
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;

  const validationMessage = document.getElementById('validationMessage');

if (!location || isNaN(guests) || guests < 1 || !checkin || !checkout) {
    validationMessage.textContent = "Please fill in all fields correctly.";
    validationMessage.className = 'mt-2 text-sm text-red-500'; // Error styling
    return;
} else {
    validationMessage.textContent = ''; // Clear any previous error message
    // Continue with your form submission logic
}

  fetchAndFilterResults(location,guests);

});
//|| isNaN(guests) || guests < 1 || !checkin || !checkout
// Fetch JSON and filter results
async function fetchAndFilterResults(location,guests) {
  try {
    const response = await fetch("tabs-data.json"); // Fetch JSON file
    const data = await response.json();
  
    // Filter data based on selected type, location, and guests
    const filteredResults = data.filter((item) => item.type.toLowerCase() === selectedType.toLowerCase() &&
      item.location.toLowerCase() === location.toLowerCase()&& item.guests >= guests);
    console.log(filteredResults);
    // Dynamically render results
    displayResults(filteredResults);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    document.getElementById("search-results").innerHTML =
      "<p class='text-red-500'>Failed to fetch data. Please try again later.</p>";
  }
}

// Render filtered results dynamically
function displayResults(results) {
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = ""; // Clear previous results

  if (results.length === 0) {
    resultsContainer.innerHTML = "<p class='text-gray-600 text-center'>No results found.</p>";
    return;
  }

  // Create and append cards for each result
  results.forEach((result) => {
    const card = document.createElement("div");
    card.classList.add('flex-none', 'w-80', 'bg-white', 'rounded-lg', 'shadow-md', 'p-6');

    card.innerHTML = `
      <h3 class="text-lg font-semibold">${result.title}</h3>
      <p><strong>Location:</strong> ${result.location}</p>
      <p><strong>Guests:</strong> ${result.guests}</p>
      <p><strong>Price:</strong> ${result.price}</p>
      <button class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">Book ${selectedType}</button>
    `;

    resultsContainer.appendChild(card);
  });
}
//--------------------------------------------------------------------------------
// FormData
// 
// Tabs functionality and data fetching
// document.addEventListener("DOMContentLoaded", () => {
//   const tabs = document.querySelectorAll(".tab-button");
//   const dynamicContent = document.getElementById("dynamic-content");
//   let activeTab = "tours"; // Default tab

//   // Add click event listeners to all tabs
//   tabs.forEach((tab) => {
//     tab.addEventListener("click", () => {
//       // Remove active states from all tabs
//       tabs.forEach((t) => t.classList.remove("active-tab", "border-blue-500", "text-blue-500"));
//       tab.classList.add("active-tab", "border-blue-500", "text-blue-500");

//       // Update active tab
//       activeTab = tab.id.replace("tab-", "");

//       // Clear content when switching tabs
//       dynamicContent.innerHTML = "<p class='text-gray-400'>Fetching data...</p>";

//       // Load data for the active tab
//       fetchData(activeTab);
//     });
//   });

//   // Handle Search Form Submission
//   const searchForm = document.getElementById("search-form");
//   searchForm.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const location = document.getElementById("location").value;
//     const checkin = document.getElementById("checkin").value;
//     const checkout = document.getElementById("checkout").value;
//     const guests = document.getElementById("guests").value;

//     // Filter data based on form values and active tab
//     fetchData(activeTab, { location, checkin, checkout, guests });
//   });

//   // Fetch Data Function
//   async function fetchData(tab, filters = {}) {
//     try {
//       const response = await fetch("tabs-data.json"); // Replace with the actual path to your JSON file
//       const data = await response.json();

//       const tabData = data[tab]; // Get data based on the active tab

//       // Apply filters (basic implementation, you can extend it based on your needs)
//       const filteredData = tabData.filter((item) => {
//         if (filters.location && item.location && !item.location.toLowerCase().includes(filters.location.toLowerCase())) {
//           return false;
//         }
//         // Additional filtering logic here...
//         return true;
//       });

//       renderData(filteredData, activeTab);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       dynamicContent.innerHTML = "<p class='text-red-500'>Failed to fetch data.</p>";
//     }
//   }

//   // Render Data Function
//   function renderData(data, tab) {
//     dynamicContent.innerHTML = ""; // Clear the content area

//     if (data.length === 0) {
//       dynamicContent.innerHTML = "<p class='text-gray-500'>No matching results found.</p>";
//       return;
//     }

//     data.forEach((item) => {
//       const contentItem = document.createElement("div");
//       contentItem.classList.add("bg-white", "rounded-md", "shadow-md", "p-4", "mb-4");

//       // Render content based on tab type (dynamic rendering)
//       if (tab === "tours") {
//         contentItem.innerHTML = `<h3 class="text-lg font-semibold">${item.title}</h3>
//           <p>Location: ${item.location}</p>
//           <p>Price: $${item.price}</p>
//           <p>Duration: ${item.duration}</p>`;
//       } else if (tab === "hotel") {
//         contentItem.innerHTML = `<h3 class="text-lg font-semibold">${item.name}</h3>
//           <p>Location: ${item.location}</p>
//           <p>Check-In: ${item.checkin}</p>
//           <p>Check-Out: ${item.checkout}</p>
//           <p>Price: $${item.price}</p>`;
//       }
//       // Add rendering logic for "tickets," "rentals," and "activities" similarly...

//       dynamicContent.appendChild(contentItem); // Add to the content container
//     });
//   }

//   // Initial data fetch for default tab
//   fetchData(activeTab);
// });

//--------------------------------------------------------------------------------
// Testimonials data
async function fetchTestimonialsData() {
  // Fetch the data from the JSON source
  const response = await fetch('cards1.json');
  if (!response.ok) {
      throw new Error(`Error fetching testimonials: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

async function displayTestimonials() {
  const data = await fetchTestimonialsData(); // Fetch testimonials data from JSON file

  const testimonialsContainer = document.querySelector('.overflow-x-auto .flex'); // Target the container

  testimonialsContainer.innerHTML = ''; // Clear existing content (optional, if dynamic rendering is needed)

  // Loop through each testimonial in the fetched data
  data.testimonials.forEach(testimonial => {
      // Create a new testimonial card (HTML structure matching your design)
      const testimonialCard = document.createElement('div');
      testimonialCard.classList.add('flex-none', 'w-80', 'bg-white', 'rounded-lg', 'shadow-md', 'p-6'); // Add Tailwind classes

      testimonialCard.innerHTML = `
          <p class="text-gray-600 mb-4">${testimonial.rating}</p>
          <p class="text-sm mb-4">${testimonial.text}</p>
          <div class="flex items-center">
              <img src="${testimonial.image}" alt="${testimonial.name}" class="w-12 h-12 rounded-full object-cover mr-4">
              <div>
                  <p class="font-semibold">${testimonial.name}</p>
                  <p class="text-gray-600">${testimonial.location}</p>
              </div>
          </div>
      `;

      // Append the testimonial card to the container
      testimonialsContainer.appendChild(testimonialCard);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  displayTestimonials(); // Dynamically display testimonials after DOM is fully loaded
});

// --------------------------------------------------------------------------------
// FAQ Section with JSON-Driven Dynamic Content
const faqContainer = document.getElementById('faq-container');

// Fetch FAQs from JSON File
fetch('faqData.json')
  .then((response) => response.json())
  .then((data) => {
    // Loop through FAQ data and create HTML elements
    data.forEach((faq) => {
      const faqItem = document.createElement('div');
      faqItem.classList.add('faq-item', 'border', 'border-gray-200', 'p-4', 'rounded-lg');

      // Create the question container
      const questionContainer = document.createElement('div');
      questionContainer.classList.add('flex', 'justify-between', 'items-center');

      // Add the question heading
      const questionHeading = document.createElement('h3');
      questionHeading.classList.add('text-lg', 'font-semibold');
      questionHeading.innerHTML = `<span class="mr-2 text-gray-500">0${faq.id}</span> ${faq.question}`;
      questionContainer.appendChild(questionHeading);

      // Add the toggle button
      const toggleBtn = document.createElement('a');
      toggleBtn.classList.add('text-gray-500');
      toggleBtn.setAttribute('href', 'javascript:void(0)');
      toggleBtn.textContent = '+'; // Initial "+"
      toggleBtn.dataset.target = `faq-answer-${faq.id}`; // Assign a unique target ID
      questionContainer.appendChild(toggleBtn);

      // Create the answer paragraph
      const answer = document.createElement('p');
      answer.id = `faq-answer-${faq.id}`;
      answer.classList.add('mt-2', 'text-gray-600', 'text-sm');
      answer.style.display = 'none'; // Initially hidden
      answer.textContent = faq.answer;

      // Append question container and answer to FAQ item
      faqItem.appendChild(questionContainer);
      faqItem.appendChild(answer);

      // Append FAQ item to FAQ container
      faqContainer.appendChild(faqItem);

      // Add toggle functionality
      toggleBtn.addEventListener('click', () => {
        if (answer.style.display === 'none') {
          answer.style.display = 'block';
          toggleBtn.textContent = '-'; // Change "+" to "-"
        } else {
          answer.style.display = 'none';
          toggleBtn.textContent = '+'; // Change "-" back to "+"
        }
      });
    });
  })
  .catch((error) => {
    console.error('Error fetching FAQs:', error);
  });

  // --------------------------------------------------------------------------------
//   ChatBot implementation
const chatBtn = document.getElementById("chat-btn");
    const chatContainer = document.getElementById("chat-container");
    const closeChat = document.getElementById("close-chat");
    const chatInput = document.getElementById("chat-input");
    const chatButton = document.getElementById("chat-send");
    const chatBox = document.getElementById("chat-box");

    // Toggle Chat Window
    chatBtn.addEventListener("click", () => {
      chatContainer.classList.toggle("hidden");
    });

    closeChat.addEventListener("click", () => {
      chatContainer.classList.add("hidden");
    });

    // Send Message
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        chatButton.click();
      }
    });

    chatButton.addEventListener("click", async () => {
      const userMessage = chatInput.value.trim();
      if (!userMessage) return;

      appendMessage("user", userMessage); // User's message
      chatInput.value = ""; // Clear input

      const botReply = await fetchAIResponse(userMessage); // Get bot response
      appendMessage("bot", botReply); // Bot's response
    });

    async function fetchAIResponse(message) {
      const API_KEY = "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"; // Replace with your actual API key

      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a travel assistant. You only provide responses related to travel, such as hotel bookings, car rentals, places to visit, and things to do. If the query is unrelated to travel, politely decline." },
              { role: "user", content: message }
            ]
          })
        });

        const data = await response.json();
        if (data.error) {
          return `Error: ${data.error.message}`;
        }

        return data.choices?.[0]?.message?.content || "No response received.";
      } catch (error) {
        return "An error occurred while fetching the response.";
      }
    }

    // Append Message to Chat
    function appendMessage(sender, text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `my-2 py-2 px-3 rounded-lg ${
          sender === "user" 
            ? "bg-blue-500 text-white self-end" 
            : "bg-gray-300 text-black self-start"
        }`;
        msgDiv.textContent = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
      }

// --------------------------------------------------------------------------------
// fetching services
async function fetchServicesData() {
  const response = await fetch('./services.json'); // Path to your JSON file
  return response.json();
}

async function displayServices() {
  const serviceData = await fetchServicesData(); // Assume service data is fetched here
  const gridContainer = document.querySelector('.grid1'); // Select the grid container
  
  console.log(serviceData);
  console.log("Our services showed")
  // Dynamically append each card to the grid
  serviceData.services.forEach((service) => {
    const cardHTML = `
      <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg w-80 ">
        <!-- Service Image -->
        <img src="${service.image}" alt="${service.title}" class="w-full h-58 object-cover">
        <!-- Service Details -->
        <div class="p-4">
          <h3 class="font-semibold text-lg mb-2 transition duration-300 ease-in-out hover:text-gray-600">${service.title}</h3>
          <p class="text-gray-600">${service.serviceCount} services</p>
        </div>
      </div>
    `;

    gridContainer.innerHTML += cardHTML; // Append dynamically made cards
  });
}

displayServices(); // Call the function to display cards


// async function fetchServicesData() {
//   const response = await fetch('./services.json'); // Path to your JSON file
//   return response.json();
// }

// async function displayServices() {
//   const serviceData = await fetchServicesData();
//   const gridContainer = document.querySelector('.grid1'); // Select the grid container
//   console.log(serviceData);
//   console.log("Our services showed");

//   // Dynamically append each card to the grid
//   serviceData.services.forEach((service) => {
//     const cardHTML = `
//       <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg w-80">
//         <!-- Service Image -->
//         <img src="${service.image}" alt="${service.title}" class="w-full h-58 object-cover">
//         <!-- Service Details -->
//         <div class="p-4">
//           <h3 class="font-semibold text-lg mb-2 transition duration-300 ease-in-out hover:text-gray-600">${service.title}</h3>
//           <p class="text-gray-600">${service.serviceCount} services</p>
//         </div>
//       </div>
//     `;
    
//     gridContainer.innerHTML += cardHTML; // Append dynamically made cards
//   });
// }

// displayServices();




//--------------------------------------------------------------------------------
// Get form and its elements
const newsletterForm = document.getElementById('newsletterForm');
const newsletterEmail = document.getElementById('newsletterEmail');
const newsletterMessage = document.getElementById('newsletterMessage');

// Add submit event listener to the form
newsletterForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the page from refreshing on form submit

  // Validate email
  const emailValue = newsletterEmail.value.trim();
  if (isValidEmail(emailValue)) {
    // Success: Show a success message and reset the input
    newsletterMessage.textContent = 'Thank you for subscribing to our newsletter!';
    newsletterMessage.className = 'text-green-500 text-sm mt-3';
    newsletterEmail.value = ''; // Clear input
  } else {
    // Error: Show an error message
    newsletterMessage.textContent = 'Please enter a valid email address.';
    newsletterMessage.className = 'text-red-500 text-sm mt-3';
  }
});

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email pattern
  return emailRegex.test(email);
}

