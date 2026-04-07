// js/script.js

// Глобальные функции для модальных окон
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== ТЕМНАЯ ТЕМА ====================
    const themeToggle = document.createElement('button');
    themeToggle.className = 'nes-btn theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.setAttribute('aria-label', 'Переключить тему');
    document.body.appendChild(themeToggle);
    
    // Проверка сохраненной темы
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '☀️';
    }
    
    // Переключение темы
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.innerHTML = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // ==================== LAZY LOADING ====================
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback для старых браузеров
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        });
    }
    
    // ==================== БУРГЕР-МЕНЮ ====================
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            
            // Анимация бургера в крестик
            const spans = menuToggle.querySelectorAll('span');
            if (navList.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Закрытие меню при клике на ссылку (мобильные)
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 767) {
                navList.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
    
    // Валидация всех форм на сайте
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput) {
                const email = emailInput.value;
                
                if (validateEmail(email)) {
                    showNotification('✅ Спасибо за подписку!');
                    emailInput.value = '';
                } else {
                    showNotification('❌ Пожалуйста, введите корректный email');
                }
            } else {
                // Для других форм
                showNotification('✅ Форма отправлена!');
                this.reset();
            }
        });
    });
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Система уведомлений
    function showNotification(message) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'nes-container is-rounded notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: white;
            border: 4px solid #000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Анимации для уведомлений
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
    
    // Подсветка активной страницы
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navButtons = document.querySelectorAll('.nav-list .nes-btn');
    
    navButtons.forEach(btn => {
        const href = btn.getAttribute('href');
        if (href === currentPage) {
            btn.classList.add('is-disabled');
        }
    });
    
    // Плавная прокрутка для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Обработка контактной формы
    const contactForm = document.querySelector('.contact-info form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name');
            const email = document.getElementById('contact-email');
            const message = document.getElementById('message');
            
            if (name && email && message) {
                if (name.value && validateEmail(email.value) && message.value) {
                    showNotification('✅ Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
                    contactForm.reset();
                } else {
                    showNotification('❌ Пожалуйста, заполните все поля корректно.');
                }
            }
        });
    }
    
    // Анимация появления элементов при скролле
    function animateOnScroll() {
        const elements = document.querySelectorAll('.nes-container, .framework-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    }
    
    // Инициализация анимации при загрузке
    window.addEventListener('load', function() {
        const elements = document.querySelectorAll('.nes-container, .framework-card');
        elements.forEach(element => {
            element.style.opacity = "0";
            element.style.transform = "translateY(20px)";
            element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        });
        
        // Запускаем анимацию
        setTimeout(animateOnScroll, 100);
    });
    
    // Запускаем анимацию при скролле
    window.addEventListener('scroll', animateOnScroll);
    
    // Динамическая загрузка контента (опционально)
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
    
    // ==================== SEO META TAGS ====================
    // Добавляем canonical URL
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = window.location.href.split('?')[0].split('#')[0];
    document.head.appendChild(canonicalLink);
    
    // Добавляем Open Graph мета-теги если их нет
    if (!document.querySelector('meta[property="og:title"]')) {
        const ogTitle = document.createElement('meta');
        ogTitle.property = 'og:title';
        ogTitle.content = document.title;
        document.head.appendChild(ogTitle);
    }
    
    if (!document.querySelector('meta[property="og:type"]')) {
        const ogType = document.createElement('meta');
        ogType.property = 'og:type';
        ogType.content = 'website';
        document.head.appendChild(ogType);
    }
    
    if (!document.querySelector('meta[property="og:url"]')) {
        const ogUrl = document.createElement('meta');
        ogUrl.property = 'og:url';
        ogUrl.content = canonicalLink.href;
        document.head.appendChild(ogUrl);
    }
    
    // Добавляем Twitter Card мета-теги
    if (!document.querySelector('meta[name="twitter:card"]')) {
        const twitterCard = document.createElement('meta');
        twitterCard.name = 'twitter:card';
        twitterCard.content = 'summary';
        document.head.appendChild(twitterCard);
    }
});