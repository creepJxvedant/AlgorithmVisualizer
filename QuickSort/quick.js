let array = [];
const TAndC=`<div class="timeandspace">
            <span>Time Complexity : O(nlog(n))</span>
            <span>Space Complexity : O(1)</span>
        </div>`;
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const stepButton = document.getElementById("step-button");

let isSorting = false;
let isManual = false;
let i = 0, j = 0, pivotIndex = -1;
let Size=0;
let leftcall=true;
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
    array = Array.from({ length: Size }, () => Math.floor(Math.random() * 200) + 10);
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
    i = 0;
    j = 0;
    pivotIndex = -1;
}


async function manualSortStep() {
    isSorting = true;
    const bars = document.getElementsByClassName("bar");

    await ManualquickSort(0, array.length - 1, bars);
  updateDebugText("Array is fully sorted!");
    Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");
    isSorting = false;
}

async function ManualquickSort(low, high, bars) {
    if (low < high) {
        const pi = await partition(low, high, bars);
        await  ManualquickSort(low, pi - 1, bars); // Sort left part
        await  ManualquickSort(pi + 1, high, bars); // Sort right part
    }
}

async function Manualpartition(low, high, bars) {
    let pivot = array[high];

    let i = low - 1;
    if((low-1) <0){
    bars[0].style.backgroundColor = "yellow"; 
    }
    else{
        bars[i].style.backgroundColor = "yellow"; 
    }

    bars[high].style.backgroundColor = "yellow"; 
    await new Promise(resolve => setTimeout(resolve, 1000));


    for (let j = low; j < high; j++) {
        bars[j].style.backgroundColor = "red"; 
        await new Promise(resolve => setTimeout(resolve, 400));

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];

            bars[i].style.height = `${array[i]}px`;
            bars[j].style.height = `${array[j]}px`;
            bars[i].style.backgroundColor = "blue"; 
        }
        bars[j].style.backgroundColor = "green";
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    bars[i + 1].style.height = `${array[i + 1]}px`;
    bars[high].style.height = `${array[high]}px`;

    Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");
  

    return i + 1;
}




async function automaticSort() {
    isSorting = true;
    const bars = document.getElementsByClassName("bar");

    await quickSort(0, array.length - 1, bars);

    // Final color change when sorting is done
    updateDebugText("Array is fully sorted!");
    Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");
    isSorting = false;
}

async function quickSort(low, high, bars) {
    if (low < high && isSorting) {
        const pi = await partition(low, high, bars);
        await quickSort(low, pi - 1, bars); // Sort left part
        await quickSort(pi + 1, high, bars); // Sort right part
    }
}

async function partition(low, high, bars) {
       
    if(!isSorting){
        return;
    }

    let pivot = array[high];

    let i = low - 1;
    if((low-1) <0){
    bars[0].style.backgroundColor = "yellow"; 
    }
    else{
        bars[i].style.backgroundColor = "yellow"; 
    }

    bars[high].style.backgroundColor = "yellow"; 
    await new Promise(resolve => setTimeout(resolve, 1000));


    for (let j = low; j < high; j++) {
        bars[j].style.backgroundColor = "red"; 
        await new Promise(resolve => setTimeout(resolve, 400));

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];

            bars[i].style.height = `${array[i]}px`;
            bars[j].style.height = `${array[j]}px`;
            bars[i].style.backgroundColor = "blue"; 
        }
        bars[j].style.backgroundColor = "green";
    }

    // Place pivot in the correct position
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    bars[i + 1].style.height = `${array[i + 1]}px`;
    bars[high].style.height = `${array[high]}px`;

    Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");
  

    return i + 1;
}

function setManualMode() {
    isManual = true;
    isSorting = false;
    stepButton.disabled = false;
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

SizeInput.addEventListener('change', GetSize);