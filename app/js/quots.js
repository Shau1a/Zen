(function() {
let getQute = function() { 
    let proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    	apiUrl = "https://api.forismatic.com/api/1.0/",
        apiQuery = proxyUrl+apiUrl+"?method=getQuote&format=json&lang=ru";
    fetch(apiQuery)
    .then(response => response.json())
    .then(data => {
        parseQuote(data);
    })
    .catch(error => console.error("Ошибка получение цитаты. Причина: " + error));
};

let parseQuote = function(data) {
	let textBox = document.querySelector('.forismatic .quoteText');
	let textAuthor = document.querySelector('.forismatic .quoteAuthor');
	let quot = data.quoteText;
	let author = data.quoteAuthor;
	textBox.innerHTML = quot;
	textAuthor.innerHTML = author;
}


getQute();

let changingQuote = document.querySelector('.forismatic .changeQuote');
changingQuote.addEventListener('click', function(e) {
	e.preventDefault();
	getQute();
});

})();
