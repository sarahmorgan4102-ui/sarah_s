// 1. Mobile Menu Toggle
const menu = document.getElementById('mobile-menu');
const nav = document.getElementById('nav');
menu.addEventListener('click', () => {
  nav.classList.toggle('active');
  document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});

// 2. Scroll Progress Bar
window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById("scroll-progress").style.width = scrolled + "%";
});

// 3. Smooth Scroll Helper
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// 4. Scroll Reveal Observer
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('reveal-active');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(s => observer.observe(s));

// 5. Booking Form - WhatsApp Redirection
// const bookingForm = document.getElementById('booking-form');
// if (bookingForm) {
//   bookingForm.addEventListener('submit', function(e) {
//     e.preventDefault();
    
//     const name = document.getElementById('user-name').value;
//     const duration = document.getElementById('user-duration').value;
//     const service = document.getElementById('user-service').value;
//     const message = document.getElementById('user-message').value;
    
//     const text = `NEW VIP REQUEST\n\nName: ${name}\nDuration: ${duration}\nService: ${service}\nMessage: ${message}\n\nI confirm I have read the VIP Terms and agree to the 50% deposit.`;
    
//     const encodedText = encodeURIComponent(text);
//     window.open(`https://wa.me/14405902894?text=${encodedText}`, '_blank');
//   });
// }

document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const reviewsGrid = document.getElementById('reviews-grid');

    // Load extra reviews from LocalStorage
    const savedReviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    savedReviews.forEach(rev => displayReview(rev));

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameValue = document.getElementById('reviewer-name').value;
        const textValue = document.getElementById('reviewer-text').value;
        const ratingValue = document.getElementById('reviewer-rating').value;
        
        // Auto-generate initials (e.g., "Daniel Kane" -> "DK")
        const initials = nameValue.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

        const newReview = {
            name: nameValue,
            initials: initials,
            rating: ratingValue,
            text: textValue
            // Date logic removed to meet client request
        };

        // Add to the grid
        displayReview(newReview);

        // Save to browser memory
        savedReviews.push(newReview);
        localStorage.setItem('userReviews', JSON.stringify(savedReviews));

        // Reset and notify
        reviewForm.reset();
        alert("Thank you! Your experience has been shared.");
    });

    function displayReview(data) {
        const starString = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);
        const card = document.createElement('div');
        card.className = 'review-card newly-added';
        
        const colors = ['#5a4a75', '#4a6fa5', '#6b8e23', '#a54a4a', '#d4af37'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Updated HTML: removed the <span class="review-date"> line
        card.innerHTML = `
            <div class="review-header">
              <div class="avatar" style="background: ${randomColor}">${data.initials}</div>
              <div class="reviewer-info">
                <div class="name-row">
                  <span class="reviewer-name">${data.name}</span>
                  <div class="stars">${starString}</div>
                </div>
              </div>
            </div>
            <p>“${data.text}”</p>
        `;
        // Insert new reviews at the top of the grid
        reviewsGrid.prepend(card);
    }
});


// Booking Form - AJAX Submission to Formspree
const form = document.getElementById("booking-form");
const status = document.getElementById("form-status");
const btn = document.getElementById("submit-btn");

async function handleSubmit(event) {
  event.preventDefault();
  btn.innerHTML = "Sending...";
  btn.disabled = true;

  const data = new FormData(event.target);
  
  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: {
        'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      status.style.display = "block";
      btn.innerHTML = "Sent Successfully";
      form.reset();
      // Auto-hide status after 7 seconds
      setTimeout(() => { status.style.display = "none"; }, 7000);
    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
          btn.innerHTML = data["errors"].map(error => error["message"]).join(", ");
        } else {
          btn.innerHTML = "Error Occurred";
        }
      });
      btn.disabled = false;
    }
  }).catch(error => {
    btn.innerHTML = "Connection Error";
    btn.disabled = false;
  });
}

form.addEventListener("submit", handleSubmit);