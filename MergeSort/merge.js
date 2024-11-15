let array = [];
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const stepButton = document.getElementById("step-button");
const startSortButton = document.getElementById("start-sort-btn");

let isSorting = false;
let isManual = false;
let currentLeft = 0, currentRight = 0;
let speed = 50;  // Initial speed for automatic sort

// Generate a new random array
function generateArray() {
    array = Array.from({ length: 20 }, () => Math.floor(Math.random() * 200) + 10);
    renderArray();
    resetIndices();
    updateDebugText("New array generated. Choose 'Automatic' or 'Manual' to start sorting.");
}

// Render the bars of the array
function renderArray() {
    arrayContainer.innerHTML = "";
    array.forEach((value) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value}px`;
        arrayContainer.appendChild(bar);
    });
}

// Update the debug panel with messages
function updateDebugText(message) {
    debugText.innerText = message;
}

// Reset the indices for manual sorting
function resetIndices() {
    currentLeft = 0;
    currentRight = array.length - 1;
}

// Set all bars to green (sorted)
function setBarsGreen() {
    const bars = document.getElementsByClassName("bar");
    Array.from(bars).forEach(bar => {
        bar.style.backgroundColor = "green";
    });
}

// Manual step-by-step merge sort
async function manualMergeSortStep() {
    // Start the recursive process for splitting
    await mergeSortStep(currentLeft, currentRight);

    if (currentLeft >= currentRight) {
        // Sorting is complete, update the debug and color bars
        updateDebugText("Array is fully sorted!");
        setBarsGreen();
        isSorting = false;
        stepButton.disabled = true; // Disable step button
    }
}

// Manual step-by-step merge sort
async function manualMergeSortStep() {
    if (currentLeft >= currentRight) {
        updateDebugText("Array is fully sorted!");
        setBarsGreen();
        isSorting = false;
        stepButton.disabled = true;
        return;
    }
    // Perform a step of merge sort
    await mergeSortStep(currentLeft, currentRight);
}

// Recursive function for merge sort steps
async function mergeSortStep(left, right) {
    if (left >= right) return; // Base case: no need to sort one element

    const mid = Math.floor((left + right) / 2);

    // Visualize the left and right subarrays
    highlightSubarrays(left, mid, right);
    await sleep(speed); // Shorter delay for smoother visualization

    // Recursively split the array into halves
    await mergeSortStep(left, mid);
    await mergeSortStep(mid + 1, right);

    // Perform the merge step after splitting
    await merge(left, mid, right);
}

// Visualize the subarrays
function highlightSubarrays(left, mid, right) {
    const bars = document.getElementsByClassName("bar");

    // Highlight left subarray
    for (let i = left; i <= mid; i++) {
        bars[i].style.backgroundColor = "yellow";
    }

    // Highlight right subarray
    for (let i = mid + 1; i <= right; i++) {
        bars[i].style.backgroundColor = "orange";
    }
}

// Merge the two halves
async function merge(left, mid, right) {
    const bars = document.getElementsByClassName("bar");
    let tempArray = [];
    let i = left, j = mid + 1;

    // Merge the subarrays
    while (i <= mid && j <= right) {
        if (array[i] <= array[j]) {
            tempArray.push(array[i]);
            bars[i].style.backgroundColor = "blue";  // Highlight as blue
            i++;
        } else {
            tempArray.push(array[j]);
            bars[j].style.backgroundColor = "blue";  // Highlight as blue
            j++;
        }
        await sleep(speed);  // Delay for visualization
    }

    // Push remaining elements from left subarray
    while (i <= mid) {
        tempArray.push(array[i]);
        i++;
    }

    // Push remaining elements from right subarray
    while (j <= right) {
        tempArray.push(array[j]);
        j++;
    }

    // Update the array with merged result
    for (let k = left; k <= right; k++) {
        array[k] = tempArray[k - left];
        bars[k].style.height = `${array[k]}px`;  // Update the bar height
    }

    await sleep(speed);  // Short delay after merging
}

// Sleep function for visual delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Switch to manual mode
function setManualMode() {
    isManual = true;
    isSorting = false;
    stepButton.disabled = false;
    resetIndices();
    updateDebugText("Manual mode activated. Use 'Step' to go forward.");
}

// Perform one step of the merge sort
function stepSort() {
    if (isManual) {
        manualMergeSortStep();
    }
}


// Automatic merge sort (continuous mode)
async function automaticMergeSort() {
    isSorting = true;
    await mergeSortStep(currentLeft, currentRight);
    setBarsGreen();
    updateDebugText("Merge sort completed!");
}

// Switch to manual mode
function setManualMode() {
    isManual = true;
    isSorting = false;
    stepButton.disabled = false;
    resetIndices();
    updateDebugText("Manual mode activated. Use 'Step' to go forward.");
}

// Perform one step of the merge sort
function stepSort() {
    if (isManual) {
        manualMergeSortStep();
    }
}

// Start the automatic sorting process
function startAutomaticSort() {
    if (!isSorting) {
        isManual = false;
        stepButton.disabled = true;
        automaticMergeSort();
    }
}

// Reset the array and UI state
function resetArray() {
    isSorting = false;
    isManual = false;
    generateArray();
}

// Initialize the array
generateArray();
