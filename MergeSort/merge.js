let array = [];
const TANDC= `<div class="timeandspace">
<span>Time Complexity : O(nlog(n))</span>
<span>Space Complexity : O(n)</span>
</div>`;
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const stepButton = document.getElementById("step-button");

let Size = 0;
let isSorting = false;
let isManual = false;
let currentLeft = 0,
    currentRight = 0;
let speed = 200; // Initial speed for automatic sort
let currentStack = []; // Stack to manage recursive calls for manual mode
const SizeInput = document.getElementById("Size");

function GetSize() {
    Size = parseInt(SizeInput.value);
    SizeInput.value = "";
    if (Size > 50 || Size === "" || Size <= 0) {
        updateDebugText("Please enter a valid size value between 1 and 50.");
        return;
    }
    generateArray();
}

function generateArray() {
    array = Array.from({ length: Size }, () => Math.floor(Math.random() * 200) + 10);
    renderArray();
    resetIndices();
    updateDebugText("New array generated. Choose 'Automatic' or 'Manual' to start sorting.");
}

function renderArray() {
    const maxValue = Math.max(...array); // Find the maximum value for scaling
    arrayContainer.innerHTML = TANDC;
    array.forEach((value) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${(value / maxValue) * 100}%`; // Scale height as a percentage
        arrayContainer.appendChild(bar);
    });
}

function updateDebugText(message) {
    debugText.innerText = message;
}

function resetIndices() {
    currentLeft = 0;
    currentRight = array.length - 1;
    currentStack = [];
}

function setBarsGreen() {
    const bars = document.getElementsByClassName("bar");
    Array.from(bars).forEach((bar) => {
        bar.style.backgroundColor = "green";
    });
}

async function manualMergeSortStep() {
    if (!currentStack.length) {
        currentStack.push({ left: currentLeft, right: currentRight });
    }

    const { left, right } = currentStack.pop();
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    currentStack.push({ left: mid + 1, right }); // Right part
    currentStack.push({ left, right: mid }); // Left part
    highlightSubarrays(left, mid, right);

    // Merge step
    stepButton.disabled=true;
    await Manualmerge(left, mid, right);
    renderArray();

    if (!currentStack.length) {
        setBarsGreen();
        updateDebugText("Array is fully sorted!");
        isSorting = false;
        stepButton.disabled = true;
    }
}

async function mergeSortStep(left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    await mergeSortStep(left, mid);
    await mergeSortStep(mid + 1, right);
    await merge(left, mid, right);
}


async function Manualmerge(left, mid, right) {
    const bars = document.getElementsByClassName("bar");
    const tempArray = [];
    let i = left,
        j = mid + 1;

    while (i <= mid && j <= right) {
        if (array[i] <= array[j]) {
            tempArray.push(array[i]);
            bars[i].style.backgroundColor = "blue";
            i++;
        } else {
            tempArray.push(array[j]);
            bars[j].style.backgroundColor = "blue";
            j++;
        }
        await sleep(speed);
    }

    while (i <= mid) {
        tempArray.push(array[i]);
        i++;
    }

    while (j <= right) {
        tempArray.push(array[j]);
        j++;
    }

    for (let k = left; k <= right; k++) {
        array[k] = tempArray[k - left];
        bars[k].style.height = `${(array[k] / Math.max(...array)) * 100}%`;
        bars[k].style.backgroundColor = "lightgreen";
    }
    stepButton.disabled=false;
}




function highlightSubarrays(left, mid, right) {
    const bars = document.getElementsByClassName("bar");
    for (let i = left; i <= mid; i++) {
        bars[i].style.backgroundColor = "yellow";
    }
    for (let i = mid + 1; i <= right; i++) {
        bars[i].style.backgroundColor = "orange";
    }
}

async function merge(left, mid, right) {
    const bars = document.getElementsByClassName("bar");
    const tempArray = [];
    let i = left,
        j = mid + 1;

    while (i <= mid && j <= right) {
        if (array[i] <= array[j]) {
            tempArray.push(array[i]);
            bars[i].style.backgroundColor = "blue";
            i++;
        } else {
            tempArray.push(array[j]);
            bars[j].style.backgroundColor = "blue";
            j++;
        }
        await sleep(speed);
    }

    while (i <= mid) {
        tempArray.push(array[i]);
        i++;
    }

    while (j <= right) {
        tempArray.push(array[j]);
        j++;
    }

    for (let k = left; k <= right; k++) {
        array[k] = tempArray[k - left];
        bars[k].style.height = `${(array[k] / Math.max(...array)) * 100}%`;
        bars[k].style.backgroundColor = "lightgreen";
    }
    await sleep(speed);
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function setManualMode() {
    isManual = true;
    isSorting = false;
    stepButton.disabled = false;
    resetIndices();
    updateDebugText("Manual mode activated. Use 'Step' to go forward.");
}

function stepSort() {
    if (isManual) {
        manualMergeSortStep();
    }
}

async function automaticMergeSort() {
    isSorting = true;
    await mergeSortStep(currentLeft, currentRight);
    setBarsGreen();
    updateDebugText("Merge sort completed!");
}

function startAutomaticSort() {
    if (!isSorting) {
        isManual = false;
        stepButton.disabled = true;
        automaticMergeSort();
    }
}

function resetArray() {
    isSorting = false;
    isManual = false;
    generateArray();
}

SizeInput.addEventListener("change", GetSize);
