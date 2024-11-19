let array = [];
let swappedMade = 0;
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const stepButton = document.getElementById("step-button");
const OkButton = document.getElementById("ok-button");
const InputArray = document.getElementById("Array-input");

let Size = 0;
let isSorting = false;
let isManual = false;
let i = 0, j = 0;

let MAX = 1000;  // Maximum value constraint
let MIN = 10;  // Minimum value to add to each element to ensure visibility
const SizeInput = document.getElementById("Size");

function GetSize() {
    Size = parseInt(SizeInput.value);
    SizeInput.value = '';
    if (Size > 50 || Size === "") {
        return;
        updateDebugText("Please enter a valid size value.");
    }
    generateArray();
}

function processInputArray() {
    // Get input from the user and split into an array of integers
    array = InputArray.value.trim().split(" ").map(item => {
        let num = parseInt(item.trim());
        return num;
    });

    // Check if any value is greater than 1000
    if (array.some(num => num > 1000)) {
        // Turn the terminal text red and show error message
        InputArray.style.borderColor = "red"; // Change input field border color to red
        updateDebugText("Error: Input contains values greater than 1000. Please correct the input.");
        return;
    }

    // Restore the default state of the input field
    InputArray.style.borderColor = ""; // Reset the input field border color
    OkButton.disabled = false; // Enable the OK button

    // Ensure array elements are not greater than MAX (1000)
    array = array.filter(value => value <= MAX);  // Filter out any invalid values

    if (array.length === 0) {
        updateDebugText("Please enter a valid array of numbers.");
        return;
    }

    getMax(); // Recalculate MAX after custom input
    renderArray("");
    updateDebugText("Array generated. Choose 'Automatic' or 'Manual' to start sorting.");
}

function generateArray() {
    array = Array.from({ length: Size }, () => Math.floor(Math.random() * (MAX - 10)) + 10);
    getMax(); // Recalculate MAX after generating random array
    renderArray("");
    resetIndices();
    updateDebugText("New array generated. Choose 'Automatic' or 'Manual' to start sorting.");
}

// Function to calculate the maximum value in the array
function getMax() {
    let max = 0;
    array.forEach(value => {
        max = Math.max(value, max);
    });
    MAX = Math.max(MAX, max);
    renderArray(""); // Render the array after updating the max value
}

function renderArray(text) {
    arrayContainer.innerHTML = text;

    // Add MIN value to each element to ensure visibility of smaller elements
    const adjustedArray = array.map(value => value + MIN);

    // Calculate the max value in the adjusted array
    const adjustedMax = Math.max(...adjustedArray);

    array.forEach((value, index) => {
        const span = document.createElement("span");
        const bar = document.createElement("div");
        span.classList.add("myspan");
        bar.classList.add("bar");
        span.innerHTML = value;

        // Set the height of the bar as a percentage of the adjusted maximum value
        bar.style.height = `${(adjustedArray[index] / adjustedMax) * 100}%`;  // Ensure bars are proportional

        bar.appendChild(span);
        arrayContainer.appendChild(bar);
    });
}

function updateDebugText(message) {
    debugText.innerText = message;
}

function resetIndices() {
    swappedMade = 0;
    i = 0;
    j = 0;
}

async function manualSortStep() {
    const bars = document.getElementsByClassName("bar");
    const spans = document.getElementsByClassName("myspan");

    Array.from(bars).forEach(bar => bar.style.backgroundColor = "#1b8a1f");

    if (isSorting) return;

    if (j > 0) {
        bars[j - 1].style.backgroundColor = "#1b8a1f";
        bars[j].style.backgroundColor = "#1b8a1f";
    }

    if (i >= array.length - 1) {
        updateDebugText("Array is fully sorted!");
        isSorting = false;
        stepButton.disabled = true;
        Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");
        return;
    }

    bars[j].style.backgroundColor = "#8a0a0a";
    bars[j + 1].style.backgroundColor = "#8a0a0a";

    if (array[j] > array[j + 1]) {
        swappedMade++;
        bars[j].style.backgroundColor = "blue";
        bars[j + 1].style.backgroundColor = "blue";

        let temp = spans[j].innerHTML;
        spans[j].innerHTML = spans[j + 1].innerHTML;
        spans[j + 1].innerHTML = temp;

        await new Promise((resolve) => setTimeout(resolve, 300));

        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = `${(array[j] + MIN) / MAX * 100}%`; // Adjusted with MIN
        bars[j + 1].style.height = `${(array[j + 1] + MIN) / MAX * 100}%`; // Adjusted with MIN

        updateDebugText(`Swapped elements at index ${j} and ${j + 1}`);
    } else {
        updateDebugText(`No swap needed for index ${j} and ${j + 1}`);
    }
    j++;
    if (j >= array.length - i - 1) {
        j = 0;
        i++;
    }
    IsSortedChecker();
    stepButton.disabled = false;
}

async function automaticSort() {
    isSorting = true;
    const bars = document.getElementsByClassName("bar");
    const spans = document.getElementsByClassName("myspan");
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (!isSorting || isManual) return;

            bars[j].style.backgroundColor = "#8a0a0a";
            bars[j + 1].style.backgroundColor = "#8a0a0a";

            await new Promise((resolve) => setTimeout(resolve, 200));

            if (array[j] > array[j + 1]) {
                swappedMade++;

                bars[j].style.backgroundColor = "blue";
                bars[j + 1].style.backgroundColor = "blue";
                await new Promise((resolve) => setTimeout(resolve, 200));
                let temp = spans[j].innerHTML;
                spans[j].innerHTML = spans[j + 1].innerHTML;
                spans[j + 1].innerHTML = temp;
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${(array[j] + MIN) / MAX * 100}%`; // Adjusted with MIN
                bars[j + 1].style.height = `${(array[j + 1] + MIN) / MAX * 100}%`; // Adjusted with MIN

                updateDebugText(`Swapped elements at index ${j} and ${j + 1}`);
            } else {
                updateDebugText(`No swap needed for index ${j} and ${j + 1}`);
            }

            await new Promise((resolve) => setTimeout(resolve, 300));

            bars[j].style.backgroundColor = "#1b8a1f";
            bars[j + 1].style.backgroundColor = "#1b8a1f";
        }
        if (IsSortedChecker()) {
            break;
        }
    }
}

function IsSortedChecker() {
    for (let k = 1; k < array.length; k++) {
        if (array[k] < array[k - 1]) {
            return;
        }
    }

    if (swappedMade < array.length) {
        let TAndC = `<div class="timeandspace">
        <span>Time Complexity : O(N)</span>
        <span>Space Complexity : O(1)</span>
    </div>`;
        renderArray(TAndC);
    } else {
        let TAndC = `<div class="timeandspace">
        <span>Time Complexity : O(N²)</span>
        <span>Space Complexity : O(1)</span>
    </div>`;
        renderArray(TAndC);
    }
    isSorting = false;
    updateDebugText("Array is fully sorted!");
}

function setManualMode() {
    isManual = true;
    isSorting = false;
    stepButton.disabled = false;
    resetIndices();
    updateDebugText("Manual mode activated. Use 'Step' to go forward.");
}

async function stepSort() {
    if (isManual) {
        stepButton.disabled = true;
        await new Promise((resolve) => setTimeout(manualSortStep(), 300));
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

SizeInput.addEventListener('change', GetSize);
OkButton.addEventListener("click", processInputArray);
