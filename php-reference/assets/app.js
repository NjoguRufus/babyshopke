// Baby Shop KE - Minimal JS
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for "Shop Now" button
    document.querySelectorAll('a[href="#products"]').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.getElementById('products');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
