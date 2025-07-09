document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const appContainer = document.querySelector('.app-container');
    const toggleThemeBtn = document.getElementById('toggle-theme');
    const toggleViewBtn = document.getElementById('toggle-view');
    const flashcardView = document.getElementById('flashcard-view');
    const tableView = document.getElementById('table-view');
    const flashcard = document.getElementById('flashcard');
    const flipCardBtn = document.getElementById('flip-card');
    const prevCardBtn = document.getElementById('prev-card');
    const nextCardBtn = document.getElementById('next-card');
    const playAudioBtn = document.getElementById('play-audio');
    const addFlashcardBtn = document.getElementById('add-flashcard');
    const flashcardsTable = document.getElementById('flashcards-table');
    const flashcardModal = document.getElementById('flashcard-modal');
    const closeModalBtn = document.querySelector('.close-button');
    const cancelFlashcardBtn = document.getElementById('cancel-flashcard');
    const flashcardForm = document.getElementById('flashcard-form');
    const addDefinitionBtn = document.getElementById('add-definition');
    const definitionsContainer = document.getElementById('definitions-container');
    const definitionsList = document.getElementById('definitions-list');
    const cardWordElement = document.getElementById('card-word');
    
    // App State
    let currentTheme = localStorage.getItem('theme') || 'light';
    let currentView = localStorage.getItem('view') || 'flashcard';
    let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    let currentCardIndex = 0;
    
    // Initialize the app
    initApp();
    
    function initApp() {
        // Set theme
        appContainer.setAttribute('data-theme', currentTheme);
        updateThemeIcon();
        
        // Set view
        setView(currentView);
        updateViewIcon();
        
        // Load flashcards
        if (flashcards.length === 0) {
            loadSampleData();
        }
        renderFlashcard();
        renderTable();
        
        // Set up event listeners
        setupEventListeners();
    }
    
    // [Rest of your existing functions remain the same until renderFlashcard()]
    
    function renderFlashcard() {
        if (flashcards.length === 0) {
            cardWordElement.textContent = 'No flashcards available';
            definitionsList.innerHTML = '<p>Please add some flashcards first</p>';
            return;
        }
        
        // Ensure currentCardIndex is within bounds
        currentCardIndex = Math.max(0, Math.min(currentCardIndex, flashcards.length - 1));
        
        const card = flashcards[currentCardIndex];
        cardWordElement.textContent = card.word;
        
        // Clear and rebuild definitions list
        definitionsList.innerHTML = '';
        
        if (card.definitions && card.definitions.length > 0) {
            card.definitions.forEach(def => {
                const definitionElement = document.createElement('div');
                definitionElement.className = 'definition-item';
                
                const textElement = document.createElement('p');
                textElement.textContent = def.text;
                
                const cefrElement = document.createElement('span');
                cefrElement.className = `cefr-level cefr-${def.cefrLevel}`;
                cefrElement.textContent = def.cefrLevel;
                
                definitionElement.appendChild(textElement);
                definitionElement.appendChild(cefrElement);
                definitionsList.appendChild(definitionElement);
            });
        } else {
            definitionsList.innerHTML = '<p>No definitions available</p>';
        }
        
        // Reset card to front when changing
        if (flashcard.classList.contains('flipped')) {
            flashcard.classList.remove('flipped');
        }
    }
    
    // [Rest of your existing functions remain the same]
    
    function saveFlashcards() {
        try {
            localStorage.setItem('flashcards', JSON.stringify(flashcards));
            console.log('Flashcards saved successfully:', flashcards);
        } catch (error) {
            console.error('Error saving flashcards:', error);
            alert('Error saving flashcards. Please try again.');
        }
    }
    
    function loadSampleData() {
        flashcards = [
            {
                word: "Hello",
                definitions: [
                    { text: "A common greeting", cefrLevel: "A1" }
                ]
            },
            {
                word: "Goodbye",
                definitions: [
                    { text: "A farewell expression", cefrLevel: "A1" }
                ]
            }
        ];
        saveFlashcards();
    }
});
