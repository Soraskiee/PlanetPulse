// ============================================
// ELEMENTS
// ============================================

const welcomeScreen =
    document.getElementById("welcomeScreen");

const targetScreen =
    document.getElementById("targetScreen");

const appScreen =
    document.getElementById("appScreen");


const startButton =
    document.getElementById("startButton");

const startTrackingButton =
    document.getElementById("startTrackingButton");


const targetInput =
    document.getElementById("targetInput");

const targetDisplay =
    document.getElementById("targetDisplay");

const editTargetButton =
    document.getElementById("editTargetButton");


const activityType =
    document.getElementById("activityType");

const quantityInput =
    document.getElementById("quantity");

const saveActivityButton =
    document.getElementById("saveActivityButton");

const calculationPreview =
    document.getElementById("calculationPreview");


const totalFootprint =
    document.getElementById("totalFootprint");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");


const transportTotal =
    document.getElementById("transportTotal");

const foodTotal =
    document.getElementById("foodTotal");

const electricityTotal =
    document.getElementById("electricityTotal");


const historyFilter =
    document.getElementById("historyFilter");

const historyDateFilter =
    document.getElementById("historyDateFilter");

const historyList =
    document.getElementById("historyList");


const addActivityButton =
    document.getElementById("addActivityButton");

const closeHistoryButton =
    document.getElementById("closeHistoryButton");

const streakButton =
    document.getElementById("streakButton");

const streakCount =
    document.getElementById("streakCount");

const challengeSection =
    document.getElementById("challengeSection");

const challengeTitle =
    document.getElementById("challengeTitle");

const challengeSubtitle =
    document.getElementById("challengeSubtitle");

const challengeList =
    document.getElementById("challengeList");

const shieldCount =
    document.getElementById("shieldCount");

const streakPopover =
    document.getElementById("streakPopover");

const streakInfoText =
    document.getElementById("streakInfoText");

const streakInfoCount =
    document.getElementById("streakInfoCount");

const streakInfoShield =
    document.getElementById("streakInfoShield");



// ============================================
// ANONYMOUS BROWSER ID
// ============================================

let clientId =
    localStorage.getItem(
        "planetPulseClientId"
    );


if (!clientId) {

    if (
        window.crypto &&
        crypto.randomUUID
    ) {

        clientId =
            crypto.randomUUID();

    } else {

        clientId =
            "client-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2);

    }


    localStorage.setItem(
        "planetPulseClientId",
        clientId
    );

}



// ============================================
// CARBON EMISSION FACTORS
// ============================================

const emissionFactors = {

    car: 0.20,

    bus: 0.08,

    flight: 0.25,

    electricity: 0.80,

    veg: 0.5,

    nonveg: 2.0

};



// ============================================
// ACTIVITY INFORMATION
// ============================================

const activityInfo = {

    car: {

        name: "Car travel",

        unit: "km",

        category: "transport",

        max: 10000

    },


    bus: {

        name: "Bus travel",

        unit: "km",

        category: "transport",

        max: 10000

    },


    flight: {

        name: "Flight",

        unit: "km",

        category: "transport",

        max: 30000

    },


    electricity: {

        name: "Electricity",

        unit: "kWh",

        category: "electricity",

        max: 10000

    },


    veg: {

        name: "Vegetarian meal",

        unit: "meal",

        category: "food",

        max: 100

    },


    nonveg: {

        name: "Non-vegetarian meal",

        unit: "meal",

        category: "food",

        max: 100

    }

};



// ============================================
// STORED ACTIVITIES
// ============================================

let activities = [];



// ============================================
// LOAD SAVED TARGET
// ============================================

const savedTarget =
    localStorage.getItem(
        "planetPulseTarget"
    );


if (
    savedTarget &&
    Number(savedTarget) > 0
) {

    targetInput.value =
        savedTarget;


    targetDisplay.textContent =
        Number(savedTarget).toFixed(1);


    welcomeScreen.style.display =
        "none";


    targetScreen.style.display =
        "none";


    appScreen.style.display =
        "block";


    loadActivities();

}



// ============================================
// WELCOME → TARGET
// ============================================

startButton.addEventListener(
    "click",
    () => {

        welcomeScreen.style.display =
            "none";


        targetScreen.style.display =
            "flex";

    }
);



// ============================================
// TARGET → APP
// ============================================

startTrackingButton.addEventListener(
    "click",
    () => {

        const target =
            Number(targetInput.value);


        if (
            !target ||
            target <= 0
        ) {

            alert(
                "Please enter a valid weekly target."
            );

            return;

        }


        localStorage.setItem(
            "planetPulseTarget",
            target
        );


        targetDisplay.textContent =
            target.toFixed(1);


        targetScreen.style.display =
            "none";


        appScreen.style.display =
            "block";


        loadActivities();

    }
);



// ============================================
// EDIT WEEKLY TARGET
// ============================================

editTargetButton.addEventListener(
    "click",
    () => {

        const currentTarget =
            Number(
                localStorage.getItem(
                    "planetPulseTarget"
                )
            ) || 40;


        const newTarget =
            prompt(
                "Set your new weekly CO₂ target (kg):",
                currentTarget
            );


        if (newTarget === null) {

            return;

        }


        const target =
            Number(newTarget);


        if (
            !target ||
            target <= 0
        ) {

            alert(
                "Please enter a valid weekly target."
            );

            return;

        }


        localStorage.setItem(
            "planetPulseTarget",
            target
        );


        targetDisplay.textContent =
            target.toFixed(1);


        updateStreak();
        updateDashboard();

    }
);



// ============================================
// ACTIVITY CALCULATION PREVIEW
// ============================================

activityType.addEventListener(
    "change",
    updateCalculationPreview
);


quantityInput.addEventListener(
    "input",
    updateCalculationPreview
);



function updateCalculationPreview() {

    const type =
        activityType.value;


    const quantity =
        Number(
            quantityInput.value
        );


    if (
        !type ||
        !quantity ||
        quantity <= 0
    ) {

        calculationPreview.textContent =
            "";

        return;

    }


    const factor =
        emissionFactors[type];


    const emission =
        quantity * factor;


    calculationPreview.textContent =
        `${emission.toFixed(2)} kg CO₂`;

}



// ============================================
// SAVE ACTIVITY
// ============================================

async function saveActivity() {

    const type =
        activityType.value;


    const quantity =
        Number(
            quantityInput.value
        );


    if (!type) {

        alert(
            "Please select an activity."
        );

        return;

    }


    if (
        !quantity ||
        quantity <= 0
    ) {

        alert(
            "Please enter a valid quantity."
        );

        return;

    }


    const info =
        activityInfo[type];


    // Decision Point 2:
    // Reject obviously unreasonable inputs.

    if (
        quantity > info.max
    ) {

        alert(
            "That quantity looks unusually high. Please check your entry."
        );

        return;

    }


    const emission =
        quantity *
        emissionFactors[type];


    try {

        const response =
            await fetch(
                "/api/activities",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        type: type,

                        quantity: quantity,

                        emission: emission,

                        client_id: clientId

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to save activity"
            );

        }


        quantityInput.value =
            "";


        calculationPreview.textContent =
            "";


        await loadActivities();


        quantityInput.focus();


    } catch (error) {

        console.error(error);


        alert(
            "Something went wrong while saving the activity."
        );

    }

}



// ============================================
// CLICK TO SAVE
// ============================================

saveActivityButton.addEventListener(
    "click",
    saveActivity
);



// ============================================
// ENTER TO SAVE
// ============================================

quantityInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            saveActivity();

        }

    }
);



// ============================================
// LOAD ACTIVITIES
// ============================================

async function loadActivities() {

    try {

        const response =
            await fetch(
                `/api/activities?client_id=${encodeURIComponent(clientId)}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load activities"
            );

        }


        const data =
            await response.json();


        activities =
            data.map(
                activity => {

                    let rawDate =
                        activity.date;


                    if (
                        typeof rawDate ===
                        "string"
                    ) {

                        rawDate =
                            rawDate.replace(
                                " ",
                                "T"
                            );

                    }


                    return {

                        ...activity,

                        date:
                            new Date(rawDate)

                    };

                }
            );


        updateStreak();

        updateDashboard();

        renderHistory();


    } catch (error) {

        console.error(error);


        alert(
            "Could not load your activities."
        );

    }

}



// ============================================
// CURRENT WEEK
// ============================================

function getCurrentWeekActivities() {

    const today =
        new Date();


    // Decision Point 3:
    // Week starts Monday.

    const day =
        today.getDay();


    const daysSinceMonday =
        day === 0
            ? 6
            : day - 1;


    const monday =
        new Date(today);


    monday.setHours(
        0,
        0,
        0,
        0
    );


    monday.setDate(
        today.getDate()
        - daysSinceMonday
    );


    const nextMonday =
        new Date(monday);


    nextMonday.setDate(
        monday.getDate() + 7
    );


    return activities.filter(
        activity =>
            activity.date >= monday &&
            activity.date < nextMonday
    );

}



// ============================================
// UPDATE DASHBOARD
// ============================================

function updateDashboard() {

    const weeklyActivities =
        getCurrentWeekActivities();


    let total = 0;

    let transport = 0;

    let food = 0;

    let electricity = 0;


    weeklyActivities.forEach(
        activity => {

            total +=
                Number(
                    activity.emission
                );


            const category =
                activityInfo[
                    activity.type
                ].category;


            if (
                category === "transport"
            ) {

                transport +=
                    Number(
                        activity.emission
                    );

            }


            if (
                category === "food"
            ) {

                food +=
                    Number(
                        activity.emission
                    );

            }


            if (
                category === "electricity"
            ) {

                electricity +=
                    Number(
                        activity.emission
                    );

            }

        }
    );


    // Main total

    totalFootprint.textContent =
        total.toFixed(1);


    // Category totals

    transportTotal.textContent =
        transport.toFixed(1);


    foodTotal.textContent =
        food.toFixed(1);


    electricityTotal.textContent =
        electricity.toFixed(1);


    updateProgress(total);
    updateChallenges();
    updateWeeklyTrend();

}



// ============================================
// WEEKLY TREND
// ============================================

function getWeekStart(date) {

    const start = new Date(date);
    const day = start.getDay();

    const daysSinceMonday =
        day === 0 ? 6 : day - 1;

    start.setHours(0, 0, 0, 0);

    start.setDate(
        start.getDate() - daysSinceMonday
    );

    return start;
}


function getWeeklyTotalForOffset(offset) {

    const start = getWeekStart(new Date());

    start.setDate(
        start.getDate() - (offset * 7)
    );

    const end = new Date(start);

    end.setDate(
        end.getDate() + 7
    );

    return activities
        .filter(
            activity =>
                activity.date >= start &&
                activity.date < end
        )
        .reduce(
            (sum, activity) =>
                sum + Number(activity.emission),
            0
        );
}


function updateWeeklyTrend() {

    const chart =
        document.getElementById(
            "weeklyTrendChart"
        );

    const currentTotal =
        document.getElementById(
            "trendCurrentTotal"
        );

    const changeText =
        document.getElementById(
            "trendChange"
        );

    if (!chart || !currentTotal || !changeText) {
        return;
    }

    // Show the current week plus the previous 3 weeks.
    const values = [
        getWeeklyTotalForOffset(3),
        getWeeklyTotalForOffset(2),
        getWeeklyTotalForOffset(1),
        getWeeklyTotalForOffset(0)
    ];

    currentTotal.textContent =
        values[3].toFixed(1);

    if (values[2] === 0 && values[3] === 0) {
        changeText.textContent = "—";
    } else if (values[2] === 0) {
        changeText.textContent = "New data";
    } else {
        const difference =
            values[3] - values[2];

        const percentage =
            (difference / values[2]) * 100;

        changeText.textContent =
            `${difference > 0 ? "+" : ""}${percentage.toFixed(0)}%`;
    }

    const width = 700;
    const height = 270;
    const left = 48;
    const right = 24;
    const top = 24;
    const bottom = 48;

    const chartWidth =
        width - left - right;

    const chartHeight =
        height - top - bottom;

    const maxValue =
        Math.max(...values, 1);

    // Give the graph some headroom.
    const yMax =
        Math.ceil(maxValue * 1.15) || 1;

    const xPositions = values.map(
        (_, index) =>
            left +
            (chartWidth / 3) * index
    );

    const yPositions = values.map(
        value =>
            top +
            chartHeight -
            (value / yMax) * chartHeight
    );

    let svg = "";

    // Horizontal grid lines.
    for (let i = 0; i <= 4; i++) {

        const value =
            (yMax / 4) * i;

        const y =
            top +
            chartHeight -
            (value / yMax) * chartHeight;

        svg += `
            <line
                class="trend-grid-line"
                x1="${left}"
                y1="${y}"
                x2="${width - right}"
                y2="${y}"
            />
            <text
                class="trend-axis-label"
                x="${left - 10}"
                y="${y + 4}"
                text-anchor="end"
            >${value.toFixed(0)}</text>
        `;
    }

    const points =
        xPositions
            .map(
                (x, index) =>
                    `${x},${yPositions[index]}`
            )
            .join(" ");

    svg += `
        <polyline
            class="trend-line"
            points="${points}"
        />
    `;

    const labels = [
        "3 weeks ago",
        "2 weeks ago",
        "Last week",
        "This week"
    ];

    values.forEach(
        (value, index) => {

            svg += `
                <circle
                    class="trend-point"
                    cx="${xPositions[index]}"
                    cy="${yPositions[index]}"
                    r="5"
                />

                <text
                    class="trend-value"
                    x="${xPositions[index]}"
                    y="${Math.max(yPositions[index] - 12, 14)}"
                    text-anchor="middle"
                >${value.toFixed(1)} kg</text>

                <text
                    class="trend-axis-label"
                    x="${xPositions[index]}"
                    y="${height - 16}"
                    text-anchor="middle"
                >${labels[index]}</text>
            `;
        }
    );

    chart.innerHTML = svg;
}


// ============================================
// WEEKLY PROGRESS
// ============================================

function updateProgress(total) {

    const target =
        Number(
            localStorage.getItem(
                "planetPulseTarget"
            )
        ) || 40;


    const percentage =
        (total / target) * 100;


    progressFill.style.width =
        `${Math.min(
            percentage,
            100
        )}%`;


    // Reset status classes

    progressFill.className =
        "progress-fill";


    progressText.className =
        "progress-text";



    // ----------------------------------------
    // BELOW 60%
    // ----------------------------------------

    if (
        percentage < 60
    ) {

        progressFill.classList.add(
            "status-good"
        );


        progressText.classList.add(
            "status-good"
        );


        progressText.textContent =
            "You're on track. Keep it up.";

    }



    // ----------------------------------------
    // 60% – 79%
    // ----------------------------------------

    else if (
        percentage < 80
    ) {

        progressFill.classList.add(
            "status-close"
        );


        progressText.classList.add(
            "status-close"
        );


        progressText.textContent =
            "You're getting close to your weekly limit.";

    }



    // ----------------------------------------
    // 80% – 99%
    // ----------------------------------------

    else if (
        percentage < 100
    ) {

        progressFill.classList.add(
            "status-warning"
        );


        progressText.classList.add(
            "status-warning"
        );


        const remaining =
            Math.max(
                target - total,
                0
            );


        progressText.textContent =
            `Warning: you're approaching your weekly limit. ${remaining.toFixed(1)} kg CO₂ remaining.`;

    }



    // ----------------------------------------
    // 100% – 119%
    // ----------------------------------------

    else if (
        percentage < 120
    ) {

        progressFill.classList.add(
            "status-over"
        );


        progressText.classList.add(
            "status-over"
        );


        progressText.textContent =
            "You've exceeded your weekly target.";

    }



    // ----------------------------------------
    // 120%+
    // ----------------------------------------

    else {

        progressFill.classList.add(
            "status-way-over"
        );


        progressText.classList.add(
            "status-way-over"
        );


        progressText.textContent =
            "Your footprint is significantly above your weekly target.";

    }

}



// ============================================
// RENDER HISTORY
// ============================================

function renderHistory() {

    const selectedType =
        historyFilter.value;


    const selectedDate =
        historyDateFilter.value;


    let filteredActivities =
        [...activities];



    // ----------------------------------------
    // FILTER BY TYPE
    // ----------------------------------------

    if (
        selectedType !== "all"
    ) {

        filteredActivities =
            filteredActivities.filter(
                activity => {

                    const category =
                        activityInfo[
                            activity.type
                        ].category;


                    return (
                        category ===
                        selectedType
                    );

                }
            );

    }



    // ----------------------------------------
    // FILTER BY DATE
    // ----------------------------------------

    if (
        selectedDate
    ) {

        filteredActivities =
            filteredActivities.filter(
                activity => {

                    const year =
                        activity.date
                            .getFullYear();


                    const month =
                        String(
                            activity.date
                                .getMonth() + 1
                        ).padStart(
                            2,
                            "0"
                        );


                    const day =
                        String(
                            activity.date
                                .getDate()
                        ).padStart(
                            2,
                            "0"
                        );


                    const localDate =
                        `${year}-${month}-${day}`;


                    return (
                        localDate ===
                        selectedDate
                    );

                }
            );

    }



    // ----------------------------------------
    // NEWEST FIRST
    // ----------------------------------------

    filteredActivities.sort(
        (a, b) =>
            b.date - a.date
    );



    // ----------------------------------------
    // CLEAR HISTORY
    // ----------------------------------------

    historyList.innerHTML =
        "";



    // ----------------------------------------
    // NO RESULTS
    // ----------------------------------------

    if (
        filteredActivities.length === 0
    ) {

        historyList.innerHTML =
            `<p class="empty-history">
                No activities found.
            </p>`;

        return;

    }



    // ----------------------------------------
    // DISPLAY ACTIVITIES
    // ----------------------------------------

    filteredActivities.forEach(
        activity => {

            const info =
                activityInfo[
                    activity.type
                ];


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "history-item";


            const dateText =
                activity.date.toLocaleDateString(
                    undefined,
                    {

                        day: "numeric",

                        month: "short",

                        year: "numeric"

                    }
                );


            const timeText =
                activity.date.toLocaleTimeString(
                    undefined,
                    {

                        hour: "numeric",

                        minute: "2-digit"

                    }
                );


            item.innerHTML = `

                <div>

                    <strong>
                        ${info.name}
                    </strong>

                    <span>
                        ${activity.quantity}
                        ${info.unit}
                    </span>

                    <small>
                        ${dateText}
                        ·
                        ${timeText}
                    </small>

                </div>


                <strong>
                    ${Number(
                        activity.emission
                    ).toFixed(2)}
                    kg
                </strong>

            `;


            historyList.appendChild(
                item
            );

        }
    );

}



// ============================================
// HISTORY FILTERS
// ============================================

historyFilter.addEventListener(
    "change",
    renderHistory
);


historyDateFilter.addEventListener(
    "change",
    renderHistory
);



// ============================================
// STREAKS + CHALLENGES
// ============================================

function getDateKey(date) {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function getYesterdayKey() {

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return getDateKey(yesterday);

}


function getDailyTotal(dateKey) {

    return activities
        .filter(activity => getDateKey(activity.date) === dateKey)
        .reduce((sum, activity) => sum + Number(activity.emission), 0);

}


function getWeeklyTarget() {

    return Number(
        localStorage.getItem("planetPulseTarget")
    ) || 40;

}


function getDailyTarget() {

    return getWeeklyTarget() / 7;

}


function isSuccessfulDay(dateKey) {

    const total = getDailyTotal(dateKey);

    // A streak day requires at least one logged activity.
    // Staying under 1/7 of the weekly target counts as a successful day.

    return total > 0 && total <= getDailyTarget();

}


function updateStreak() {

    let streak = Number(
        localStorage.getItem("planetPulseStreak")
    ) || 0;

    let shield = Number(
        localStorage.getItem("planetPulseStreakShield")
    ) || 0;

    const today = getDateKey(new Date());
    const yesterday = getYesterdayKey();
    const lastStreakDate = localStorage.getItem("planetPulseLastStreakDate");
    const todayTotal = getDailyTotal(today);

    // A day only counts once there is activity to evaluate.
    if (todayTotal === 0) {
        renderStreak(streak, shield);
        return;
    }

    // Going above the daily budget breaks an active streak.
    // A broken/empty streak does not start on an unsuccessful day.
    if (todayTotal > getDailyTarget() && lastStreakDate !== today) {
        if (streak > 0) {
            localStorage.setItem("planetPulsePreviousStreak", streak);
            streak = 0;
            localStorage.setItem("planetPulseStreak", streak);
        }

        localStorage.setItem("planetPulseLastStreakDate", today);
        renderStreak(streak, shield);
        return;
    }

    // Today's successful day has already been counted.
    if (lastStreakDate === today) {
        renderStreak(streak, shield);
        return;
    }

    if (!lastStreakDate) {
        streak = 1;
    }
    else if (lastStreakDate === yesterday && isSuccessfulDay(yesterday)) {
        streak += 1;
    }
    else if (lastStreakDate === yesterday && shield > 0) {
        // The shield bridges one unsuccessful day.
        shield -= 1;
        streak += 1;
    }
    else {
        // Keep the old streak so a comeback challenge can restore it.
        localStorage.setItem("planetPulsePreviousStreak", streak);
        streak = 0;
    }

    localStorage.setItem("planetPulseStreak", streak);
    localStorage.setItem("planetPulseStreakShield", shield);
    localStorage.setItem("planetPulseLastStreakDate", today);

    renderStreak(streak, shield);

}


function renderStreak(streak, shield) {

    streakCount.textContent = streak;
    shieldCount.textContent = shield;
    streakInfoCount.textContent = streak;
    streakInfoShield.textContent = shield;

    if (streak > 0) {
        streakInfoText.textContent =
            `Keep your daily footprint under ${getDailyTarget().toFixed(1)} kg to continue your streak.`;
    }
    else if (Number(localStorage.getItem("planetPulsePreviousStreak")) > 0) {
        streakInfoText.textContent =
            "Your streak is broken. Complete a challenge when you're approaching your limit to restore it.";
    }
    else {
        streakInfoText.textContent =
            `Log a successful day under ${getDailyTarget().toFixed(1)} kg to start your streak.`;
    }

}


function getChallengeData() {

    const weeklyActivities = getCurrentWeekActivities();
    const busTrips = weeklyActivities.filter(a => a.type === "bus").length;
    const vegMeals = weeklyActivities.filter(a => a.type === "veg").length;

    const todayKey = getDateKey(new Date());
    const todayTotal = getDailyTotal(todayKey);

    const dailyTarget = getDailyTarget();

    return [
        {
            id: "bus",
            icon: "🚌",
            title: "Choose public transport",
            description: "Log one bus trip this week.",
            progress: Math.min(busTrips, 1),
            goal: 1,
            reward: 1,
            completed: busTrips >= 1
        },
        {
            id: "meal",
            icon: "🥗",
            title: "Make one green meal",
            description: "Log two vegetarian meals this week.",
            progress: Math.min(vegMeals, 2),
            goal: 2,
            reward: 1,
            completed: vegMeals >= 2
        },
        {
            id: "day",
            icon: "🌿",
            title: "Win today",
            description: `Keep today's footprint under ${dailyTarget.toFixed(1)} kg.`,
            progress: todayTotal > 0 && todayTotal <= dailyTarget ? 1 : 0,
            goal: 1,
            reward: 1,
            completed: todayTotal > 0 && todayTotal <= dailyTarget
        }
    ];

}


function getClaimWeekKey() {

    const monday = new Date();
    const day = monday.getDay();

    const daysSinceMonday =
        day === 0 ? 6 : day - 1;

    monday.setDate(
        monday.getDate() - daysSinceMonday
    );

    return getDateKey(monday);
}


function updateChallenges() {

    if (!challengeList || !challengeSection) {
        return;
    }

    const target = getWeeklyTarget();

    const weeklyTotal =
        getCurrentWeekActivities()
            .reduce(
                (sum, activity) =>
                    sum + Number(activity.emission),
                0
            );

    const percentage =
        (weeklyTotal / target) * 100;

    /*
     * RED STATE:
     * Once the weekly target is reached/exceeded,
     * replace challenges with practical tips.
     */
    if (percentage >= 100) {

        challengeSection.classList.add(
            "challenge-visible"
        );

        challengeTitle.textContent =
            "Let's bring it back down";

        challengeSubtitle.textContent =
            "Your weekly target has been exceeded. Try these lower-carbon actions.";

        challengeList.innerHTML = `
            <div class="challenge-card">
                <div class="challenge-icon">🚍</div>
                <div class="challenge-content">
                    <strong>Choose public transport</strong>
                    <p>For your next trip, consider a bus or other shared transport.</p>
                    <a
                        class="tip-link"
                        href="https://www.un.org/actnow/food"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn about lower-carbon choices ↗
                    </a>
                </div>
            </div>

            <div class="challenge-card">
                <div class="challenge-icon">🥗</div>
                <div class="challenge-content">
                    <strong>Try a plant-based meal</strong>
                    <p>Replacing one non-vegetarian meal can reduce your food footprint.</p>
                    <a
                        class="tip-link"
                        href="https://www.un.org/actnow/food"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Food footprint tips ↗
                    </a>
                </div>
            </div>

            <div class="challenge-card">
                <div class="challenge-icon">💡</div>
                <div class="challenge-content">
                    <strong>Cut electricity use</strong>
                    <p>Switch off lights and appliances when you don't need them.</p>
                    <a
                        class="tip-link"
                        href="https://www.un.org/actnow/energy"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Energy-saving ideas ↗
                    </a>
                </div>
            </div>
        `;

        return;
    }

    /*
     * CHALLENGE STATE:
     * Challenges appear at 80%+ of the weekly target.
     */
    if (percentage < 80) {

        challengeSection.classList.remove(
            "challenge-visible"
        );

        challengeList.innerHTML = "";

        return;
    }

    const claimWeekKey =
        getClaimWeekKey();

    /*
     * Once ANY challenge has been claimed this week,
     * hide the entire challenge panel.
     */
    const challengeRewardClaimed =
        localStorage.getItem(
            `planetPulseChallengeClaimed_${claimWeekKey}`
        ) === "true";

    if (challengeRewardClaimed) {

        challengeSection.classList.remove(
            "challenge-visible"
        );

        challengeList.innerHTML = "";

        return;
    }

    challengeSection.classList.add(
        "challenge-visible"
    );

    challengeTitle.textContent =
        "You're getting close";

    challengeSubtitle.textContent =
        "Take one lower-carbon action before you hit your limit.";

    const challenges =
        getChallengeData();

    const currentStreak =
        Number(
            localStorage.getItem(
                "planetPulseStreak"
            )
        ) || 0;

    const previousStreak =
        Number(
            localStorage.getItem(
                "planetPulsePreviousStreak"
            )
        ) || 0;

    const comebackAvailable =
        currentStreak === 0 &&
        previousStreak > 0;

    challengeList.innerHTML = "";

    challenges.forEach(
        challenge => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "challenge-card" +
                (
                    challenge.completed
                        ? " challenge-complete"
                        : ""
                );

            const progressText =
                `${challenge.progress}/${challenge.goal}`;

            card.innerHTML = `
                <div class="challenge-icon">
                    ${challenge.icon}
                </div>

                <div class="challenge-content">
                    <strong>
                        ${challenge.title}
                    </strong>

                    <p>
                        ${challenge.description}
                    </p>

                    <div class="challenge-progress">
                        <span
                            style="
                                width:${(
                                    challenge.progress /
                                    challenge.goal
                                ) * 100}%
                            "
                        ></span>
                    </div>
                </div>

                <button
                    class="challenge-claim"
                    ${
                        !challenge.completed
                            ? "disabled"
                            : ""
                    }
                >
                    ${
                        challenge.completed
                            ? (
                                comebackAvailable
                                    ? "Restore streak"
                                    : "+ Shield"
                            )
                            : progressText
                    }
                </button>
            `;

            challengeList.appendChild(
                card
            );

            if (challenge.completed) {

                const button =
                    card.querySelector(
                        ".challenge-claim"
                    );

                button.addEventListener(
                    "click",
                    () => {

                        /*
                         * One reward per week.
                         * Claiming ANY challenge hides
                         * the entire panel.
                         */
                        if (
                            localStorage.getItem(
                                `planetPulseChallengeClaimed_${claimWeekKey}`
                            ) === "true"
                        ) {
                            return;
                        }

                        localStorage.setItem(
                            `planetPulseChallengeClaimed_${claimWeekKey}`,
                            "true"
                        );

                        let shield =
                            Number(
                                localStorage.getItem(
                                    "planetPulseStreakShield"
                                )
                            ) || 0;

                        let streak =
                            Number(
                                localStorage.getItem(
                                    "planetPulseStreak"
                                )
                            ) || 0;

                        // Broken streak:
                        // restore the previous streak.
                        if (
                            streak === 0
                        ) {

                            const previousStreak =
                                Number(
                                    localStorage.getItem(
                                        "planetPulsePreviousStreak"
                                    )
                                ) || 0;

                            if (
                                previousStreak > 0
                            ) {

                                streak =
                                    previousStreak;

                                localStorage.setItem(
                                    "planetPulseStreak",
                                    streak
                                );

                            } else {

                                streak = 1;

                                localStorage.setItem(
                                    "planetPulseStreak",
                                    streak
                                );
                            }

                        } else {

                            // Active streak:
                            // give one shield only.
                            shield = 1;

                            localStorage.setItem(
                                "planetPulseStreakShield",
                                shield
                            );
                        }

                        renderStreak(
                            streak,
                            shield
                        );

                        // Hide the entire challenge panel.
                        challengeSection.classList.remove(
                            "challenge-visible"
                        );

                        challengeList.innerHTML = "";
                    }
                );
            }
        }
    );
}


// ============================================
// STREAK BUTTON
// ============================================

streakButton.addEventListener(
    "click",
    () => {

        streakPopover.classList.toggle("show");

        if (challengeSection.classList.contains("challenge-visible")) {
            challengeSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

    }
);



// ============================================
// OPEN HISTORY
// ============================================

addActivityButton.addEventListener(
    "click",
    () => {

        appScreen.classList.add(
            "history-open"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);



// ============================================
// CLOSE HISTORY
// ============================================

closeHistoryButton.addEventListener(
    "click",
    () => {

        appScreen.classList.remove(
            "history-open"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);