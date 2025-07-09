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
    
    // App State
    let currentTheme = localStorage.getItem('theme') || 'light';
    let currentView = localStorage.getItem('view') || 'flashcard';
    let flashcards = [];
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
        loadFlashcards();
        
        // Set up event listeners
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Theme toggle
        toggleThemeBtn.addEventListener('click', toggleTheme);
        
        // View toggle
        toggleViewBtn.addEventListener('click', toggleView);
        
        // Card interactions
        flashcard.addEventListener('click', flipCard);
        flipCardBtn.addEventListener('click', flipCard);
        prevCardBtn.addEventListener('click', showPreviousCard);
        nextCardBtn.addEventListener('click', showNextCard);
        playAudioBtn.addEventListener('click', playCurrentAudio);
        
        // Table view
        addFlashcardBtn.addEventListener('click', openAddFlashcardModal);
        
        // Modal
        closeModalBtn.addEventListener('click', closeModal);
        cancelFlashcardBtn.addEventListener('click', closeModal);
        flashcardForm.addEventListener('submit', saveFlashcard);
        addDefinitionBtn.addEventListener('click', addDefinitionField);
        
        // Click outside modal to close
        window.addEventListener('click', function(event) {
            if (event.target === flashcardModal) {
                closeModal();
            }
        });
    }
    
    // Load flashcards from words.json
    async function loadFlashcards() {
        try {
            const response = await fetch('words.json');
            if (!response.ok) throw new Error('Failed to load words');
            flashcards = await response.json();
            
            // Initialize with first card if available
            if (flashcards.length > 0) {
                currentCardIndex = 0;
                renderFlashcard();
                renderTable();
            } else {
                // Load sample data if empty
                loadSampleData();
            }
        } catch (error) {
            console.error('Error loading flashcards:', error);
            loadSampleData();
        }
    }
    
    // Save flashcards to words.json (simulated - would need server in real app)
    function saveFlashcards() {
        // In a real app, you would send this to a server
        console.log('Flashcards updated (would save to server in production)');
        renderFlashcard();
        renderTable();
    }
    
    // Theme functions
    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        appContainer.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon();
    }
    
    function updateThemeIcon() {
        const icon = toggleThemeBtn.querySelector('.material-icons');
        icon.textContent = currentTheme === 'light' ? 'dark_mode' : 'light_mode';
    }
    
    // View functions
    function toggleView() {
        currentView = currentView === 'flashcard' ? 'table' : 'flashcard';
        setView(currentView);
        localStorage.setItem('view', currentView);
        updateViewIcon();
    }
    
    function setView(view) {
        if (view === 'flashcard') {
            flashcardView.classList.add('active');
            tableView.classList.remove('active');
        } else {
            flashcardView.classList.remove('active');
            tableView.classList.add('active');
        }
    }
    
    function updateViewIcon() {
        const icon = toggleViewBtn.querySelector('.material-icons');
        icon.textContent = currentView === 'flashcard' ? 'table_view' : 'view_agenda';
    }
    
    // Flashcard functions
    function flipCard() {
        flashcard.classList.toggle('flipped');
    }
    
    function showPreviousCard() {
        if (flashcards.length === 0) return;
        
        currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
        renderFlashcard();
    }
    
    function showNextCard() {
        if (flashcards.length === 0) return;
        
        currentCardIndex = (currentCardIndex + 1) % flashcards.length;
        renderFlashcard();
    }
    
    function renderFlashcard() {
        if (flashcards.length === 0) {
            document.getElementById('card-word').textContent = 'No flashcards';
            document.getElementById('card-definition').textContent = 'Add some flashcards to get started';
            return;
        }
        
        const card = flashcards[currentCardIndex];
        document.getElementById('card-word').textContent = card.word;
        
        // Use the first definition for the flashcard view
        if (card.definitions && card.definitions.length > 0) {
            document.getElementById('card-definition').textContent = card.definitions[0].text;
            const cefrElement = document.querySelector('.cefr-level');
            cefrElement.textContent = card.definitions[0].cefrLevel;
            cefrElement.className = 'cefr-level';
            cefrElement.classList.add(`cefr-${card.definitions[0].cefrLevel}`);
        }
        
        // Reset card to front when changing
        if (flashcard.classList.contains('flipped')) {
            flashcard.classList.remove('flipped');
        }
    }
    
    function playCurrentAudio() {
        if (flashcards.length === 0) return;
        
        const card = flashcards[currentCardIndex];
        if (card.word) {
            // Use Web Speech API for pronunciation
            speakWord(card.word);
        }
    }
    
    // Text-to-speech function
    function speakWord(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US'; // Set to your target language
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-speech not supported in your browser');
        }
    }
    
    // Table view functions
    function renderTable() {
        flashcardsTable.innerHTML = '';
        
        if (flashcards.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="4" style="text-align: center;">No flashcards yet. Add some to get started!</td>';
            flashcardsTable.appendChild(row);
            return;
        }
        
        flashcards.forEach((card, index) => {
            const row = document.createElement('tr');
            
            // Word cell
            const wordCell = document.createElement('td');
            wordCell.textContent = card.word;
            row.appendChild(wordCell);
            
            // Definitions cell
            const definitionsCell = document.createElement('td');
            if (card.definitions && card.definitions.length > 0) {
                const definitionsList = document.createElement('ul');
                definitionsList.style.listStyleType = 'none';
                definitionsList.style.padding = '0';
                definitionsList.style.margin = '0';
                
                card.definitions.forEach(def => {
                    const item = document.createElement('li');
                    item.style.marginBottom = '8px';
                    item.textContent = def.text;
                    definitionsList.appendChild(item);
                });
                
                definitionsCell.appendChild(definitionsList);
            }
            row.appendChild(definitionsCell);
            
            // CEFR Level cell
            const cefrCell = document.createElement('td');
            if (card.definitions && card.definitions.length > 0) {
                const cefrSpan = document.createElement('span');
                cefrSpan.textContent = card.definitions[0].cefrLevel;
                cefrSpan.className = `cefr-level cefr-${card.definitions[0].cefrLevel}`;
                cefrSpan.style.padding = '2px 8px';
                cefrSpan.style.borderRadius = '10px';
                cefrSpan.style.fontSize = '0.8rem';
                cefrCell.appendChild(cefrSpan);
            }
            row.appendChild(cefrCell);
            
            // Actions cell
            const actionsCell = document.createElement('td');
            actionsCell.style.display = 'flex';
            actionsCell.style.gap = '8px';
            
            const playBtn = document.createElement('button');
            playBtn.className = 'icon-button';
            playBtn.innerHTML = '<span class="material-icons">volume_up</span>';
            playBtn.title = 'Play pronunciation';
            playBtn.addEventListener('click', () => speakWord(card.word));
            actionsCell.appendChild(playBtn);
            
            const editBtn = document.createElement('button');
            editBtn.className = 'icon-button';
            editBtn.innerHTML = '<span class="material-icons">edit</span>';
            editBtn.title = 'Edit';
            editBtn.addEventListener('click', () => editFlashcard(index));
            actionsCell.appendChild(editBtn);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'icon-button';
            deleteBtn.innerHTML = '<span class="material-icons">delete</span>';
            deleteBtn.title = 'Delete';
            deleteBtn.addEventListener('click', () => deleteFlashcard(index));
            actionsCell.appendChild(deleteBtn);
            
            row.appendChild(actionsCell);
            
            flashcardsTable.appendChild(row);
        });
    }
    
    function editFlashcard(index) {
        currentCardIndex = index;
        document.getElementById('modal-title').textContent = 'Edit Flashcard';
        
        const card = flashcards[index];
        document.getElementById('word').value = card.word;
        
        // Clear existing definition fields
        definitionsContainer.innerHTML = '';
        
        // Add definition fields
        if (card.definitions && card.definitions.length > 0) {
            card.definitions.forEach(def => {
                addDefinitionField(def.text, def.cefrLevel);
            });
        } else {
            addDefinitionField();
        }
        
        flashcardModal.classList.add('active');
    }
    
    function deleteFlashcard(index) {
        if (confirm('Are you sure you want to delete this flashcard?')) {
            flashcards.splice(index, 1);
            saveFlashcards();
            
            if (currentCardIndex >= flashcards.length) {
                currentCardIndex = Math.max(0, flashcards.length - 1);
            }
            
            renderFlashcard();
            renderTable();
        }
    }
    
    // Modal functions
    function openAddFlashcardModal() {
        document.getElementById('modal-title').textContent = 'Add New Flashcard';
        document.getElementById('word').value = '';
        definitionsContainer.innerHTML = '';
        addDefinitionField();
        flashcardModal.classList.add('active');
    }
    
    function closeModal() {
        flashcardModal.classList.remove('active');
    }
    
    function addDefinitionField(text = '', cefrLevel = 'A1') {
        const definitionDiv = document.createElement('div');
        definitionDiv.className = 'definition-item';
        
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.placeholder = 'Definition';
        textInput.value = text;
        textInput.required = true;
        
        const cefrSelect = document.createElement('select');
        ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].forEach(level => {
            const option = document.createElement('option');
            option.value = level;
            option.textContent = level;
            option.selected = level === cefrLevel;
            cefrSelect.appendChild(option);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'icon-button';
        deleteBtn.innerHTML = '<span class="material-icons">delete</span>';
        deleteBtn.addEventListener('click', () => {
            if (definitionsContainer.children.length > 1) {
                definitionDiv.remove();
            }
        });
        
        definitionDiv.appendChild(textInput);
        definitionDiv.appendChild(cefrSelect);
        definitionDiv.appendChild(deleteBtn);
        
        definitionsContainer.appendChild(definitionDiv);
    }
    
    function saveFlashcard(e) {
        e.preventDefault();
        
        const word = document.getElementById('word').value.trim();
        
        // Collect definitions
        const definitions = [];
        const definitionItems = definitionsContainer.querySelectorAll('.definition-item');
        
        definitionItems.forEach(item => {
            const textInput = item.querySelector('input[type="text"]');
            const cefrSelect = item.querySelector('select');
            
            if (textInput.value.trim()) {
                definitions.push({
                    text: textInput.value.trim(),
                    cefrLevel: cefrSelect.value
                });
            }
        });
        
        if (definitions.length === 0) {
            alert('Please add at least one definition');
            return;
        }
        
        // Create or update flashcard
        const flashcard = {
            word,
            definitions
        };
        
        if (document.getElementById('modal-title').textContent === 'Add New Flashcard') {
            // Add new flashcard
            flashcards.push(flashcard);
            currentCardIndex = flashcards.length - 1;
        } else {
            // Update existing flashcard
            flashcards[currentCardIndex] = flashcard;
        }
        
        saveFlashcards();
        renderFlashcard();
        renderTable();
        closeModal();
    }
    
    // Sample data
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
                    { text: "A farewell expression", cefrLevel: "A1" },
                    { text: "The act of parting", cefrLevel: "B1" }
                ]
            },
            {
                word: "Computer",
                definitions: [
                    { text: "An electronic device for processing data", cefrLevel: "A2" }
                ]
            }
        ];
        
        saveFlashcards();
        renderFlashcard();
        renderTable();
    }
});
