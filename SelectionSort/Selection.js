let array = [];
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const stepButton = document.getElementById("step-button");

let isSorting = false;
let isManual = false;
let i = 0, j = 0, minIndex = 0;

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
    minIndex = 0;
}

async function manualSortStep() {
    if (isSorting) return; // Prevents running if automatic sorting is active

    // Disable the "Next Step" button to prevent rapid clicking
    stepButton.disabled = true;

    const bars = document.getElementsByClassName("bar");

    // Reset all bars to default state (green) at the beginning of each step
    Array.from(bars).forEach(bar => bar.style.backgroundColor = "#4CAF50");

    if (i >= array.length - 1) {
        // If sorting is complete, change the bars to green after sorting is done
        updateDebugText("Array is fully sorted!");
        isSorting = false;
        stepButton.disabled = true; // Disable the Step button after sorting is complete

        // Final pass to change all bars to green to indicate sorted array
        Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");

        // Re-enable the step button after the last step
        stepButton.disabled = false;
        return;
    }

    // Highlight the current element at index 'i' and the candidate element at index 'j' as blue
    bars[i].style.backgroundColor = "blue"; // Highlight the element at index 'i'
    bars[minIndex].style.backgroundColor = "blue"; // Highlight the element at minIndex in blue

    // Highlight the candidate element at index 'j' with crimson for comparison
    bars[j].style.backgroundColor = "crimson"; // Highlight the element at index 'j' (candidate for min)

    // If we find a smaller value, update the minIndex
    if (array[j] < array[minIndex]) {
        // Reset the previous minIndex (if it was not i) and update minIndex to j
        if (minIndex !== i) {
            bars[minIndex].style.backgroundColor = "#4CAF50"; // Reset the previous minIndex element to green
        }
        minIndex = j; // Update the minIndex to the new smallest element
    }

    await new Promise(resolve => setTimeout(resolve, 300)); // Delay for smoothness

    j++; // Increment j to move to the next candidate for comparison

    // Once the inner loop finishes (when j >= array.length), we perform the swap
    if (j >= array.length) {
        // Only perform the swap once the entire inner loop is done
        if (minIndex !== i) {
            // Highlight the swap (swap elements at i and minIndex)
            bars[minIndex].style.backgroundColor = "blue"; // Element to swap
            bars[i].style.backgroundColor = "blue"; // Element at index i to swap with

            await new Promise(resolve => setTimeout(resolve, 300)); // Delay before swapping

            // Swap the elements in the array and update their heights
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            bars[i].style.height = `${array[i]}px`;
            bars[minIndex].style.height = `${array[minIndex]}px`;

            updateDebugText(`Swapped elements at index ${i} and ${minIndex}`);
        }

        // After completing the pass, move to the next index
        minIndex = i + 1;
        i++;
        j = i + 1; // Start the inner loop from the next index
    }

    await new Promise(resolve => setTimeout(resolve, 300)); // Delay to allow visualization

    // After completing the inner loop, reset the candidate element `j` back to green, but leave `i` and `minIndex` blue
    if (j < array.length) {
        bars[j].style.backgroundColor = "#4CAF50"; // Reset the candidate element to green
    }

    // Re-enable the step button after the step is completed
    stepButton.disabled = false;
}




async function automaticSort() {
    // Reset the bars' colors before starting automatic sorting
    resetBars(); 

    isSorting = true;
    const bars = document.getElementsByClassName("bar");

    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (!isSorting) return; // Stop if sorting is disabled

            // Highlight the current elements being compared (red)
            bars[minIndex].style.backgroundColor = "blue";
            bars[j].style.backgroundColor = "crimson";

            // Wait for a smooth transition
            await new Promise(resolve => setTimeout(resolve, 300));

            if (array[j] < array[minIndex]) {
                // Reset the previous minimum element to green
                if (minIndex !== i) {
                    bars[minIndex].style.backgroundColor = "#4CAF50";
                }

                // Update minIndex to the new smallest element
                minIndex = j;
            }

            // Wait for smooth transition after comparison
            await new Promise(resolve => setTimeout(resolve, 300));

            // Reset the compared elements back to green
            bars[minIndex].style.backgroundColor = "#4CAF50";
            bars[j].style.backgroundColor = "#4CAF50";
        }

        // Swap the elements if necessary
        if (minIndex !== i) {
            // Highlight the two elements that will be swapped (blue)
            bars[minIndex].style.backgroundColor = "blue";
            bars[i].style.backgroundColor = "blue";

            // Wait for the smooth transition before swapping
            await new Promise(resolve => setTimeout(resolve, 300));

            // Perform the swap
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            bars[i].style.height = `${array[i]}px`;
            bars[minIndex].style.height = `${array[minIndex]}px`;

            updateDebugText(`Swapped elements at index ${i} and ${minIndex}`);
        }

        // Reset the swapped elements back to green
        bars[i].style.backgroundColor = "#4CAF50";
        bars[minIndex].style.backgroundColor = "#4CAF50";
    }

    // Once sorting is complete, update all bars to green to indicate sorting is done
    updateDebugText("Array is fully sorted!");
    Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");

    isSorting = false;
}

// Reset bars to green when switching sorting methods (manual -> automatic)
function resetBars() {
    const bars = document.getElementsByClassName("bar");
    Array.from(bars).forEach(bar => {
        bar.style.backgroundColor = "#4CAF50"; // Reset all bars to green
    });
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
