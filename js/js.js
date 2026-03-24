// Initialize Swiper slider
document.addEventListener('DOMContentLoaded', function() {
    // Initialize featured books slider
    const featuredSlider = new Swiper('.featured-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1400: { slidesPerView: 4 }
        }
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            navLinks.classList.remove('active');
        }
    });
    
    // Book buying functionality
    const buyButtons = document.querySelectorAll('.btn-buy');
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookTitle = this.closest('.book-card').querySelector('.book-title').textContent;
            const price = this.getAttribute('data-price');
            
            // Add to cart logic
            addToCart(bookTitle, price);
            
            // Show notification
            showNotification(`Added "${bookTitle}" to cart!`, 'success');
        });
    });
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookTitle = this.closest('.book-item').querySelector('h4').textContent;
            const price = this.closest('.book-item').querySelector('.price').textContent;
            
            addToCart(bookTitle, price);
            showNotification(`Added "${bookTitle}" to cart!`, 'success');
            
            // Update cart badge
            updateCartBadge(1);
        });
    });
    
    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.btn-wishlist');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#ef4444';
                showNotification('Added to wishlist!', 'success');
                
                // Update wishlist badge
                const wishlistBadge = document.querySelector('.nav-links a[href="#wishlist"] .badge');
                if (wishlistBadge) {
                    let count = parseInt(wishlistBadge.textContent);
                    wishlistBadge.textContent = count + 1;
                }
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '#4a5568';
                showNotification('Removed from wishlist', 'info');
                
                // Update wishlist badge
                const wishlistBadge = document.querySelector('.nav-links a[href="#wishlist"] .badge');
                if (wishlistBadge) {
                    let count = parseInt(wishlistBadge.textContent);
                    wishlistBadge.textContent = Math.max(0, count - 1);
                }
            }
        });
    });
    
    // Cart functionality
    const cartItems = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    
    // Remove item from cart
    cartItems.addEventListener('click', function(e) {
        if (e.target.closest('.btn-remove')) {
            const cartItem = e.target.closest('.cart-item');
            cartItem.remove();
            updateCartTotal();
            updateCartBadge(-1);
            showNotification('Item removed from cart', 'info');
        }
    });
    
    // Update quantity
    cartItems.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-quantity')) {
            const quantityElement = e.target.parentElement.querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (e.target.classList.contains('minus')) {
                if (quantity > 1) {
                    quantityElement.textContent = quantity - 1;
                }
            } else if (e.target.classList.contains('plus')) {
                quantityElement.textContent = quantity + 1;
            }
            
            updateCartTotal();
        }
    });
    
    // Reader functionality
    const readerContent = document.querySelector('.reader-content');
    const fontMinusBtn = document.querySelector('.reader-btn:nth-child(1)');
    const fontPlusBtn = document.querySelector('.reader-btn:nth-child(3)');
    const fontSizeDisplay = document.querySelector('.font-size');
    const themeSelect = document.querySelector('.theme-select');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const pageInfo = document.querySelector('.page-info');
    
    let currentPage = 1;
    const totalPages = 352;
    
    // Font size controls
    fontMinusBtn.addEventListener('click', function() {
        changeFontSize(-1);
    });
    
    fontPlusBtn.addEventListener('click', function() {
        changeFontSize(1);
    });
    
    // Theme selection
    themeSelect.addEventListener('change', function() {
        const theme = this.value;
        readerContent.style.backgroundColor = theme === 'dark' ? '#1a202c' : 
                                           theme === 'sepia' ? '#f7f0e0' : '#f8fafc';
        readerContent.style.color = theme === 'dark' ? '#cbd5e0' : '#333';
    });
    
    // Page navigation
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePageDisplay();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePageDisplay();
        }
    });
    
    // Read sample functionality
    const readButtons = document.querySelectorAll('.btn-read');
    readButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookTitle = this.closest('.book-card').querySelector('.book-title').textContent;
            document.querySelector('#reading').scrollIntoView({ behavior: 'smooth' });
            showNotification(`Now reading sample from "${bookTitle}"`, 'info');
        });
    });
    
    // Checkout button
    const checkoutBtn = document.querySelector('.btn-checkout');
    checkoutBtn.addEventListener('click', function() {
        if (document.querySelectorAll('.cart-item').length === 0) {
            showNotification('Your cart is empty!', 'error');
        } else {
            showNotification('Proceeding to checkout...', 'success');
            // In a real app, this would redirect to checkout page
        }
    });
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        if (email && validateEmail(email)) {
            showNotification('Subscribed to newsletter!', 'success');
            this.querySelector('input').value = '';
        } else {
            showNotification('Please enter a valid email', 'error');
        }
    });
    
    // Helper Functions
    function addToCart(title, price) {
        // In a real app, this would make an API call
        console.log(`Added to cart: ${title} - ${price}`);
    }
    
    function updateCartTotal() {
        let subtotal = 0;
        const cartItems = document.querySelectorAll('.cart-item');
        
        cartItems.forEach(item => {
            const price = parseFloat(item.querySelector('.cart-item-price').textContent.replace('$', ''));
            const quantity = parseInt(item.querySelector('.quantity').textContent);
            subtotal += price * quantity;
        });
        
        const shipping = 5.99;
        const total = subtotal + shipping;
        
        // Update summary
        document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.summary-row:nth-child(3) span:last-child').textContent = `$${total.toFixed(2)}`;
    }
    
    function updateCartBadge(change) {
        const cartBadge = document.querySelector('.nav-links a[href="#cart"] .badge');
        if (cartBadge) {
            let count = parseInt(cartBadge.textContent);
            count = Math.max(0, count + change);
            cartBadge.textContent = count;
        }
    }
    
    function changeFontSize(change) {
        const currentSize = parseInt(window.getComputedStyle(readerContent).fontSize);
        const newSize = Math.max(12, Math.min(24, currentSize + change));
        readerContent.style.fontSize = `${newSize}px`;
        fontSizeDisplay.textContent = `Font Size: ${newSize}px`;
    }
    
    function updatePageDisplay() {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        
        // Update reader content based on page (simulated)
        const pageContent = [
            "Chapter 1: The Beginning",
            "Chapter 2: The Mystery Deepens",
            "Chapter 3: A New Discovery",
            "Chapter 4: The Turning Point"
        ];
        
        const currentChapter = Math.min(Math.ceil(currentPage / (totalPages / 4)), 4);
        document.querySelector('.reader-page h3').textContent = pageContent[currentChapter - 1];
    }
    
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                               type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : 
                         type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Initialize cart total
    updateCartTotal();
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            showNotification(`Searching for "${query}"...`, 'info');
            // In a real app, this would trigger search results
        }
    }
    
    // Book modal functionality
    const quickViewBtns = document.querySelectorAll('.book-quick-view');
    const modal = document.querySelector('#bookModal');
    const closeModal = document.querySelector('.close-modal');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookCard = this.closest('.book-card');
            const bookTitle = bookCard.querySelector('.book-title').textContent;
            const bookAuthor = bookCard.querySelector('.book-author').textContent;
            const bookRating = bookCard.querySelector('.rating-score').textContent;
            const bookPrice = bookCard.querySelector('.btn-buy').getAttribute('data-price');
            
            const modalContent = `
                <div class="modal-book-view">
                    <div class="modal-book-cover">
                        <img src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="${bookTitle}">
                    </div>
                    <div class="modal-book-info">
                        <h2>${bookTitle}</h2>
                        <p class="modal-author">${bookAuthor}</p>
                        <div class="modal-rating">
                            ${'<i class="fas fa-star"></i>'.repeat(4)}<i class="fas fa-star-half-alt"></i>
                            <span>${bookRating}/5.0</span>
                        </div>
                        <div class="modal-price">$${bookPrice}</div>
                        <p class="modal-description">
                            A captivating novel that takes you on an unforgettable journey. 
                            Filled with rich characters and unexpected twists, this book will 
                            keep you reading late into the night.
                        </p>
                        <div class="modal-actions">
                            <button class="btn-read"><i class="fas fa-book-open"></i> Read Sample</button>
                            <button class="btn-buy" data-price="${bookPrice}">Add to Cart</button>
                            <button class="btn-wishlist"><i class="far fa-heart"></i> Wishlist</button>
                        </div>
                        <div class="modal-details">
                            <div class="detail">
                                <span>Pages:</span>
                                <span>352</span>
                            </div>
                            <div class="detail">
                                <span>Published:</span>
                                <span>2023</span>
                            </div>
                            <div class="detail">
                                <span>Genre:</span>
                                <span>Fiction, Mystery</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.querySelector('.modal-book-details').innerHTML = modalContent;
            modal.style.display = 'flex';
            
            // Add event listeners to modal buttons
            setTimeout(() => {
                const modalBuyBtn = modal.querySelector('.btn-buy');
                const modalWishlistBtn = modal.querySelector('.btn-wishlist');
                
                if (modalBuyBtn) {
                    modalBuyBtn.addEventListener('click', function() {
                        addToCart(bookTitle, bookPrice);
                        showNotification(`Added "${bookTitle}" to cart!`, 'success');
                        updateCartBadge(1);
                    });
                }
                
                if (modalWishlistBtn) {
                    modalWishlistBtn.addEventListener('click', function() {
                        const icon = this.querySelector('i');
                        if (icon.classList.contains('far')) {
                            icon.classList.remove('far');
                            icon.classList.add('fas');
                            showNotification('Added to wishlist!', 'success');
                        } else {
                            icon.classList.remove('fas');
                            icon.classList.add('far');
                            showNotification('Removed from wishlist', 'info');
                        }
                    });
                }
            }, 100);
        });
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Category cards interaction
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            showNotification(`Browsing ${category} books...`, 'info');
            // In a real app, this would filter books by category
        });
    });
    
    // Initialize page display
    updatePageDisplay();
});