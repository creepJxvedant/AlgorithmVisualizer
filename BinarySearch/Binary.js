let array = [];
let target = null;
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const debugArrayText = document.getElementById("debug-array-text");

let isSearching = false;
let left = 0;
let right = 0;
let mid = 0;
let isManualMode = false; // To track manual mode state

const targetInput = document.getElementById("target-val");
const nextStepButton = document.getElementById("next-step-button");
const autoSearchButton = document.getElementById("auto-search-button");
const manualSearchButton = document.getElementById("manual-search-button");

// Generate an array with 20 random values between 1 and 100
function generateArray() {
    const arraySize = 20;
    const minValue = 1;
    const maxValue = 100;

    array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
    array.sort((a, b) => a - b); // Sort the array

    renderArray();
    resetIndices();
    updateDebugText("Array generated and sorted. Press 'Start Binary Search' to begin.");
    displayArrayInDebugPanel();
}

// Render the array as bars
function renderArray() {
    arrayContainer.innerHTML = "";
    const maxValue = Math.max(...array);

    array.forEach((value) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${(value / maxValue) * 100}%`;
        arrayContainer.appendChild(bar);
    });
}

// Display the array in the debug panel
function displayArrayInDebugPanel() {
    const arrayString = array.join(", ");
    debugArrayText.innerText = `Generated Array: [${arrayString}]`;
}

// Update the debug text
function updateDebugText(message) {
    debugText.innerText = message;
}

// Reset indices for binary search
function resetIndices() {
    left = 0;
    right = array.length - 1;
    mid = 0;
}

// Start the binary search process automatically
async function startAutoSearch() {
    if (isSearching || isManualMode) return;

    target = parseInt(targetInput.value);
    if (isNaN(target) || target === "") {
        updateDebugText("Please enter a valid target value.");
        return;
    }

    isSearching = true;
    updateDebugText(`Searching for value: ${target}`);

    autoSearchButton.disabled = true;
    manualSearchButton.disabled = true;
    nextStepButton.disabled = true;

    const bars = document.getElementsByClassName("bar");

    while (left <= right) {
        mid = Math.floor((left + right) / 2);

        // Highlight the current left, mid, and right
        Array.from(bars).forEach((bar, index) => {
            if (index === mid) {
                bar.style.backgroundColor = "blue";
            } else if (index === left || index === right) {
                bar.style.backgroundColor = "blue";
            } else if (index >= left && index <= right) {
                bar.style.backgroundColor = "#8a0a0a";
            } else {
                bar.style.backgroundColor = "#1b8a1f";
            }
        });

        updateDebugText(`Left: ${array[left]}, Mid: ${array[mid]}, Right: ${array[right]}`);

        if (array[mid] === target) {
            Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");
            updateDebugText(`Target found at index ${mid}!`);
            break;
        } else if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (left > right) {
        updateDebugText("Target not found in the array.");
    }

    isSearching = false;
    autoSearchButton.disabled = false;
    manualSearchButton.disabled = false;
}

// Start the binary search process manually
async function startManualSearch() {
    if (isSearching || isManualMode) return;

    target = parseInt(targetInput.value);
    if (isNaN(target) || target === "") {
        updateDebugText("Please enter a valid target value.");
        return;
    }

    isManualMode = true;
    isSearching = true;
    updateDebugText(`Searching for value: ${target}`);

    autoSearchButton.disabled = true;
    manualSearchButton.disabled = true;
    nextStepButton.disabled = false;

    const bars = document.getElementsByClassName("bar");

    // Initial step of binary search
    Array.from(bars).forEach((bar, index) => {
        if (index === mid) {
            bar.style.backgroundColor = "blue";
        } else if (index === left || index === right) {
            bar.style.backgroundColor = "blue";
        } else if (index >= left && index <= right) {
            bar.style.backgroundColor = "#8a0a0a";
        } else {
            bar.style.backgroundColor = "#1b8a1f";
        }
    });

    updateDebugText(`Left: ${array[left]}, Mid: ${array[mid]}, Right: ${array[right]}`);
}

// Handle next step in binary search manually
async function nextStep() {
    if (!isSearching || !isManualMode) return;

    const bars = document.getElementsByClassName("bar");

    // Highlight the current left, mid, and right
    Array.from(bars).forEach((bar, index) => {
        if (index === mid) {
            bar.style.backgroundColor = "blue";
        } else if (index === left || index === right) {
            bar.style.backgroundColor = "blue";
        } else if (index >= left && index <= right) {
            bar.style.backgroundColor = "#8a0a0a";
        } else {
            bar.style.backgroundColor = "#1b8a1f";
        }
    });

    updateDebugText(`Left: ${array[left]}, Mid: ${array[mid]}, Right: ${array[right]}`);

    if (array[mid] === target) {
        Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");
        updateDebugText(`Target found at index ${mid}!`);
        isSearching = false;
        nextStepButton.disabled = true;
        return;
    } else if (array[mid] < target) {
        left = mid + 1;
    } else {
        right = mid - 1;
    }

    mid = Math.floor((left + right) / 2); // Calculate the new mid

    // Wait for the next step (0.5s delay)
    await new Promise((resolve) => setTimeout(resolve, 500));
}

// Reset the array and start over
function resetArray() {
    isSearching = false;
    isManualMode = false;
    generateArray();
    nextStepButton.disabled = true;
    autoSearchButton.disabled = false;
    manualSearchButton.disabled = false;
}

// Initial array generation
generateArray();
