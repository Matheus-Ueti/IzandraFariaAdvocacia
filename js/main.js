// Adiciona classe fade-in aos elementos quando eles entram na viewport
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona classe de ativo ao link atual no menu
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Função para adicionar classe ativa ao link correspondente à seção atual
    function highlightActiveSection() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.parentElement.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    
    // Adiciona efeito de fade para os elementos quando eles aparecem na viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observa todas as seções, cards e estatísticas
    document.querySelectorAll('section, .card, .stat-box, .ratings').forEach((el) => observer.observe(el));
    
    // Counter animation para os números na seção de estatísticas
    const statNumbers = document.querySelectorAll('.stat-box span');
    
    const startCounters = function() {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.textContent);
            const suffix = counter.textContent.match(/[+k]$/);
            let current = 0;
            const increment = target / 60; // Velocidade da animação
            
            const updateCounter = function() {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + (suffix ? suffix[0] : '');
                    setTimeout(updateCounter, 30);
                } else {
                    counter.textContent = target + (suffix ? suffix[0] : '');
                }
            };
            
            updateCounter();
        });
    };
    
    // Inicia os contadores quando a seção estiver visível
    const statsSection = document.querySelector('.escritorio-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                statsObserver.unobserve(entries[0].target);
            }
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
});

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Fecha o menu mobile se estiver aberto
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        }
    });
});

// Navbar transparente no topo e com fundo ao rolar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('bg-white');
        navbar.classList.add('shadow');
    } else {
        navbar.classList.remove('bg-white');
        navbar.classList.remove('shadow');
    }
});

// Validação do formulário de contato
const contactForm = document.querySelector('#contato form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Exemplo de validação simples
        const inputs = this.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
                
                // Adiciona mensagem de erro
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.innerText = 'Este campo é obrigatório';
                
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('invalid-feedback')) {
                    input.parentNode.appendChild(feedback);
                }
            } else {
                input.classList.remove('is-invalid');
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('invalid-feedback')) {
                    input.nextElementSibling.remove();
                }
            }
        });
        
        if (isValid) {
            // Aqui você pode adicionar a lógica para enviar o formulário
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...';
            
            // Simulando o envio do formulário
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Mensagem enviada!';
                
                setTimeout(() => {
                    this.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    
                    // Mensagem de sucesso
                    const successAlert = document.createElement('div');
                    successAlert.className = 'alert alert-success mt-3';
                    successAlert.innerHTML = '<i class="fas fa-check-circle me-2"></i>Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    
                    this.parentNode.appendChild(successAlert);
                    
                    setTimeout(() => {
                        successAlert.remove();
                    }, 5000);
                    
                }, 2000);
            }, 1500);
        }
    });
} 