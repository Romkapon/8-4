const DUTY_LIST_KEY = 'dutyList';
const CURRENT_INDEX_KEY = 'currentDutyIndex';

const initialDutyList = [
    "Абушаев Максим",
    "Бурлаков Архип",
    "Варакин Михаил",
    "Варламов Игорь",
    "Гребнев Арсений",
    "Громов Арсений",
    "Доронин Владислав",
    "Дробышев Роман",
    "Емельянов Михаил",
    "Иванов Роман",
    "Калябина Алиса",
    "Кириков Платон",
    "Кобяков Максим",
    "Ковязин Андрей",
    "Крылова София",
    "Лавренов Александр",
    "Мамаев Алексей",
    "Машков Родион",
    "Милюков Артемий",
    "Петров Аркадий",
    "Смирнов Иван",
    "Тимченко Александр",
    "Устюгов Игорь",
    "Федоров Александр",
    "Чернышов Антон",
    "Чернявский Иван",
    "Шокова Маргарита",
    "Щерба Иван",
    "Юшка Егор"
];

function getSchoolStartDate() {
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, 8, 3);
}

document.addEventListener('DOMContentLoaded', function() {
    initializeDutySystem();
    displayDate();
});

function initializeDutySystem() {
    const today = new Date();
    const schoolStartDate = getSchoolStartDate();
    const schoolDaysPassed = countSchoolDaysSinceStart(today);
    const currentIndex = ((schoolDaysPassed - 1) * 2) % initialDutyList.length;
    const finalIndex = schoolDaysPassed >= 1 ? currentIndex : 0;
    
    saveCurrentIndex(finalIndex);
    saveDutyList([...initialDutyList]);
    displayCurrentDuty();
}

function countSchoolDaysSinceStart(date) {
    const startDate = getSchoolStartDate();
    if (date < startDate) {
        return 0;
    }
    
    let currentDate = new Date(startDate);
    let schoolDaysCount = 0;
    
    while (currentDate <= date) {
        if (currentDate.getDay() !== 0) {
            schoolDaysCount++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return schoolDaysCount;
}

function getCurrentDutyPair() {
    const dutyList = getSavedDutyList();
    const currentIndex = getCurrentIndex();
    const firstIndex = currentIndex % dutyList.length;
    const secondIndex = (currentIndex + 1) % dutyList.length;
    
    return {
        first: dutyList[firstIndex],
        second: dutyList[secondIndex],
        index: currentIndex
    };
}

function displayCurrentDuty() {
    const dutyPair = getCurrentDutyPair();
    const displayElement = document.getElementById('todayDutyPair');
    const today = new Date();
    const schoolDays = countSchoolDaysSinceStart(today);
    
    let dayInfo = '';
    if (schoolDays === 0) {
        dayInfo = 'Учебный год еще не начался (начинается 3 сентября)';
    } else {
        dayInfo = `Учебный день №${schoolDays} с 3 сентября`;
    }
    
    displayElement.innerHTML = `
        <div>👑 ${dutyPair.first}</div>
        <div>👑 ${dutyPair.second}</div>
        <div style="margin-top: 15px; font-size: 0.8em; color: #666;">
            ${dayInfo}
        </div>
    `;
}

function showFullList() {
    const dutyList = getSavedDutyList();
    const currentIndex = getCurrentIndex();
    const listElement = document.getElementById('dutyList');
    const fullListElement = document.getElementById('fullList');
    
    listElement.innerHTML = '';
    
    dutyList.forEach((person, index) => {
        const li = document.createElement('li');
        
        if (index === currentIndex || index === (currentIndex + 1) % dutyList.length) {
            li.className = 'current-duty';
            li.innerHTML = `${index + 1}. ${person} ← СЕЙЧАС ДЕЖУРЯТ`;
        } else {
            li.innerHTML = `${index + 1}. ${person}`;
        }
        
        if (index % 2 === 1 && index < dutyList.length - 1) {
            const divider = document.createElement('div');
            divider.className = 'pair-divider';
            divider.textContent = `——— Пара ${Math.floor(index/2) + 1} ———`;
            listElement.appendChild(divider);
        }
        
        listElement.appendChild(li);
    });
    
    fullListElement.style.display = 'block';
}

function displayDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    document.getElementById('dateDisplay').textContent = now.toLocaleDateString('ru-RU', options);
}

function getSavedDutyList() {
    const data = localStorage.getItem(DUTY_LIST_KEY);
    return data ? JSON.parse(data) : initialDutyList;
}

function saveDutyList(list) {
    localStorage.setItem(DUTY_LIST_KEY, JSON.stringify(list));
}

function getCurrentIndex() {
    const data = localStorage.getItem(CURRENT_INDEX_KEY);
    return data ? parseInt(JSON.parse(data)) : 0;
}

function saveCurrentIndex(index) {
    localStorage.setItem(CURRENT_INDEX_KEY, JSON.stringify(index));
}