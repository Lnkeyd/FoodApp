    window.addEventListener('DOMContentLoaded', () => {
        const   tabs = document.querySelectorAll('.tabheader__item'),
                tabContent = document.querySelectorAll('.tabcontent'),
                overlay = document.querySelector('.tabheader__items');
        
        function hideContent(){
            tabContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
            });

            tabs.forEach(item => {
                item.classList.remove('tabheader__item_active');
            });
        }

        function showContent(i = 0){
            tabContent[i].classList.add('show', 'fade');
            tabContent[i].classList.remove('hide');
            tabs[i].classList.add('tabheader__item_active');
        }

        hideContent();
        showContent();

        overlay.addEventListener('click', event => {
            const tar = event.target;
            
            if (tar && tar.classList.contains('tabheader__item')) {
                tabs.forEach((item, i) => {
                    if (tar == item) {
                        hideContent();
                        showContent(i);
                    }
                });
            }
        });


        //Time

        const deadline = '2020-10-15';

        function getTimeRemaining(endtime) {
            const t       = Date.parse(endtime) - Date.parse(new Date()),
                days    = Math.floor(t / (1000 * 60 * 60 * 24)),
                hours   = Math.floor((t / (1000 * 60 * 60)) % 24),
                minutes = Math.floor((t / (1000 * 60)) % 60),
                seconds = Math.floor(t / 1000 % 60);

            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        }

        function setZero(element) {
            if (element >=0 && element < 10)
                return `0${element}`;
            else
                return element;
        }

        function setClock(selector, endtime) {
            const timerStamp    =   document.querySelector(selector),
                days          =   document.querySelector('#days'),
                hours         =   document.querySelector('#hours'),
                minutes       =   document.querySelector('#minutes'),
                seconds       =   document.querySelector('#seconds'),
                timeInterval  =   setInterval(updateClock, 1000);
            
            updateClock();

            function updateClock() {
                const t = getTimeRemaining(endtime);

                days.innerHTML = setZero(t.days);
                hours.innerHTML = setZero(t.hours);
                minutes.innerHTML = setZero(t.minutes);
                seconds.innerHTML = setZero(t.seconds);

                if (t.total <= 0)
                clearInterval(timeInterval);
            }
        }

        setClock('.timer', deadline);

        // Modal

        const modalBtns = document.querySelectorAll('[data-modal]'),
            modalWindow = document.querySelector('.modal');



        function showModal(){
            modalWindow.classList.add('show');
            modalWindow.classList.remove('hide');
            document.body.style.overflow = 'hidden';
            clearTimeout(modalTimerId);
        }

        function closeModal(){
            modalWindow.classList.remove('show');
            modalWindow.classList.add('hide');
            document.body.style.overflow = 'auto';
        }

        modalBtns.forEach((item) => {
            item.addEventListener('click', showModal);
        });

        modalWindow.addEventListener('click', (e) => {
            if (e.target === modalWindow || e.target.getAttribute('data-close') == '')
                closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.code == "Escape" && modalWindow.classList.contains('show'))
                closeModal();
        });

        // Modal modifications

        const modalTimerId = setTimeout(showModal, 15000);

        function showModalByScroll () {
            if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
                showModal();
                window.removeEventListener('scroll', showModalByScroll);
            }
        }
        window.addEventListener('scroll', showModalByScroll);

        // Classes

        class Menu {
            constructor(img, alt, header, descr, price, parentSelector, ...classes){
                this.img = img;
                this.header = header;
                this.descr = descr;
                this.alt = alt;
                this.price = price;
                this.parent = document.querySelector(parentSelector);
                this.transfer = 27;
                this.classes = classes;
                this.changeToRUB();
            }

            changeToRUB(){
                this.price = this.price * this.transfer;
            }

            render(){
                const element = document.createElement('div');
                if (this.classes.length === 0) {
                    this.element = 'menu__item';
                    element.classList.add(this.element);
                } else{
                    this.classes.forEach((item) =>{
                        element.classList.add(item);
                    });
                }
                element.innerHTML = `  
                    <img src="${this.img}" alt=${this.img}>
                    <h3 class="menu__item-subtitle">${this.header}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                    </div>
                `;

                this.parent.append(element);
            }
    }

    new Menu(
        'img/tabs/vegy.jpg',
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        6,
        '.menu .container'
        ).render();

    new Menu(
        'img/tabs/elite.jpg',
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        9,
        '.menu .container'
        ).render();

    new Menu(
        'img/tabs/post.jpg',
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков. ',
        7,
        '.menu .container'
        ).render();

    //Post Request to server
    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item =>{
        postData(item);
    });
    
    function postData(form){
        form.addEventListener('submit', (e)=>{
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            
            request.setRequestHeader('Content-type', 'application/json');
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });

            const json = JSON.stringify(object);
            request.send(json);

            request.addEventListener('load', ()=>{
                if (request.status === 200){
                    console.log(request.response);
                    showThanksModal(message.success);
                    form.reset();
                    statusMessage.remove();
                } else {
                    showThanksModal(message.failure);
                }

                function showThanksModal(message){
                    const prevModalDialog = document.querySelector('.modal__dialog');

                    prevModalDialog.classList.add('hide');
                    showModal();

                    const thanksModal = document.createElement('div');
                    thanksModal.classList.add('modal__dialog');
                    thanksModal.innerHTML = `
                    <div class="modal__content">
                        <div class="modal__close" data-close>×</div>
                        <div class="modal__title">${message}</div>
                    </div>
                    `;

                    document.querySelector('.modal').append(thanksModal);
                    setTimeout(() => {
                        thanksModal.remove();
                        prevModalDialog.classList.add('show');
                        prevModalDialog.classList.remove('hide');
                        closeModal();
                    }, 4000);
                }
            });
        });
    }

});

