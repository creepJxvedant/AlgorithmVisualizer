const loader = document.querySelector(".loader");
const wrapper=document.querySelector(".Middle .card-container");


const links=[
    [`./assests/Bubble.jpg`,`./BubbleSort/Bubble.html`],
    [`./assests/Insertion.jpg`,`./InsertionSort/insertion.html`],
    [`./assests/binarysearch.jpg`,`./BinarySearch/Binary.html`],
    [`./assests/heapsort.jpg`,`./HeapSort/heap.html`],
    [`./assests/linearsearch.jpg`,`./LinearSearch/linear.html`],
    [`./assests/quicksort.png`,`./QuickSort/quick.html`],
    [`./assests/mergesort.png`,`./MergeSort/merge.html`],
    [`./assests/selectionsort.png`,`./SelectionSort/selection.html`],
    [`./assests/astar.jpg`,`./Astar/Astar.html`],
    [`./assests/BFS.jpg`,`./BFS/bfs.html`],
    [`./assests/DFS.png`,`./DFS/dfs.html`],
    [`./assests/djiktra.jpg`,`./Djktra/Dijiktra.html`],

];

function showData() {
    links.forEach(link => {
        console.log(link);
    const Card = document.createElement("div");
     Card.className = "card background-image";
     Card.style.transition="0.3s ease scale";

      Card.style.backgroundImage = `url(${link[0]})`;
      Card.addEventListener("click", () => {
            window.location.href = link[1];
        });
        wrapper.appendChild(Card);
      })
  
    
    }
  showData();


if(loader){
if (!localStorage.getItem("hasLoaded")) {
    window.addEventListener("load", setTimeout(async () => {
        let i = 0;
        while (i < 100) {
            await new Promise((resolve) => setTimeout(resolve, 10));
            i++;
        }
        loader.style.animationPlayState = "running";

        localStorage.setItem("hasLoaded", "true");
    }, 3000));
} else {
    loader.style.display = "none";
}

window.addEventListener("beforeunload", () => {
    localStorage.removeItem("hasLoaded");
});
}