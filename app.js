let cards = JSON.parse(localStorage.getItem(cards))  [];

function renderCards() {
  const container = document.getElementById(cards);
  container.innerHTML = ;

  const grouped = {};
  cards.forEach(card = {
    if (!grouped[card.word]) grouped[card.word] = [];
    grouped[card.word].push({ meaning card.meaning, level card.level });
  });

  Object.keys(grouped).forEach(word = {
    const cardDiv = document.createElement(div);
    cardDiv.className = card;
    cardDiv.textContent = word;
    cardDiv.onclick = () = {
      alert(
        grouped[word]
          .map((m, i) = `${i + 1}. ${m.meaning} [${m.level}]`)
          .join(n)
      );
      speak(word);
    };
    container.appendChild(cardDiv);
  });
}

function addCard() {
  const word = document.getElementById(word).value.trim();
  const meaning = document.getElementById(meaning).value.trim();
  const level = document.getElementById(level).value.trim();

  if (word && meaning && level) {
    cards.push({ word, meaning, level });
    localStorage.setItem(cards, JSON.stringify(cards));
    renderCards();
    document.getElementById(word).value = ;
    document.getElementById(meaning).value = ;
    document.getElementById(level).value = ;
  }
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

renderCards();
