let array = [];
const TAndC=`<div class="timeandspace">
            <span>Time Complexity : O(log(n))</span>
            <span>Space Complexity : O(1)</span>
        </div>`;
let target = null;
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const debugArrayText = document.getElementById("debug-array-text");

let isSearching = false;
let left = 0;
let right = 0;
let mid = 0;
let isManualMode = false;
let isFirst=true;

const targetInput = document.getElementById("target-val");
const nextStepButton = document.getElementById("next-step-button");
const autoSearchButton = document.getElementById("auto-search-button");
const manualSearchButton = document.getElementById("manual-search-button");


function generateArray() {
    const arraySize = 60;
    const minValue = 1;
    const maxValue = 100;

    array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
    array.sort((a, b) => a - b); 

    renderArray();
    resetIndices();
    updateDebugText("Array generated and sorted. Press 'Start Binary Search' to begin.");
    displayArrayInDebugPanel();
}

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

function displayArrayInDebugPanel() {
    const arrayString = array.join(", ");
    debugArrayText.innerText = `Generated Array: [${arrayString}]`;
}

function updateDebugText(message) {
    debugText.innerText = message;
}

function resetIndices() {
    left = 0;
    right = array.length - 1;
    mid = 0;
}

async function startAutoSearch() {
    if (isSearching || isManualMode) return;

    target = parseInt(targetInput.value);
     targetInput.value='';
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
        
     Array.from(bars)[left].style.backgroundColor="crimson";
     Array.from(bars)[right].style.backgroundColor="crimson";

        mid = Math.floor((left + right) / 2);
        
        await new Promise((resolve) => setTimeout(resolve, 500));
     
     Array.from(bars)[mid].style.backgroundColor="blue";
        updateDebugText(`Left: ${array[left]}, Mid: ${array[mid]}, Right: ${array[right]}`);

        if (array[mid] === target) {
            Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");   
         Array.from(bars)[mid].style.backgroundColor="yellow";
            updateDebugText(`Target found at index ${mid}!`);
            break;
        } else if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }

        await new Promise((resolve) => setTimeout(resolve, 800));
    }

    if (left > right) {
        updateDebugText("Target not found in the array.");
    }

    isSearching = false;
    autoSearchButton.disabled = false;
    manualSearchButton.disabled = false;
}


async function startManualSearch() {
    if (isSearching || isManualMode) return;

    target = parseInt(targetInput.value);
    targetInput.value ='';
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
}


function nextStep() {
    if (!isSearching || !isManualMode) return;

    const bars = document.getElementsByClassName("bar");    
    Array.from(bars)[left].style.backgroundColor="crimson";
    Array.from(bars)[right].style.backgroundColor="crimson";

    updateDebugText(`Left: ${array[left]},Right: ${array[right]}`);
      
    if(!isFirst){
        calculateMid();
    }
    isFirst=!isFirst;
}

function calculateMid(){
    const bars = document.getElementsByClassName("bar");
    mid = Math.floor((left + right) / 2);
    Array.from(bars)[mid].style.backgroundColor="blue";
    
    if (array[mid] === target) {
        Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");
    Array.from(bars)[mid].style.backgroundColor="yellow";

        updateDebugText(`Target found at index ${mid}!`);
        isSearching = false;
        nextStepButton.disabled = true;
        return;
    } else if (array[mid] < target) {
        left = mid + 1;
    } else {
        right = mid - 1;
    }
    
    updateDebugText(`Left: ${array[left]},Mid: ${array[mid]},Right: ${array[right]}`);
   
}



function resetArray() {
    isSearching = false;
    isManualMode = false;
    generateArray();
    nextStepButton.disabled = true;
    autoSearchButton.disabled = false;
    manualSearchButton.disabled = false;
}

generateArray();
