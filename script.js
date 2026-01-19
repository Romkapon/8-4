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
    const now = new Date();
    let year = now.getFullYear();
    // Если сентябрь ещё не наступил в этом году, используем прошлый год
    if (now.getMonth() < 8 || (now.getMonth() === 8 && now.getDate() < 3)) {
        year -= 1;
    }
    return new Date(year, 8, 3); // 3 сентября
}

document.addEventListener('DOMContentLoaded', function () {
    initializeDutySystem();
    displayDate();
});

function countSchoolDaysSinceStart(date) {
    const startDate = getSchoolStartDate();
    if (date < startDate) return 0;

    let count = 0;
    const current = new Date(startDate);

    while (current <= date) {
        const day = current.getDay();
        // Учебные дни: понедельник (1) – суббота (6), воскресенье (0) — выходной
        if (day !== 0) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }
    return count;
}

function initializeDutySystem() {
    const today = new Date();
    const schoolDays = countSchoolDaysSinceStart(today);
    
    // Каждая пара дежурит один день → индекс пары = schoolDays - 1
    // Индекс первого дежурного = (schoolDays - 1) * 2
    let startIndex = schoolDays > 0 ? ((schoolDays - 1) * 2) % initialDutyList.length : 0;

    saveCurrentIndex(startIndex);
    saveDutyList([...initialDutyList]);
    displayCurrentDuty();
}

function getCurrentDutyPair() {
    const list = getSavedDutyList();
    const idx = getCurrentIndex();
    return {
        first: list[idx % list.length],
        second: list[(idx + 1) % list.length],
        startIndex: idx
    };
}

function displayCurrentDuty() {
    const pair = getCurrentDutyPair();
    const today = new Date();
    const schoolDays = countSchoolDaysSinceStart(today);
    const display = document.getElementById('todayDutyPair');

    if (schoolDays === 0) {
        display.innerHTML = `<div style="color:#d32f2f;">Учебный год ещё не начался (начинается 3 сентября)</div>`;
    } else {
        display.innerHTML = `
            <div>👑 ${pair.first}</div>
            <div>👑 ${pair.second}</div>
            <div style="margin-top: 15px; font-size: 0.9em; color: var(--text-light);">
                Учебный день №${schoolDays} с 3 сентября
            </div>
        `;
    }
}

function showFullList() {
    const list = getSavedDutyList();
    const currentIndex = getCurrentIndex();
    const ol = document.getElementById('dutyList');
    const fullList = document.getElementById('fullList');

    ol.innerHTML = '';

    for (let i = 0; i < list.length; i++) {
        const li = document.createElement('li');
        const isCurrent = i === currentIndex || i === (currentIndex + 1) % list.length;

        if (isCurrent) {
            li.className = 'current-duty';
            li.textContent = `${i + 1}. ${list[i]} ← СЕЙЧАС ДЕЖУРЯТ`;
        } else {
            li.textContent = `${i + 1}. ${list[i]}`;
        }

        // Добавляем разделитель после каждой пары (после нечётных индексов: 1, 3, 5...)
        if (i % 2 === 1 && i < list.length - 1) {
            const divider = document.createElement('div');
            divider.className = 'pair-divider';
            divider.textContent = `——— Пара ${Math.floor(i / 2) + 1} ———`;
            ol.appendChild(divider);
        }

        ol.appendChild(li);
    }

    fullList.style.display = 'block';
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

// --- localStorage helpers ---
function getSavedDutyList() {
    const data = localStorage.getItem(DUTY_LIST_KEY);
    return data ? JSON.parse(data) : [...initialDutyList];
}

function saveDutyList(list) {
    localStorage.setItem(DUTY_LIST_KEY, JSON.stringify(list));
}

function getCurrentIndex() {
    const data = localStorage.getItem(CURRENT_INDEX_KEY);
    return data ? parseInt(data, 10) : 0;
}

function saveCurrentIndex(index) {
    localStorage.setItem(CURRENT_INDEX_KEY, index.toString());
}