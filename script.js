const loader = document.querySelector(".loader");
const wrapper=document.querySelector(".Middle .card-container");


const links=[
    [`./assests/BubbleSort.png`,`./BubbleSort/Bubble.html`],
    [`./assests/InsertionSort.png`,`./InsertionSort/insertion.html`],
    [`./assests/BinarySearch.png`,`./BinarySearch/Binary.html`],
    [`./assests/HeapSort.png`,`./HeapSort/heap.html`],
    [`./assests/LinearSearch.png`,`./LinearSearch/linear.html`],
    [`./assests/QuickSort.png`,`./QuickSort/quick.html`],
    [`./assests/MergeSort.png`,`./MergeSort/merge.html`],
    [`./assests/SelectionSort.png`,`./SelectionSort/selection.html`],
    [`./assests/Astar.png`,`./Astar/Astar.html`],
    [`./assests/BreadthFirst.png`,`./BFS/bfs.html`],
    [`./assests/DepthFirst.png`,`./DFS/dfs.html`],
    [`./assests/dijkstra.png`,`./Djktra/Dijiktra.html`],
    [`./assests/Graph.png`,`./Graph/graph.html`],
    [`./assests/LinkedList.png`,`./LinkedList/linkedlist.html`],
    [`./assests/BiDirectional.png`,`./BiDirectional/bidirectional.html`],
    [`./assests/Exponential.png`,`./Exponential/exponential.html`],

];

function showData() {
    links.forEach(link => {
        console.log(link);
    const Card = document.createElement("div");
     Card.classList.add("card");

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