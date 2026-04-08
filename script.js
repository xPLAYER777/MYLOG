document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Barra de navegación pegajosa (Cambio de color al bajar)
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Animación de las estadísticas (Contador numérico)
    const counters = document.querySelectorAll('.counter');
    const speed = 100; // Velocidad de animación

    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter); // Animarlo solo una vez
            }
        });
    };

    const counterObserver = new IntersectionObserver(animateCounters, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));

    // 3. Funcionalidad del Acordeón (FAQ)
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Cerrar otros abiertos (opcional, si quieres que solo haya uno abierto a la vez)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Abrir/Cerrar el actual
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    // 4. Smooth Scroll para Enlaces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Ajuste para el navbar
                    behavior: 'smooth'
                });
            }
        });
    });
// ==========================================
    // Lógica del Sistema de Comentarios
    // ==========================================
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');

    // Función para cargar comentarios guardados en localStorage al iniciar la página
    function loadComments() {
        const savedComments = JSON.parse(localStorage.getItem('nova_comments')) || [];
        
        // Si no hay comentarios, poner uno de ejemplo
        if (savedComments.length === 0) {
            const defaultComment = {
                name: "Logística Global MX",
                text: "Excelente servicio. Nuestro cargamento llegó a tiempo y en perfectas condiciones a Europa. Muy recomendados.",
                date: new Date().toLocaleDateString('es-ES')
            };
            addCommentToDOM(defaultComment);
            savedComments.push(defaultComment);
            localStorage.setItem('nova_comments', JSON.stringify(savedComments));
        } else {
            savedComments.forEach(comment => addCommentToDOM(comment));
        }
    }

    // Función para construir el HTML de cada comentario y mostrarlo
    function addCommentToDOM(comment) {
        const div = document.createElement('div');
        div.className = 'comment-box';
        
        // Estructura interna del comentario
        div.innerHTML = `
            <div class="comment-header">
                <strong>${comment.name}</strong>
                <span class="date">${comment.date}</span>
            </div>
            <p class="comment-text"></p>
        `;
        
        // Insertamos el texto de esta manera para evitar inyecciones de código malicioso (XSS)
        div.querySelector('.comment-text').textContent = `"${comment.text}"`;
        
        // Agregamos el nuevo comentario al inicio de la lista
        commentsList.prepend(div);
    }

    // Evento al enviar el formulario
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita que la página se recargue

            // Obtener los valores de los inputs
            const nameInput = document.getElementById('commentName').value;
            const textInput = document.getElementById('commentText').value;
            
            // Obtener fecha actual
            const today = new Date();
            const dateFormatted = today.toLocaleDateString('es-ES');

            const newComment = {
                name: nameInput,
                text: textInput,
                date: dateFormatted
            };

            // Mostrarlo en pantalla
            addCommentToDOM(newComment);

            // Guardarlo en localStorage
            const savedComments = JSON.parse(localStorage.getItem('nova_comments')) || [];
            savedComments.push(newComment);
            localStorage.setItem('nova_comments', JSON.stringify(savedComments));

            // Limpiar el formulario después de enviar
            commentForm.reset();
        });
    }

    // Ejecutar la carga de comentarios al iniciar
    loadComments();
});
