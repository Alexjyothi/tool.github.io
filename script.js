// DOM Elements
const searchInput = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-box button');
const toolCards = document.querySelectorAll('.tool-card');

// Tool Functions
const tools = {
    percentageCalculator: {
        calculate: () => {
            const num = parseFloat(document.querySelector('.tool-card:nth-child(1) input:nth-of-type(1)').value);
            const percent = parseFloat(document.querySelector('.tool-card:nth-child(1) input:nth-of-type(2)').value);
            const result = (num * percent) / 100;
            document.querySelector('.tool-card:nth-child(1) .result span').textContent = result.toFixed(2);
        }
    },
    unitConverter: {
        convert: () => {
            const value = parseFloat(document.querySelector('.tool-card:nth-child(2) input').value);
            const unitType = document.querySelector('.tool-card:nth-child(2) select').value;
            let result;
            
            if (unitType === 'Length') {
                result = `${(value * 3.28084).toFixed(2)} feet`;
            } else if (unitType === 'Weight') {
                result = `${(value * 2.20462).toFixed(2)} pounds`;
            } else if (unitType === 'Temperature') {
                result = `${((value * 9/5) + 32).toFixed(2)} °F`;
            }
            
            document.querySelector('.tool-card:nth-child(2) .result span').textContent = result;
        }
    },
    passwordGenerator: {
        generate: () => {
            const length = document.querySelector('.tool-card:nth-child(3) input[type="range"]').value;
            const uppercase = document.querySelector('.tool-card:nth-child(3) input:nth-of-type(1)').checked;
            const numbers = document.querySelector('.tool-card:nth-child(3) input:nth-of-type(2)').checked;
            
            let charset = 'abcdefghijklmnopqrstuvwxyz';
            if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (numbers) charset += '0123456789';
            
            let password = '';
            for (let i = 0; i < length; i++) {
                password += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            
            document.querySelector('.tool-card:nth-child(3) .result span').textContent = password;
        }
    },
    colorPicker: {
        updateValues: (color) => {
            // Convert hex to RGB
            const r = parseInt(color.substr(1, 2), 16);
            const g = parseInt(color.substr(3, 2), 16);
            const b = parseInt(color.substr(5, 2), 16);
            
            document.querySelector('.tool-card:nth-child(4) .color-values span:nth-of-type(1)').textContent = color;
            document.querySelector('.tool-card:nth-child(4) .color-values span:nth-of-type(2)').textContent = `${r}, ${g}, ${b}`;
        }
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Percentage Calculator
    document.querySelector('.tool-card:nth-child(1) button').addEventListener('click', tools.percentageCalculator.calculate);
    
    // Unit Converter
    document.querySelector('.tool-card:nth-child(2) select').addEventListener('change', tools.unitConverter.convert);
    document.querySelector('.tool-card:nth-child(2) input').addEventListener('input', tools.unitConverter.convert);
    
    // Password Generator
    document.querySelector('.tool-card:nth-child(3) button').addEventListener('click', tools.passwordGenerator.generate);
    document.querySelectorAll('.tool-card:nth-child(3) input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', tools.passwordGenerator.generate);
    });
    document.querySelector('.tool-card:nth-child(3) input[type="range"]').addEventListener('input', (e) => {
        document.querySelector('.tool-card:nth-child(3) .result span').textContent = `Length: ${e.target.value}`;
    });
    
    // Color Picker
    document.querySelector('.tool-card:nth-child(4) input[type="color"]').addEventListener('input', (e) => {
        tools.colorPicker.updateValues(e.target.value);
    });
    // Initialize with default color
    tools.colorPicker.updateValues('#ff0000');
    
    // Search Functionality
    searchBtn.addEventListener('click', searchTools);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchTools();
    });
    
    // Category Cards Animation
    document.querySelectorAll('.category-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Tool Cards Animation
    toolCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15 + 0.4}s`;
    });
});

// Search Function
function searchTools() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
        toolCards.forEach(card => card.style.display = 'block');
        return;
    }
    
    toolCards.forEach(card => {
        const toolName = card.querySelector('h3').textContent.toLowerCase();
        if (toolName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Rainbow Text Animation
const rainbowTextElements = document.querySelectorAll('.rainbow-text');
rainbowTextElements.forEach(element => {
    const letters = element.textContent.split('');
    element.innerHTML = letters.map((letter, i) => 
        `<span style="animation-delay: ${i * 0.1}s">${letter}</span>`
    ).join('');
});