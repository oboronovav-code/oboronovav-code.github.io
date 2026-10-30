const map = L.map('map').setView([50.4501, 30.5234], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

const trashBinsData = [
    // Шевченківський район
    { id: 'bin-1', district: 'shevchenkivskyi', title: 'Галицька площа', fillLevel: 20, coords: [50.4480, 30.4900] },
    { id: 'bin-2', district: 'shevchenkivskyi', title: 'Старовокзальна', fillLevel: 50, coords: [50.4450, 30.4850] },
    { id: 'bin-3', district: 'solomianskyi', title: 'Просп. Академіка Корольова', fillLevel: 10, coords: [50.4200, 30.4000] },
    { id: 'bin-4', district: 'solomianskyi', title: 'Михайлівська Борщагівка', fillLevel: 85, coords: [50.4100, 30.3900] },
    { id: 'bin-5', district: 'solomianskyi', title: 'Івана Дзюби', fillLevel: 'none', coords: [50.4300, 30.4200] },
    { id: 'bin-6', district: 'holosiivskyi', title: 'Голосіївська', fillLevel: 90, coords: [50.3950, 30.5150] },
    { id: 'bin-7', district: 'holosiivskyi', title: 'Деміївська', fillLevel: 30, coords: [50.4030, 30.5200] },
    { id: 'bin-8', district: 'pecherskyi', title: 'Палац Спорту', fillLevel: 75, coords: [50.4380, 30.5220] },
    { id: 'bin-9', district: 'pecherskyi', title: 'Кловська', fillLevel: 15, coords: [50.4390, 30.5330] },
    { id: 'bin-10', district: 'podilskyi', title: 'Контрактова площа', fillLevel: 88, coords: [50.4630, 30.5160] },
    { id: 'bin-11', district: 'podilskyi', title: 'Тараса Шевченка', fillLevel: 40, coords: [50.4710, 30.5030] },
    { id: 'bin-12', district: 'darnytskyi', title: 'Позняки', fillLevel: 60, coords: [50.3960, 30.6270] },
    { id: 'bin-13', district: 'darnytskyi', title: 'Осокорки', fillLevel: 10, coords: [50.3940, 30.6130] },
    { id: 'bin-14', district: 'dniprovskyi', title: 'Лівобережна', fillLevel: 95, coords: [50.4490, 30.5930] },
    { id: 'bin-15', district: 'dniprovskyi', title: 'Гідропарк', fillLevel: 5, coords: [50.4460, 30.5780] },
    { id: 'bin-16', district: 'desnianskyi', title: 'Керченська площа', fillLevel: 50, coords: [50.4870, 30.6080] },
    { id: 'bin-17', district: 'obolonskyi', title: 'Оболонь', fillLevel: 30, coords: [50.5010, 30.5010] },
    { id: 'bin-18', district: 'obolonskyi', title: 'Мінська', fillLevel: 82, coords: [50.5120, 30.5030] },
    { id: 'bin-19', district: 'sviatoshynskyi', title: 'Святошин', fillLevel: 45, coords: [50.4570, 30.3950] }
];
const districtCenters = {
    'all': { coords: [50.4501, 30.5234], zoom: 12 },
    'solomianskyi': { coords: [50.4350, 30.4300], zoom: 14 },
    'shevchenkivskyi': { coords: [50.4550, 30.5100], zoom: 14 },
    'holosiivskyi': { coords: [50.3850, 30.5050], zoom: 13 },    
    'pecherskyi': { coords: [50.4280, 30.5370], zoom: 14 },      
    'podilskyi': { coords: [50.4710, 30.5130], zoom: 14 },       
    'darnytskyi': { coords: [50.3950, 30.6400], zoom: 13 },     
    'dniprovskyi': { coords: [50.4570, 30.6030], zoom: 13 },     
    'desnianskyi': { coords: [50.5130, 30.6120], zoom: 13 },
    'obolonskyi': { coords: [50.5120, 30.4950], zoom: 13 },      
    'sviatoshynskyi': { coords: [50.4480, 30.3630], zoom: 13 }
};

const markersMap = {};

function filterDistrict(districtKey) {
    const target = districtCenters[districtKey];
    if (target) {
        map.setView(target.coords, target.zoom);
        document.getElementById('district-selected-text').innerText = target.name;
        document.getElementById('district-dropdown').classList.remove('active');
    }
}
        
function toggleDropdown(dropdownId) {
    document.getElementById(dropdownId).classList.toggle('active');
}
        
function refreshMap() {
    const listContainer = document.getElementById('priority-list');
    if (listContainer) listContainer.innerHTML = '';

    trashBinsData.forEach(bin => {
        if (!markersMap[bin.id]) {
            let color = '#2ecc71'; 
            if (bin.fillLevel === 'none') color = '#D3D3D3';
            else if (bin.fillLevel > 80) color = '#e74c3c';
            else if (bin.fillLevel > 40) color = '#f1c40f';

            const marker = L.circleMarker(bin.coords, {
                radius: 8,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9
            }).addTo(map);

            marker.bindPopup(`<b>${bin.title}</b><br>Заповненість: ${bin.fillLevel}%`);
            markersMap[bin.id] = marker;
        }

        if (bin.fillLevel === 'none' || bin.fillLevel > 80) {
            let icon = bin.fillLevel === 'none' ? '⚪' : '🔴';
            addListItem(bin.id, icon, bin.title);
        }
    });
}

function addListItem(id, icon, text) {
    const container = document.getElementById('priority-list');
    if (!container) return;
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.innerHTML = `<span>${icon}</span> <span>${text}</span>`;
    
    item.onclick = () => {
        const marker = markersMap[id];
        if (marker) {
            map.setView(marker.getLatLng(), 16);
            marker.openPopup();
        }
    };
    
    container.appendChild(item);
}

function closePopup() {
    document.getElementById('info-popup').style.display = 'none';
}

function applyPermissions() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const reportBtn = document.getElementById('report-btn');

    if (isLoggedIn === 'true') {
        if (reportBtn) reportBtn.style.display = 'block'; // Показуємо кнопку
    } else {
        if (reportBtn) reportBtn.style.display = 'none';  // Ховаємо кнопку
    }
}

// Функція для відкриття/закриття форми
function toggleReportForm() {
    const form = document.getElementById('report-form-container');
    if (form.style.display === 'block') {
        form.style.display = 'none';
    } else {
        form.style.display = 'block';
    }
}

// Функція для "збереження" (поки що виводить дані в консоль або алерт)
function saveReport() {
    const period = document.getElementById('report-period').value;
    const station = document.getElementById('report-station').value;

    if (!station) {
        alert("Будь ласка, введіть назву станції!");
        return;
    }

    console.log(`Звіт створено: Період - ${period}, Станція - ${station}`);
    alert(`Звіт для станції "${station}" (${period}) успішно збережено!`);
    
    // Закриваємо форму після збереження
    document.getElementById('report-form-container').style.display = 'none';
}

// Закривати форму, якщо клікнули поза нею
window.onclick = function(event) {
    if (!event.target.matches('.report-btn')) {
        const dropdowns = document.getElementsByClassName("report-form-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.style.display === 'block' && !openDropdown.contains(event.target)) {
                openDropdown.style.display = 'none';
            }
        }
    }
}

window.onload = function() {
    refreshMap();       // функція малювання точок
    applyPermissions();  // Перевірка прав доступу
};
