let array = [];
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const stepButton = document.getElementById("step-button");

let isSorting = false;
let isManual = false;
let i = 0, j = 0, pivotIndex = -1;

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
    pivotIndex = -1;
}

async function manualSortStep() {
    if (isSorting) return; // Prevents running if automatic sorting is active

    const bars = document.getElementsByClassName("bar");

    // Reset all bars to green
    Array.from(bars).forEach(bar => bar.style.backgroundColor = "#4CAF50");

    if (i >= array.length) {
        updateDebugText("Array is fully sorted!");
        isSorting = false;
        stepButton.disabled = true;
        Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");
        return;
    }

    // Highlight the pivot and comparison elements
    bars[pivotIndex].style.backgroundColor = "red";

    if (array[j] < array[pivotIndex]) {
        // Swap the elements (blue highlight)
        [array[i], array[j]] = [array[j], array[i]];
        bars[i].style.height = `${array[i]}px`;
        bars[j].style.height = `${array[j]}px`;

        bars[i].style.backgroundColor = "blue";
        bars[j].style.backgroundColor = "blue";

        updateDebugText(`Swapped elements at index ${i} and ${j}`);
        i++;
    }

    // Wait before proceeding
    await new Promise(resolve => setTimeout(resolve, 500));

    bars[j].style.backgroundColor = "#4CAF50";
    j++;

    if (j >= array.length) {
        // Swap the pivot element to the correct position
        [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
        bars[i].style.height = `${array[i]}px`;
        bars[pivotIndex].style.height = `${array[pivotIndex]}px`;

        updateDebugText(`Placed pivot at index ${i}`);
        pivotIndex = i + 1;
        i = 0;
        j = pivotIndex;
    }
}

async function automaticSort() {
    isSorting = true;
    const bars = document.getElementsByClassName("bar");

    await quickSort(0, array.length - 1, bars);

    // Final color change when sorting is done
    updateDebugText("Array is fully sorted!");
    Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");
    isSorting = false;
}

async function quickSort(low, high, bars) {
    if (low < high) {
        const pi = await partition(low, high, bars);
        await quickSort(low, pi - 1, bars); // Sort left part
        await quickSort(pi + 1, high, bars); // Sort right part
    }
}

async function partition(low, high, bars) {
    let pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        bars[j].style.backgroundColor = "red"; // Highlight element being compared
        await new Promise(resolve => setTimeout(resolve, 200));

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];

            bars[i].style.height = `${array[i]}px`;
            bars[j].style.height = `${array[j]}px`;
            bars[i].style.backgroundColor = "blue"; // Swap highlighted element
        }
        bars[j].style.backgroundColor = "#4CAF50"; // Reset bar color
    }

    // Place pivot in the correct position
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    bars[i + 1].style.height = `${array[i + 1]}px`;
    bars[high].style.height = `${array[high]}px`;

    return i + 1;
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
