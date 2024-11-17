let array = [];
const TAndC=`<div class="timeandspace">
            <span>Time Complexity : O(N2)</span>
            <span>Space Complexity : O(1)</span>
        </div>`;
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const stepButton = document.getElementById("step-button");
let Size=0;
let isSorting = false;
let isManual = false;
let i = 1, j = 0;
const SizeInput= document.getElementById("Size");

function GetSize(){
    Size = parseInt(SizeInput.value);
     SizeInput.value = '';
    if (Size>50 || Size === "") {
        updateDebugText("Please enter a valid size value.");
    }
    generateArray();
    }

function generateArray() {
    array = Array.from({ length: 40 }, () => Math.floor(Math.random() * 200) + 10);
    renderArray();
    resetIndices();
    updateDebugText("New array generated. Choose 'Automatic' or 'Manual' to start sorting.");
}

function renderArray() {
    arrayContainer.innerHTML = TAndC;
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
    i = 1;
    j = i;
}

function setBarsGreen() {
    const bars = document.getElementsByClassName("bar");
    Array.from(bars).forEach(bar => {
        bar.style.backgroundColor = "green";
    });
}

// Manual mode step-by-step insertion sort
async function manualSortStep() {
    const bars = document.getElementsByClassName("bar");

    // Reset all bars to green at the beginning of each step
    Array.from(bars).forEach(bar => bar.style.backgroundColor = "#4CAF50");

    // If the array is fully sorted, indicate completion and exit
    if (i >= array.length) {
        updateDebugText("Array is fully sorted!");
        setBarsGreen();  // Turn all bars green when sorting is complete
        isSorting = false;
        stepButton.disabled = true;  // Disable the step button after sorting is complete
        return;
    }

    let key = array[i];
    bars[i].style.backgroundColor = "red";  // Highlight the key element as red

    // Compare key with the previous elements (insertion sort logic)
    while (j > 0 && array[j - 1] > key) {
        // Highlight the compared element as blue
        bars[j - 1].style.backgroundColor = "blue";

        // Move the larger element one step to the right
        array[j] = array[j - 1];
        bars[j].style.height = `${array[j]}px`;  // Update the height of the moved bar

        updateDebugText(`Moved element at index ${j - 1} to index ${j}`);

        // Move to the previous element
        j--;
    }

    // Once the correct position for the key is found, insert it
    array[j] = key;
    bars[j].style.height = `${key}px`;  // Update the height for the inserted key
    updateDebugText(`Inserted key ${key} at index ${j}`);

    // Move to the next index for the key
    i++;
    j = i;  // Reset j to the current value of i for the next iteration
}


// Automatic insertion sort
async function automaticSort() {
    isSorting = true;
    const bars = document.getElementsByClassName("bar");

    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        
        bars[i].style.backgroundColor = "red";

        while (j >= 0 && array[j] > key) {
            bars[j].style.backgroundColor = "blue";
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1]}px`;
            j--;

            await new Promise((resolve) => setTimeout(resolve, 300));
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${key}px`;
        bars[i].style.backgroundColor = "#4CAF50";
        updateDebugText(`Inserted key ${key} at index ${j + 1}`);

        if (!isSorting) return;
    }

    setBarsGreen();  // Turn all bars green when sorting is complete
    updateDebugText("Array is fully sorted!");
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
        manualSortStep();
    }
}

function startAutomaticSort() {
    if (!isSorting) {
        isManual = false;
        stepButton.disabled = true;
        automaticSort();
    }
}

function resetArray() {
    isSorting = false;
    isManual = false;
    generateArray();
}

SizeInput.addEventListener('change', GetSize);