let array = [];
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const stepButton = document.getElementById("step-button");

let isSorting = false;
let isManual = false;
let i = 0;
let minIndex = 0;

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
    minIndex = 0;
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function automaticSort() {
    isSorting = true;
    isManual = false;
    stepButton.disabled = true; 
    const bars = document.getElementsByClassName("bar");

    for (i = 0; i < array.length - 1; i++) {
        minIndex = i;
        bars[minIndex].style.backgroundColor = "blue"; 
        updateDebugText(`Finding the minimum element starting from index ${i}`);
        await delay(300);  // Delay to make the color change smooth

        for (let j = i + 1; j < array.length; j++) {
            if (!isSorting) return; 

            bars[j].style.backgroundColor = "red";
            await delay(200);  // Smoother transition between comparisons

            if (array[j] < array[minIndex]) {
                bars[minIndex].style.backgroundColor = "#4CAF50"; 
                minIndex = j;
                bars[minIndex].style.backgroundColor = "blue"; 
                updateDebugText(`New minimum found at index ${minIndex}`);
            } else {
                bars[j].style.backgroundColor = "#4CAF50"; 
            }
            await delay(200);  // Delay to visualize each comparison
        }

        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            renderArray();
            await delay(300);  // Delay to see the swap happen
            updateDebugText(`Swapped element at index ${i} with minimum at index ${minIndex}`);
        }

        bars[i].style.backgroundColor = "#4CAF50";
        await delay(200);  // Smooth marking as sorted
    }

    updateDebugText("Array is fully sorted!");
    isSorting = false;
}

async function manualSortStep() {
    const bars = document.getElementsByClassName("bar");
    Array.from(bars).forEach(bar => bar.style.backgroundColor = "#4CAF50");

    if (i >= array.length - 1) {
        updateDebugText("Array is fully sorted!");
        stepButton.disabled = true;
        return;
    }

    minIndex = i;
    bars[minIndex].style.backgroundColor = "blue"; 
    updateDebugText(`Finding the minimum element starting from index ${i}`);
    await delay(300);  // Smooth the initial color change

    let j = i + 1;
    for (j; j < array.length; j++) {
        if (!isManual) return;

        bars[j].style.backgroundColor = "red"; 
        await delay(200);  // Delay to visualize comparisons

        if (array[j] < array[minIndex]) {
            bars[minIndex].style.backgroundColor = "#4CAF50"; 
            minIndex = j;
            bars[minIndex].style.backgroundColor = "blue";
            updateDebugText(`New minimum found at index ${minIndex}`);
        } else {
            bars[j].style.backgroundColor = "#4CAF50"; 
        }
        await delay(200);  // Delay to visualize each comparison
    }

    if (minIndex !== i) {

        bars[j].style.backgroundColor = "blue"; 
        [array[i], array[minIndex]] = [array[minIndex], array[i]]; 
       
        await delay(300);  // Smooth the swap animation
        updateDebugText(`Swapped element at index ${i} with minimum at index ${minIndex}`);
    }

    bars[i].style.backgroundColor = "#4CAF50"; // Mark as sorted
    i++;
}

function setManualMode() {
    if (isSorting) isSorting = false; 
    isManual = true;
    stepButton.disabled = false;
    updateDebugText("Manual mode activated. Use 'Next Step' to proceed.");
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

// Initial array generation
generateArray();
