// DOM Elements
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const sizeInput = document.getElementById("Size");
const searchInput = document.getElementById("Search");
const stepButton = document.getElementById("step-button");
const ManualButton=document.getElementById("manual");
const AutomaticButton=document.getElementById("automatic");


let isGenerated=false;
let array = [];
let size = 0;
let target = -1;
let bound = 1;
let low = 0;
let high = -1;
let Automatic=true;


function generateArray() {
    const minValue = 1;
    const maxValue = size;
    array = Array.from({ length: size }, () => Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
    array.sort((a, b) => a - b); 
    renderArray();
    debugText.textContent = "Array generated and sorted. Ready for search!";
}

function renderArray() {
    arrayContainer.innerHTML = "";
    const maxValue = Math.max(...array);
    array.forEach((value, index) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${(value / maxValue) * 100}%`;
        bar.setAttribute("data-index", index);
        arrayContainer.appendChild(bar);
    });
    isGenerated=true;
}


sizeInput.addEventListener("change", () => {
    size = parseInt(sizeInput.value);
    sizeInput.value='';
    if (size > 0 && size!=NaN && size<50) {
        generateArray();
    } else {
        arrayContainer.innerHTML = "";
        debugText.textContent = "Please enter a valid size(n < 50).";
    }
});


function highlightBar(index, className) {
    const bar = arrayContainer.children[index];
    if (bar) {
        bar.classList.add(className);
    }
}

function resetHighlights() {
    Array.from(arrayContainer.children).forEach((bar) => {
        bar.className = "bar";
    });
}

function highlightCodeLine(line) {
    document.querySelectorAll("#algorithm-code span").forEach((codeLine) => codeLine.classList.remove("highlight"));
    document.getElementById(`code-line-${line}`).classList.add("highlight");
}

function updateDebug(message) {
    debugText.textContent = message;
}

function reset() {
    array = [];
    size = 0;
    target = -1;
    bound = 1;
    low = 0;
    high = -1;
    Automatic=true;
    isGenerated=false;
    updateDebug("Reseted the array!");
    resetHighlights();
    ManualButton.disabled=false;
    AutomaticButton.disabled=false;
    stepButton.disabled = true;
}


// Start Search
function startAutomaticSort() {
    target = parseInt(searchInput.value);
    searchInput.value='';
    if (isNaN(target)) {
        alert("Enter a valid search value.");
        return;
    }

    resetHighlights();
    updateDebug(`Starting automatic search for ${target}...`);
    Automatic=true;
    stepButton.disabled = true;
    ManualButton.disabled = true;
    AutomaticButton.disabled = true;
    bound = 1;
    exponentialStep();
}


async function exponentialStep() {

    highlightCodeLine(4);
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (bound >= array.length || array[bound] >= target) {
        low = Math.floor(bound / 2);
        high = Math.min(bound, array.length - 1);

        updateDebug(`Exponential step complete. Range determined: [${low}, ${high}]. Switching to binary search.`);
        highlightCodeLine(7);

        await binarySearchStep();
        
        setTimeout(reset,5000);
        return;
    }

    highlightBar(bound, "active");
    updateDebug(`Exponential step: Checking index ${bound} (value: ${array[bound]})`);
    highlightCodeLine(5);
    bound *= 2;
     
    setTimeout(exponentialStep, 500);
}



async function binarySearchStep() {
    highlightCodeLine(9);
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    while(low<high){
    const mid = Math.floor((low + high) / 2);
    highlightCodeLine(10);
    highlightBar(mid, "active");
    updateDebug(`Binary search: Checking index ${mid}.`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    

    if (array[mid] === target) {
        highlightCodeLine(11);
        await new Promise((resolve) => setTimeout(resolve, 300));

        highlightCodeLine(12);
        highlightBar(mid, "found");
        updateDebug(`Element found at index ${mid}!`);
        return;
    }
    else if (array[mid] < target) {
        highlightCodeLine(14);
        await new Promise((resolve) => setTimeout(resolve, 300));
        low = mid + 1;
            highlightCodeLine(15);
    }
    else {
        
        highlightCodeLine(16);
        await new Promise((resolve) => setTimeout(resolve, 300));
            high = mid - 1;
            highlightCodeLine(17);
    
        }
        await new Promise((resolve) => setTimeout(resolve, 600));
}
highlightCodeLine(20);
updateDebug(`Element ${target} Not found resetting the array...`);     
}

async function setManualMode() {
    target = parseInt(searchInput.value);
    if (isNaN(target)) {
        alert("Enter a valid search value.");
        return;
    }

    Automatic=false;
    
    ManualButton.disabled=true;
    AutomaticButton.disabled=true;

     resetHighlights();
    updateDebug(`Starting manual search for ${target}. Click 'Step' to proceed.`);
    bound = 1;
    stepButton.disabled = false;
    highlightCodeLine(1);
    await new Promise((resolve) => setTimeout(resolve, 300));
    
}



let doBinary = false; 

async function stepSort() {
    if (!doBinary) {
        MexponentialStep();
    } else {
        stepButton.disabled=true; 
        const returned=await MbinarySearchStep();
        stepButton.disabled=false;
}
}

function MexponentialStep() {
    highlightCodeLine(4);

    if (bound >= array.length || array[bound] >= target) {
        low = Math.floor(bound / 2);
        high = Math.min(bound, array.length - 1);

        updateDebug(`Exponential step complete. Range determined: [${low}, ${high}]. Switching to binary search.`);
        highlightCodeLine(7);

        doBinary = true; // Switch to binary search for the next step.
        return;
    }

    highlightBar(bound, "active");
    updateDebug(`Exponential step: Checking index ${bound} (value: ${array[bound]})`);
    highlightCodeLine(5);

    bound *= 2;
}

async function MbinarySearchStep() {

    highlightCodeLine(9);
    await new Promise((resolve) => setTimeout(resolve, 800)); 

    if (low > high) {
        highlightCodeLine(20);
        await new Promise((resolve) => setTimeout(resolve, 800));  
        updateDebug(`Element ${target} not found. Resetting the array...`);
        stepButton.disabled = true; // Stop further steps.
        setInterval(reset,5000);
        return;
    }

    const mid = Math.floor((low + high) / 2);
    highlightCodeLine(10);
    await new Promise((resolve) => setTimeout(resolve, 800)); 
    highlightCodeLine(11); 
    highlightBar(mid, "active");
    updateDebug(`Binary search: Checking index ${mid}.`);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (array[mid] === target) {
        highlightCodeLine(12);
        await new Promise((resolve) => setTimeout(resolve, 500));
        highlightCodeLine(13);
        highlightBar(mid, "found");
        updateDebug(`Element found at index ${mid}!`);
        stepButton.disabled = true; // Stop further steps.
        return;
    } else if (array[mid] < target) {
        highlightCodeLine(14);
        await new Promise((resolve) => setTimeout(resolve, 800)); 
        low = mid + 1;
        highlightCodeLine(15);
    } else {
        highlightCodeLine(16);
        await new Promise((resolve) => setTimeout(resolve, 800)); 
        high = mid - 1;
        highlightCodeLine(17);
    }
    await new Promise((resolve) => setTimeout(resolve, 800)); 
}



document.querySelector("button[onclick='resetArray()']").addEventListener("click", reset);
stepButton.addEventListener("click", stepSort);
generateArray();