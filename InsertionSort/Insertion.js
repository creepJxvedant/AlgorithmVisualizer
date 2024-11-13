let array = [];
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const stepButton = document.getElementById("step-button");

let isSorting = false;
let isManual = false;
let i = 1, j = 0;

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
     j=i-1;
    Array.from(bars).forEach(bar => bar.style.backgroundColor = "#4CAF50");

    if (i >= array.length) {
        updateDebugText("Array is fully sorted!");
        setBarsGreen();  
        isSorting = false;
        stepButton.disabled = true;
        return;
    }

    let key = array[i];
    bars[i].style.backgroundColor = "red";

    if (j > 0 && array[j - 1] > key) {
        bars[j - 1].style.backgroundColor = "blue";
        array[j] = array[j - 1];
        bars[j].style.height = `${array[j]}px`;

        updateDebugText(`Moved element at index ${j - 1} to index ${j}`);
        j--;
    } else {
        array[j] = key;
        bars[j].style.height = `${key}px`;
        updateDebugText(`Inserted key ${key} at index ${j}`);
        i++;
        j = i;
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${key}px`;
    bars[i].style.backgroundColor = "#4CAF50";
    updateDebugText(`Inserted key ${key} at index ${j + 1}`);
}


async function automaticSort() {

    isSorting = true;
    const bars = document.getElementsByClassName("bar");

    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        
        bars[i].style.backgroundColor = "red";
        await new Promise((resolve) => setTimeout(resolve, 400));
        while (j >= 0 && array[j] > key) {
            bars[j].style.backgroundColor = "blue";
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1]}px`;
            j--;

            await new Promise((resolve) => setTimeout(resolve, 400));
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${key}px`;
        bars[i].style.backgroundColor = "#4CAF50";
        updateDebugText(`Inserted key ${key} at index ${j + 1}`);

        for (let k = i-1; k>=0; k--) {
            bars[k].style.backgroundColor = "#4CAF50";
        }
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

generateArray();
