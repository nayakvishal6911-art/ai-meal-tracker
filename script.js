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
async function analyzeMeal() {
    if (!selectedMood) {
        alert('Please select your mood first');
        return;
    }
    
    if (!selectedFood) {
        alert('Please select a food from the database');
        return;
    }
    
    document.getElementById('loading').classList.remove('hidden');
    
    try {
        const backendURL = 'https://ai-meal-tracker-api.onrender.com/api/analyze-food';
        
        const response = await fetch(backendURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                food: selectedFood.name,
                mood: selectedMood
            })
        });
        
        const nutritionData = await response.json();
        
        if (nutritionData.error) {
            displayResults(selectedFood);
        } else {
            displayResults(nutritionData);
        }
    } catch (error) {
        console.log('Error:', error);
        displayResults(selectedFood);
    }
    
    document.getElementById('loading').classList.add('hidden');
}
