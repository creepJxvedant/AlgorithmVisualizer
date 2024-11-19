let array = [];
const TAndC=`<div class="timeandspace">
            <span>Time Complexity : O(N)</span>
            <span>Space Complexity : O(1)</span>
        </div>`;
let target = null;
let current=0;
let Size=0;

const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const debugArrayText = document.getElementById("debug-array-text");
const nextStepButton=document.getElementById("step-button");
const manualSearchButton=document.getElementById("auto-button");
const autoSearchButton=document.getElementById("manual-button");
let isSearching = false;
let isManualMode = false;

const targetInput = document.getElementById("target-val");
const SizeInput = document.getElementById("Size");

function GetSize(){
Size = parseInt(SizeInput.value);
SizeInput.value='';
if (Size >50 || target === "") {
    updateDebugText("Please enter a valid target value.");
    return;
}
generateArray();
}

function generateArray() {
    const minValue = 1;
    const maxValue = 50;

    array = Array.from({ length: Size }, () => Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);

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
    current=0;
}

async function startAutoSearch() {
    if (isSearching || isManualMode) return;

    target = parseInt(targetInput.value);
    targetInput.value = "";
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
while(isSearching){
    if(current>Size-1){
        break;
    }     
     await new Promise((resolve) => setTimeout(resolve, 200));
     
     Array.from(bars)[current].style.backgroundColor="crimson";
     
      updateDebugText(`Target: ${target}, Current: ${array[current]}`);

        if (array[current] === target) {
            Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");   
         Array.from(bars)[current].style.backgroundColor="blue";
            updateDebugText(`Target found at index ${current}!`);
            break;
        } 
        current++;
        await new Promise((resolve) => setTimeout(resolve, 100));
}
        
        if(array[current]!=target){
        updateDebugText("Target not found in the array.");
        }
    isSearching = false;
    autoSearchButton.disabled = false;
    manualSearchButton.disabled = false;
}


async function startManualSearch() {
    if (isSearching || isManualMode) return;

    target = parseInt(targetInput.value);
    targetInput.value = "";
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

    if(current!=Size){
    Array.from(bars)[current].style.backgroundColor = "crimson";
    }
    updateDebugText(`Target: ${target}, Current: ${array[current]}`);
    if (array[current] === target || current>=Size) {
    console.log(current);
      
        if(current!=Size){
     Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");   
     Array.from(bars)[current].style.backgroundColor="blue";
        updateDebugText(`Target found at index ${current}!`);
        isSearching = false;
        autoSearchButton.disabled = true;
        manualSearchButton.disabled = true;
    }
    else{
        updateDebugText(`Target Not Found! ${target}!`);
        
        isSearching = false;
        autoSearchButton.disabled = false;
        manualSearchButton.disabled = false;
    } 
}

    current++;

}


function resetArray() {
    isSearching = false;
    isManualMode = false;
    generateArray();
    nextStepButton.disabled = true;
    autoSearchButton.disabled = false;
    manualSearchButton.disabled = false;
}

SizeInput.addEventListener("change", GetSize);