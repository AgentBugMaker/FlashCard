const form = document.getElementById('add-word-form');
const cardsContainer = document.getElementById('cards-container');

let words = JSON.parse(localStorage.getItem('flashcards')) || {};

form.addEventListener('submit', e => {
  e.preventDefault();
  const word = form.word.value.trim();
  const definition = form.definition.value.trim();
  const cefr = form.cefr.value.trim().toUpperCase();

  if (!words[word]) {
    words[word] = [];
  }

  words[word].push({ definition, cefr });
  localStorage.setItem('flashcards', JSON.stringify(words));
  form.reset();
  renderCards();
});

function renderCards() {
  cardsContainer.innerHTML = '';

  Object.keys(words).forEach(word => {
    const card = document.createElement('div');
    card.className = 'card';

    const front = document.createElement('div');
    front.className = 'card-front card-content';
    front.innerHTML = `
      <div class="card-word">${word}</div>
      <button class="pronounce-btn">🔊 Pronounce</button>
    `;

    const back = document.createElement('div');
    back.className = 'card-back card-content';

    words[word].forEach(item => {
      const def = document.createElement('div');
      def.className = 'card-definition';
      def.textContent = `${item.definition} (${item.cefr})`;
      back.appendChild(def);
    });

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    front.querySelector('.pronounce-btn').addEventListener('click', e => {
      e.stopPropagation();
      speak(word);
    });

    cardsContainer.appendChild(card);
  });
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

renderCards();
