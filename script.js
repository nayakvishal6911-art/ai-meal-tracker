// DATA STORAGE
let selectedMood = null;
let selectedFood = null;
let foodPhoto = null;
let mealHistory = JSON.parse(localStorage.getItem('mealHistory')) || [];
let userPoints = parseInt(localStorage.getItem('userPoints')) || 0;

// MOOD SELECTION
function selectMood(element) {
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    selectedMood = element.getAttribute('data-mood');
    document.getElementById('moodSelected').textContent = '✅ ' + selectedMood;
}

// PHOTO UPLOAD
document.getElementById('foodPhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            foodPhoto = event.target.result;
            const preview = document.getElementById('photoPreview');
            preview.innerHTML = '<img src="' + foodPhoto + '" alt="Food">';
        };
        reader.readAsDataURL(file);
    }
});

// FOOD SELECTION
document.getElementById('foodDatabase').addEventListener('change', function() {
    if (this.value) {
        const parts = this.value.split('|');
        selectedFood = {
            name: parts[0],
            calories: parts[1],
            protein: parts[2],
            carbs: parts[3],
            fat: parts[4]
        };
        document.getElementById('foodSelected').textContent = '✅ Selected: ' + selectedFood.name;
    }
});

// ANALYZE MEAL
function analyzeMeal() {
    if (!selectedMood) {
        alert('❌ Please select your mood first');
        return;
    }
    
    if (!selectedFood) {
        alert('❌ Please select a food from the database');
        return;
    }

    // SHOW LOADING
    document.getElementById('loading').classList.remove('hidden');

    // SIMULATE AI ANALYSIS (1 second delay)
    setTimeout(function() {
        // GET AI TIPS BASED ON MOOD
        const moodTips = {
            '😊 Happy': '🌟 Your mood is great! This meal will give you steady energy. Perfect choice!',
            '😔 Sad': '💪 Add protein to boost serotonin. This meal has good protein - great for mood!',
            '😤 Stressed': '🧘 Include magnesium (nuts/seeds). Your meal is balanced - will help calm you.',
            '😴 Tired': '⚡ You need carbs + protein for energy. Perfect! This meal will energize you.',
            '😋 Excited': '🎉 Enjoy every bite! Your excitement will make this meal taste even better!',
            '😡 Angry': '🙏 Take deep breaths. Your meal is nutritious - will help regulate emotions.'
        };

        // SHOW RESULTS SCREEN
        document.getElementById('resultPhoto').innerHTML = foodPhoto ? '<img src="' + foodPhoto + '" alt="Food">' : '<p>📸 No photo uploaded</p>';
        document.getElementById('resultMood').innerHTML = '<strong>Your Mood:</strong> ' + selectedMood;
        document.getElementById('resultFood').innerHTML = '<strong>Food:</strong> ' + selectedFood.name;

        // NUTRITION DETAILS
        document.getElementById('nutritionDetails').innerHTML = 
            '<div class="nutrition-item"><span class="nutrition-label">Calories</span><span class="nutrition-value">' + selectedFood.calories + ' cal</span></div>' +
            '<div class="nutrition-item"><span class="nutrition-label">Protein</span><span class="nutrition-value">' + selectedFood.protein + 'g</span></div>' +
            '<div class="nutrition-item"><span class="nutrition-label">Carbs</span><span class="nutrition-value">' + selectedFood.carbs + 'g</span></div>' +
            '<div class="nutrition-item"><span class="nutrition-label">Fat</span><span class="nutrition-value">' + selectedFood.fat + 'g</span></div>';

        // AI TIP
        document.getElementById('aiTip').textContent = moodTips[selectedMood] || '✅ Great meal choice for your mood!';

        // HIDE LOADING & SHOW RESULTS
        document.getElementById('loading').classList.add('hidden');
        switchScreen('results-screen');

    }, 1000);
}

// SAVE MEAL
function saveMeal() {
    const timestamp = new Date().toLocaleTimeString('en-IN') + ' - ' + new Date().toLocaleDateString('en-IN');
    const mealEntry = {
        food: selectedFood.name,
        mood: selectedMood,
        time: timestamp,
        calories: selectedFood.calories
    };

    mealHistory.push(mealEntry);
    localStorage.setItem('mealHistory', JSON.stringify(mealHistory));

    // ADD POINTS
    userPoints += 10;
    localStorage.setItem('userPoints', userPoints.toString());
    document.getElementById('userPoints').textContent = userPoints;

    alert('✅ Meal saved! +10 points earned! Total: ' + userPoints + ' points');
}

// SHARE ON WHATSAPP
function shareOnWhatsApp() {
    const text = '🍽️ Just tracked my meal!\n' +
        'Food: ' + selectedFood.name + '\n' +
        'Mood: ' + selectedMood + '\n' +
        'Calories: ' + selectedFood.calories + ' kcal\n\n' +
        '📱 Download AI Meal Tracker:\n' +
        'Track your nutrition & mood daily! 🎯';
    
    const url = 'https://wa.me/?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
}

// SHOW HISTORY
function showHistory() {
    const historyList = document.getElementById('historyList');
    
    if (mealHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align:center; color:#999;">No meals logged yet. Start tracking! 🍽️</p>';
    } else {
        let totalCalories = 0;
        let html = '';

        for (let i = mealHistory.length - 1; i >= 0; i--) {
            const meal = mealHistory[i];
            totalCalories += parseInt(meal.calories);
            html += '<div class="history-item">' +
                '<strong>' + meal.food + '</strong><br>' +
                '😊 Mood: ' + meal.mood + '<br>' +
                '⏰ ' + meal.time + '<br>' +
                '🔥 ' + meal.calories + ' cal' +
                '</div>';
        }

        historyList.innerHTML = '<div class="nutrition-box"><strong>Today Total:</strong> ' + totalCalories + ' calories</div>' + html;
    }

    switchScreen('history-screen');
}

// EXPORT HISTORY
function exportHistory() {
    const text = 'My Meal Tracker History\n' +
        '========================\n\n' +
        mealHistory.map(m => m.time + '\n' + m.food + ' (' + m.mood + ') - ' + m.calories + ' cal').join('\n\n') +
        '\n\n✨ Powered by AI Meal Tracker';
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meal-history.txt';
    a.click();
}

// CLEAR ALL
function clearAll() {
    if (confirm('Are you sure? This will clear all selections.')) {
        selectedMood = null;
        selectedFood = null;
        foodPhoto = null;
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('moodSelected').textContent = 'No mood selected';
        document.getElementById('foodSelected').textContent = 'No food selected';
        document.getElementById('photoPreview').innerHTML = '';
        document.getElementById('foodDatabase').value = '';
        alert('✅ All cleared!');
    }
}

// NAVIGATION
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function goBack() {
    switchScreen('main-screen');
}

// INITIALIZE
document.getElementById('userPoints').textContent = userPoints;
console.log('✅ AI Meal Tracker Loaded!');
