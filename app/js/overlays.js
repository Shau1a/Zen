let overlayReset = `<p>Вы уверены, что хотите прерваться и начать с начала?</p>
					<br><button class="acceptButton acceptReset">Да</button>
					<button class="cancelButton cancelReset">Нет, продолжаю играть</button>`;

let complexityChoise = 	`<p>Выберите сложность игры:</p>
						<p class="complexity1 complexity_choice" data-coeff="0.65" data-delay="90"><a href="#">Медитативно</a></p>
						<p class="complexity2 complexity_choice" data-coeff="0.75" data-delay="70"><a href="#">Чуть быстрее</a></p>
						<p class="complexity3 complexity_choice" data-coeff="0.85" data-delay="60"><a href="#">Средняя сложность</a></p>
						<p class="complexity4 complexity_choice" data-coeff="0.95" data-delay="40"><a href="#">Высокая сложность</a></p>`;


let closeOverlayButton = document.getElementById('modal-close');
closeOverlayButton.addEventListener('click', function(e) {
	e.preventDefault();
	closeOverlay();
});

function openOverlay() {
	let field = document.querySelector('.modal-overlay');
	field.classList.remove('modal_closed'); 
}

function closeOverlay() {
	let field = document.querySelector('.modal-overlay');
	field.classList.add('modal_closed'); 
}

function setContent(content) {
	let field = document.querySelector('#modal-default .content');
	field.innerHTML = content;
};

function resetButtons() {
	let acceptButton = document.querySelector('#modal-default .acceptReset');
	let cancelButton = document.querySelector('#modal-default .cancelReset');
	
	acceptButton.addEventListener('click', function(e) {
		e.preventDefault();
		closeOverlay();
		game.reset();
	});

	cancelButton.addEventListener('click', function(e) {
		e.preventDefault();
		closeOverlay();
		view.start();
	});
};


function getComplexity() {
	let collection = document.querySelectorAll('#modal-default .complexity_choice');
	collection.forEach(function(elem) {
		elem.addEventListener('click', function(e){
			e.preventDefault();
			globalSettings.coeff = +this.getAttribute('data-coeff');
			globalSettings.delay = +this.getAttribute('data-delay');
			closeOverlay();
			view.start();
			game.newStart();
		});
	});
}

      