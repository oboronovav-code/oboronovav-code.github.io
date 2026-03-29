 const trashBinsData = [
            { id: 'bin-1', fillLevel: 10 }, 
            { id: 'bin-2', fillLevel: 85 }, 
            { id: 'bin-3', fillLevel: 50 },
            { id: 'bin-4', fillLevel: 0 }, 
            { id: 'bin-5', fillLevel: 15 }, 
            { id: 'bin-6', fillLevel: 90 },
            { id: 'bin-7', fillLevel: 63 }, 
            { id: 'bin-8', fillLevel: 74 }, 
            { id: 'bin-9', fillLevel: 5 },
            { id: 'bin-10', fillLevel: 50 }, 
            { id: 'bin-11', fillLevel: 'none' }, 
            { id: 'bin-12', fillLevel: 2 },
            { id: 'bin-13', fillLevel: 55 }, 
            { id: 'bin-14', fillLevel: 60 }, 
            { id: 'bin-15', fillLevel: 10 },
            { id: 'bin-16', fillLevel: 20 }, 
            { id: 'bin-17', fillLevel: 50 }, 
            { id: 'bin-18', fillLevel: 68 }
        ];
        
function toggleDropdown() {
            document.getElementById('priority-dropdown').classList.toggle('active');
}
        
function refreshMap() {
    const listContainer = document.getElementById('priority-list');
    listContainer.innerHTML = ''; // Очищуємо список
    let hasPriority = false;

    trashBinsData.forEach(bin => {
        const element = document.getElementById(bin.id);
        if (element) {
            let statusClass = 'status-empty';
            const titleText = element.getAttribute('title');
            let icon = '';

            if (bin.fillLevel === 'none') {
                statusClass = 'status-problem';
                icon = '⚪';
                addListItem(bin.id, icon, titleText);
                hasPriority = true;
            } 
            else if (bin.fillLevel > 80) {
                statusClass = 'status-full';
                icon = '🔴';
                addListItem(bin.id, icon, titleText);
                hasPriority = true;
            } 
            else if (bin.fillLevel > 40) {
                statusClass = 'status-medium';
            }

            element.className = 'dot ' + statusClass;
            element.onclick = (event) => showPopup(event, bin.id);
        }
    });

}

// Функція створення елемента списку
function addListItem(id, icon, text) {
    const container = document.getElementById('priority-list');
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.innerHTML = `<span>${icon}</span> <span>${text}</span>`;
    
    // При кліку на пункт — фокусуємо карту
    item.onclick = () => {
        const dot = document.getElementById(id);
        if (dot) {
            dot.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Можна додати закриття списку після вибору:
            // toggleDropdown(); 
        }
    };
    
    container.appendChild(item);
}

        // Функція для показу вікна
function showPopup(event, binId) {
    const popup = document.getElementById('info-popup');
    const binData = trashBinsData.find(b => b.id === binId);
    const element = document.getElementById(binId);
    const title = element.getAttribute('title');

    if (!binData) return;

    // Заповнюємо дані
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-fill').innerText = `Заповненість: ${binData.fillLevel === 'none' ? '—' : binData.fillLevel + '%'}`;
    
    let statusText = "Норма";
    if (binData.fillLevel === 'none') statusText = "Помилка датчика";
    else if (binData.fillLevel > 80) statusText = "Критично (Повний)";
    else if (binData.fillLevel > 40) statusText = "Середній рівень";
    
    document.getElementById('popup-status').innerText = `Статус: ${statusText}`;

    // Позиціонуємо вікно поруч із курсором або точкою
    popup.style.display = 'block';
    popup.style.left = (event.pageX - 100) + 'px'; // Центруємо відносно кліку
    popup.style.top = (event.pageY - 160) + 'px'; // Трохи вище точки
}
        
function closePopup() {
    document.getElementById('info-popup').style.display = 'none';
}

window.onload = refreshMap;
