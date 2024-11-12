let array = [];
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const stepButton = document.getElementById("step-button");

let isSorting = false;
let isManual = false;
let i = 0, j = 0;

function generateArray() {
    array = Array.from({ length: 20 }, () => Math.floor(Math.random() * 200) + 10);
    renderArray();
    resetIndices();
    updateDebugText("New array generated. Choose 'Automatic' or 'Manual' to start sorting.");
}

function renderArray() {
    arrayContainer.innerHTML = "";
    array.forEach((value) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value}px`;
        arrayContainer.appendChild(bar);
    });
}

function updateDebugText(message) {
    debugText.innerText = message;
}

function resetIndices() {
    i = 0;
    j = 0;
}

async function manualSortStep() {
    if (isSorting) return; // Prevents running if automatic sorting is active

    const bars = document.getElementsByClassName("bar");
    Array.from(bars).forEach(bar => bar.style.backgroundColor = "#4CAF50");

    if (i >= array.length - 1) {
        updateDebugText("Array is fully sorted!");
        isSorting = false;
        stepButton.disabled = true;
        Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");
        return;
    }

    bars[j].style.backgroundColor = "red";
    bars[j + 1].style.backgroundColor = "red";

    if (array[j] > array[j + 1]) {
        bars[j].style.backgroundColor = "blue";
        bars[j + 1].style.backgroundColor = "blue";

        await new Promise((resolve) => setTimeout(resolve, 300));
        
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = `${array[j]}px`;
        bars[j + 1].style.height = `${array[j + 1]}px`;

        updateDebugText(`Swapped elements at index ${j} and ${j + 1}`);
    } else {
        updateDebugText(`No swap needed for index ${j} and ${j + 1}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    bars[j].style.backgroundColor = "#4CAF50";
    bars[j + 1].style.backgroundColor = "#4CAF50";
    j++;
    if (j >= array.length - i - 1) {  
        j = 0;
        i++;
    }
}

async function automaticSort() {
    isSorting = true;
    const bars = document.getElementsByClassName("bar");

    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (!isSorting || isManual) return;

            bars[j].style.backgroundColor = "red";
            bars[j + 1].style.backgroundColor = "red";

            await new Promise((resolve) => setTimeout(resolve, 200));

            if (array[j] > array[j + 1]) {
                bars[j].style.backgroundColor = "blue";
                bars[j + 1].style.backgroundColor = "blue";

                await new Promise((resolve) => setTimeout(resolve, 300));
                
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${array[j]}px`;
                bars[j + 1].style.height = `${array[j + 1]}px`;

                updateDebugText(`Swapped elements at index ${j} and ${j + 1}`);
            } else {
                updateDebugText(`No swap needed for index ${j} and ${j + 1}`);
            }

            await new Promise((resolve) => setTimeout(resolve, 300));

            bars[j].style.backgroundColor = "#4CAF50";
            bars[j + 1].style.backgroundColor = "#4CAF50";
        }
    }

    updateDebugText("Array is fully sorted!");
    Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");
    isSorting = false;
}

function setManualMode() {
    isManual = true;
    isSorting = false; // Stop automatic sorting
    stepButton.disabled = false;
    resetIndices();
    updateDebugText("Manual mode activated. Use 'Step' to go forward.");
}

function stepSort() {
    if (isManual) {
        manualSortStep();
    }
}

function startAutomaticSort() {
    if (!isSorting) {
        isManual = false;
        stepButton.disabled = true;
        isSorting = true;
        automaticSort();
    }
}

function resetArray() {
    isSorting = false;
    isManual = false;
    generateArray();
}

// Initial array generation
generateArray();
