document.querySelectorAll('.truncate-text').forEach(item => {
    item.addEventListener('mouseenter', () => {
        // First, remove the expanded class from all items
        document.querySelectorAll('.truncate-text').forEach(text => {
            text.classList.remove('expanded');
        });

        // Then, add the expanded class to the currently hovered item
        item.classList.add('expanded');
    });

    item.addEventListener('mouseleave', () => {
        item.classList.remove('expanded'); // Remove the expanded class on mouse leave
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const testimonialsContainer = document.getElementById("testimonials");

    // Select all elements with class 'col-md-12'
    const testimonials = testimonialsContainer.querySelectorAll('.col-md-12');

    testimonials.forEach(testimonial => {
        // Clone the current testimonial
        const clonedTestimonial = testimonial.cloneNode(true);

        // Append the cloned testimonial to the same column
        testimonial.parentElement.appendChild(clonedTestimonial);
    });
});




