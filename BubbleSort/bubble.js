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
let i = 0, j = 0;
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
}

async function manualSortStep() {
    const bars = document.getElementsByClassName("bar");
    Array.from(bars).forEach(bar => bar.style.backgroundColor = "#1b8a1f");

    IsSortedChecker();

    if (isSorting) return; 

    if(j>0){
    bars[j-1].style.backgroundColor = "#1b8a1f";
    bars[j].style.backgroundColor = "#1b8a1f";
    }

    if (i >= array.length - 1) {
        updateDebugText("Array is fully sorted!");
        isSorting = false;
        stepButton.disabled = true;
        Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");
        return;
    }

    bars[j].style.backgroundColor =  "#8a0a0a";
    bars[j + 1].style.backgroundColor =  "#8a0a0a";

    if (array[j] > array[j + 1]) {
        bars[j].style.backgroundColor = "blue";
        bars[j + 1].style.backgroundColor = "blue";

        await new Promise((resolve) => setTimeout(resolve, 300));
        
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = `${array[j]}px`;
        bars[j + 1].style.height = `${array[j + 1]}px`;

        updateDebugText(`Swapped elements at index ${j} and ${j + 1}`);
    } else {
        updateDebugText(`No swap needed for index ${j} and ${j + 1}`);

    }
    j++;
    if (j >= array.length - i - 1) {  
        j = 0;
        i++;
    }
    stepButton.disabled=false;
}

async function automaticSort() {
    isSorting = true;
    const bars = document.getElementsByClassName("bar");

    for (let i = 0; i < array.length - 1; i++) {
         IsSortedChecker();
        for (let j = 0; j < array.length - i - 1; j++) {
            if (!isSorting || isManual) return;

            bars[j].style.backgroundColor = "#8a0a0a"
          bars[j + 1].style.backgroundColor = "#8a0a0a"

            await new Promise((resolve) => setTimeout(resolve, 200));

            if (array[j] > array[j + 1]) {
                
                bars[j].style.backgroundColor = "blue";
                bars[j + 1].style.backgroundColor = "blue";
                await new Promise((resolve) => setTimeout(resolve, 200));
 
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${array[j]}px`;
                bars[j + 1].style.height = `${array[j + 1]}px`;

                updateDebugText(`Swapped elements at index ${j} and ${j + 1}`);
            } else {
                updateDebugText(`No swap needed for index ${j} and ${j + 1}`);
            }

            await new Promise((resolve) => setTimeout(resolve, 300));

            bars[j].style.backgroundColor = "#1b8a1f";
            bars[j + 1].style.backgroundColor = "#1b8a1f";
        }
    }
}


function IsSortedChecker(){

    for(let k=1;k<array.length;k++){
       if(array[k] < array[k-1]){
         return;
       }
    }
    isSorting=false;
    updateDebugText("Array is fully sorted!");
    Array.from(bars).forEach(bar => bar.style.backgroundColor = "green");
}


function setManualMode() {
    isManual = true;
    isSorting = false; 
    stepButton.disabled = false;
    resetIndices();
    updateDebugText("Manual mode activated. Use 'Step' to go forward.");
}

async function stepSort() {
    if (isManual) {
        stepButton.disabled=true;
        await new Promise((resolve) => setTimeout( manualSortStep(), 300));
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