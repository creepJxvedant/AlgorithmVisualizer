// JavaScript code to implement Heap Sort visualization

let array = [];
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const stepButton = document.getElementById("step-button");
let isSorting = false;
let isManual = false;
let i = 0; // Manual sort step tracker

// Generate a random array
function generateArray() {
    array = Array.from({ length: 40 }, () => Math.floor(Math.random() * 200) + 10);
    renderArray();
    resetIndices();
    updateDebugText("New array generated. Choose 'Automatic' or 'Manual' to start sorting.");
}

// Render array as bars
function renderArray() {
    arrayContainer.innerHTML = "";
    array.forEach((value) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value}px`;
        arrayContainer.appendChild(bar);
    });
}

// Update the debug info
function updateDebugText(message) {
    debugText.innerText = message;
}

// Reset manual indices
function resetIndices() {
    i = 0;
}

// Set all bars to green when sorted
function setBarsGreen() {
    const bars = document.getElementsByClassName("bar");
    Array.from(bars).forEach(bar => {
        bar.style.backgroundColor = "green";
    });
}

// Swap two elements and update the bars
function swapBars(i, j) {
    const bars = document.getElementsByClassName("bar");
    let tempHeight = bars[i].style.height;
    bars[i].style.height = bars[j].style.height;
    bars[j].style.height = tempHeight;

    let tempValue = array[i];
    array[i] = array[j];
    array[j] = tempValue;
}

// Heapify the tree rooted at index `i` with `length` size
async function heapify(i, length) {
    const bars = document.getElementsByClassName("bar");

    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < length && array[left] > array[largest]) {
        largest = left;
    }

    if (right < length && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        // Highlight bars involved in swap
        bars[i].style.backgroundColor = "red";
        bars[largest].style.backgroundColor = "blue";

        // Swap elements
        swapBars(i, largest);
        updateDebugText(`Swapped elements at index ${i} and ${largest}`);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Heapify the affected subtree
        await heapify(largest, length);
    }
}

// Build the max heap
async function buildMaxHeap() {
    const length = array.length;
    for (let i = Math.floor(length / 2) - 1; i >= 0; i--) {
        await heapify(i, length);
    }
}

// Automatic heap sort
async function automaticHeapSort() {
    isSorting = true;
    const length = array.length;
    const bars = document.getElementsByClassName("bar");

    await buildMaxHeap(); // Build the max heap

    // Perform the heap sort
    for (let i = length - 1; i > 0; i--) {
        swapBars(0, i); // Swap the root (max element) with the last element

        bars[i].style.backgroundColor = "purple";
        bars[0].style.backgroundColor = "red";
        updateDebugText(`Moved max element to index ${i}`);
        await new Promise(resolve => setTimeout(resolve, 500));

        await heapify(0, i); // Re-heapify the root

        bars[i].style.backgroundColor = "#4CAF50"; // Mark the sorted element as green
    }

    setBarsGreen();
    updateDebugText("Array is fully sorted!");
}

// Manual step-by-step heap sort
async function manualHeapSortStep() {
    const bars = document.getElementsByClassName("bar");

    // If the array is fully sorted, stop
    if (i >= array.length - 1) {
        setBarsGreen();
        updateDebugText("Array is fully sorted!");
        stepButton.disabled = true; // Disable step button once sorted
        return;
    }

    // First, we need to ensure the max heap is built at the beginning
    if (i === 0) {
        await buildMaxHeap();
        updateDebugText("Max Heap built. Starting sorting...");
    }

    // Perform a single heapify operation for the root
    await heapifyStep(i);

    // After heapifying, we swap the root with the last unsorted element
    if (i > 0) {
        swapBars(0, array.length - 1 - i);
        const bars = document.getElementsByClassName("bar");
        bars[i].style.backgroundColor = "purple"; // Color the sorted bar
        bars[0].style.backgroundColor = "red"; // Color the root bar
        updateDebugText(`Moved max element to index ${array.length - 1 - i}`);
    }

    i++; // Move to the next step
}

// Perform a single heapify step for manual mode
async function heapifyStep(i) {
    const bars = document.getElementsByClassName("bar");

    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    // Check if left child is larger than the root
    if (left < array.length && array[left] > array[largest]) {
        largest = left;
    }

    // Check if right child is larger than the largest so far
    if (right < array.length && array[right] > array[largest]) {
        largest = right;
    }

    // If the largest element is not the root, swap and continue heapifying
    if (largest !== i) {
        // Color the involved bars
        bars[i].style.backgroundColor = "red";  // Root bar
        bars[largest].style.backgroundColor = "blue";  // Largest child

        // Swap the elements
        swapBars(i, largest);

        // Call heapify recursively on the affected subtree
        await new Promise(resolve => setTimeout(resolve, 300)); // Add delay to visualize
        await heapifyStep(largest);
    } else {
        // If heapify step is done, color the current bar green to indicate it's processed
        bars[i].style.backgroundColor = "green";
    }
}


// Activate manual mode
function setManualMode() {
    isManual = true;
    isSorting = false;
    stepButton.disabled = false;
    resetIndices();
    updateDebugText("Manual mode activated. Use 'Step' to go forward.");
}

// Step through the sorting process in manual mode
function stepSort() {
    if (isManual) {
        manualHeapSortStep();
    }
}

// Start the automatic sorting process
function startAutomaticSort() {
    if (!isSorting) {
        isManual = false;
        stepButton.disabled = true;
        automaticHeapSort();
    }
}

// Reset the array
function resetArray() {
    isSorting = false;
    isManual = false;
    stepButton.disabled = false;
    generateArray();
    updateDebugText("Array reset. Choose a sorting mode.");
}

// Event listeners
stepButton.addEventListener("click", stepSort);
document.querySelector("button[onclick='startAutomaticSort()']").addEventListener("click", startAutomaticSort);
document.querySelector("button[onclick='resetArray()']").addEventListener("click", resetArray);

// Initialize the array
generateArray();
