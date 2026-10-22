
const $ = (id) => document.getElementById(id);

const nameForm = $("nameForm");
const nameInput = $("nameInput");
const welcome = $("welcome");
const result = $("result");
const error = $("error");

const greetingTitle = $("greetingTitle");
const greetingMessage = $("greetingMessage");
const hugButton = $("hugButton");
const hugMessage = $("hugMessage");
const backButton = $("backButton");

const complimentText = $("complimentText");
const complimentIcon = $("complimentIcon");
const complimentCounter = $("complimentCounter");
const complimentButton = $("complimentButton");

const gift = $("gift");
const secretTitle = $("secretTitle");
const secretText = $("secretText");
const secretButton = $("secretButton");
const secretCard = document.querySelector(".secret-card");

const musicButton = $("musicButton");
const particles = $("particles");
const toast = $("toast");

const specialNames = new Set([
    "мира",
    "хика",
    "хикари"
]);

const compliments = [
    { icon: "🌸", text: "Твоя улыбка может сделать обычный день особенным." },
    { icon: "🦋", text: "Ты заслуживаешь искреннего тепла и заботы." },
    { icon: "⭐", text: "Не забывай: даже маленькие шаги имеют значение." },
    { icon: "🌷", text: "Пусть в твоей жизни будет больше поводов радоваться." },
    { icon: "💗", text: "Ты заслуживаешь добрых слов не только по праздникам." },
    { icon: "☁️", text: "Пусть сегодня у тебя будет спокойный и приятный день." },
    { icon: "🌙", text: "Даже после трудного дня хорошие моменты ещё впереди." },
    { icon: "🫶🏻", text: "Пусть рядом будут люди, с которыми можно быть собой." },
    { icon: "✨", text: "Твои мечты заслуживают шанса стать реальностью." },
    { icon: "🎀", text: "Пожалуйста, не забывай иногда радовать и саму себя." },
    { icon: "🌈", text: "Пусть в твоих днях будет побольше приятных неожиданностей." },
    { icon: "💌", text: "Вот тебе маленькое напоминание: ты тоже важна." }
];

let complimentIndex = 0;
let giftOpened = false;
let toastTimeout;
let audioContext = null;
let musicTimer = null;
let musicEnabled = false;
let noteIndex = 0;

const melody = [
    [523.25, 0.18],
    [659.25, 0.18],
    [783.99, 0.28],
    [659.25, 0.18],
    [587.33, 0.18],
    [698.46, 0.28],
    [659.25, 0.35],
    [523.25, 0.3]
];

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

function createHearts(amount = 18) {
    const symbols = ["♡", "♥", "💕", "✧", "💗"];

    for (let i = 0; i < amount; i++) {
        const particle = document.createElement("span");

        particle.className = "particle";
        particle.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        particle.style.left = Math.random() * 100 + "%";
        particle.style.fontSize = (14 + Math.random() * 20) + "px";
        particle.style.animationDuration = (4 + Math.random() * 4) + "s";
        particle.style.animationDelay = (Math.random() * 1.3) + "s";

        particles.appendChild(particle);

        particle.addEventListener("animationend", () => {
            particle.remove();
        }, { once: true });
    }
}

function showGreeting() {
    const name = nameInput.value.trim();

    if (!name) {
        error.textContent = "Сначала напиши своё имя 💗";
        nameInput.focus();
        return;
    }

    error.textContent = "";

    const normalizedName = name.toLocaleLowerCase("ru-RU");
    const isSpecial = specialNames.has(normalizedName);

    greetingTitle.textContent = isSpecial
        ? `Ооо, привет, ${name}! 💗`
        : `Привет, ${name}! 😊`;

    greetingMessage.textContent = isSpecial
        ? "Я тебя очень сильно люблю и хочу обнять тебя 🫶🏻🫶🏻🫶🏻\n\nТы делаешь этот мир чуточку прекраснее ✨"
        : "Рад, что ты заглянул(а) сюда! Желаю тебе прекрасного дня 💖";

    welcome.classList.add("hidden");
    result.classList.remove("hidden");
    hugMessage.classList.add("hidden");
    hugButton.classList.remove("hidden");

    createHearts(28);
    showToast(isSpecial ? "Для тебя особенный сюрприз 💗" : "Добро пожаловать! ✨");

    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

nameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showGreeting();
});

nameInput.addEventListener("input", () => {
    error.textContent = "";
});

backButton.addEventListener("click", () => {
    result.classList.add("hidden");
    welcome.classList.remove("hidden");

    hugMessage.classList.add("hidden");
    hugButton.classList.remove("hidden");

    nameInput.value = "";
    error.textContent = "";

    nameInput.focus();
});

hugButton.addEventListener("click", () => {
    hugMessage.classList.remove("hidden");
    hugButton.classList.add("hidden");

    createHearts(32);
    showToast("Отправлено виртуальное объятие 🫂");

    hugMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

complimentButton.addEventListener("click", () => {
    let nextIndex;

    if (compliments.length > 1) {
        do {
            nextIndex = Math.floor(Math.random() * compliments.length);
        } while (nextIndex === complimentIndex);
    } else {
        nextIndex = 0;
    }

    complimentIndex = nextIndex;

    const item = compliments[complimentIndex];

    complimentIcon.textContent = item.icon;
    complimentText.textContent = item.text;
    complimentCounter.textContent =
        `Комплимент ${complimentIndex + 1} из ${compliments.length}`;

    createHearts(8);
});

secretButton.addEventListener("click", () => {
    if (giftOpened) {
        gift.textContent = "💖";
        secretTitle.textContent = "Подарок всё ещё твой!";
        secretText.textContent =
            "Пусть в твоей жизни будет больше добрых слов, улыбок и приятных моментов. 🫶🏻";

        createHearts(24);
        showToast("Этот сюрприз можно открывать сколько угодно 💗");
        return;
    }

    giftOpened = true;

    gift.textContent = "💝";
    secretTitle.textContent = "А вот и твой сюрприз!";
    secretText.textContent =
        "Если ты читаешь это, значит, кто-то захотел подарить тебе немного тепла. Ты заслуживаешь заботы, искренних улыбок и счастливых моментов. Пусть у тебя всё будет хорошо! 💗🫶🏻";

    secretButton.textContent = "Открыть ещё раз 💖";
    secretCard.classList.add("opened");

    createHearts(40);
    showToast("Подарок открыт! 🎁");
});

// Небольшая мелодия создаётся прямо в браузере.
// Отдельный музыкальный файл не нужен.
function playNote(frequency, duration) {
    if (!audioContext || audioContext.state !== "running") {
        return;
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
}

function stopMusic() {
    musicEnabled = false;

    if (musicTimer !== null) {
        clearInterval(musicTimer);
        musicTimer = null;
    }

    musicButton.textContent = "♪ Музыка: выкл.";
}

musicButton.addEventListener("click", async () => {
    if (musicEnabled) {
        stopMusic();
        showToast("Музыка выключена");
        return;
    }

    try {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            showToast("Этот браузер не поддерживает музыку");
            return;
        }

        if (!audioContext) {
            audioContext = new AudioContextClass();
        }

        await audioContext.resume();

        musicEnabled = true;
        musicButton.textContent = "♫ Музыка: вкл.";

        const playNextNote = () => {
            if (!musicEnabled) return;

            const [frequency, duration] = melody[noteIndex];

            playNote(frequency, duration);
            noteIndex = (noteIndex + 1) % melody.length;
        };

        playNextNote();
        musicTimer = setInterval(playNextNote, 360);

        showToast("Нежная мелодия включена ♫");
    } catch {
        stopMusic();
        showToast("Не удалось включить звук в браузере");
    }
});
createHearts(12);
