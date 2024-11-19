const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

const nodes = [];
const edges = [];
let lastNode=null;
let selectedNodes = [];
let draggingNode = null;
let sourceNode = null; // Source node for TSP visualization
let animationSpeed = 1000; // Default animation speed

const speedControl = document.getElementById('speedControl');
const speedLabel = document.getElementById('speedLabel');

speedControl.addEventListener('input', (e) => {
  animationSpeed = e.target.value;
  speedLabel.innerText = `${Math.round(animationSpeed / 1000)} second${animationSpeed / 1000 > 1 ? 's' : ''}`;
});

class Node {
    constructor(x, y, data) {
      this.x = x;
      this.y = y;
      this.data = data || Math.floor(Math.random() * 100);
      this.radius = 40;
      this.selected = false;
      this.visited = false; // Track if the node has been visited
    }
  
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  
      // Color logic
      if (this === sourceNode) {
        ctx.fillStyle = "#ff5733"; // Distinct color for the source node
      } else if (this.visited) {
        ctx.fillStyle = "#28a745"; // Green for visited nodes
      } else if (this.selected) {
        ctx.fillStyle = "#0056b3"; // Blue for selected nodes
      } else {
        ctx.fillStyle = "#007bff"; // Default color for unvisited nodes
      }
  
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
  
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.data, this.x, this.y);
    }
  }
  

function calculateLineEnds(node1, node2) {
  const dx = node2.x - node1.x;
  const dy = node2.y - node1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const x1 = node1.x + (dx / distance) * node1.radius;
  const y1 = node1.y + (dy / distance) * node1.radius;
  const x2 = node2.x - (dx / distance) * node2.radius;
  const y2 = node2.y - (dy / distance) * node2.radius;

  return { x1, y1, x2, y2, distance };
}

function drawEdge(node1, node2) {
  const { x1, y1, x2, y2, distance } = calculateLineEnds(node1, node2);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  // Draw the distance label next to the line
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  ctx.fillStyle = "#000000";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(distance.toFixed(2), midX, midY);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  edges.forEach(([n1, n2]) => drawEdge(n1, n2));
  nodes.forEach(node => node.draw());
}

function disconnectNodes(node1, node2) {
  const index = edges.findIndex(
    ([n1, n2]) => (n1 === node1 && n2 === node2) || (n1 === node2 && n2 === node1)
  );

  if (index !== -1) {
    edges.splice(index, 1); // Remove the edge if it exists
  }
}

function connectNodes(node1, node2) {
  // Check if the nodes are already connected
  const isConnected = edges.some(
    ([n1, n2]) => (n1 === node1 && n2 === node2) || (n1 === node2 && n2 === node1)
  );

  if (!isConnected) {
    edges.push([node1, node2]); // Connect the nodes
  } else {
    disconnectNodes(node1, node2); // Disconnect if already connected
  }
}

// Handle Mouse Events for Dragging and Selecting Nodes
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const clickedNode = nodes.find(
    node => Math.hypot(node.x - x, node.y - y) <= node.radius
  );

  if (clickedNode) {
    if (e.ctrlKey) {
      // If Ctrl is pressed, toggle the selection of the node
      clickedNode.selected = !clickedNode.selected;
      if (clickedNode.selected) {
        selectedNodes.push(clickedNode);
      } else {
        selectedNodes = selectedNodes.filter(node => node !== clickedNode);
      }

      // If two nodes are selected, try to connect or disconnect them
      if (selectedNodes.length === 2) {
        const [node1, node2] = selectedNodes;
        connectNodes(node1, node2);

        // Deselect both nodes after action
        selectedNodes.forEach(node => (node.selected = false));
        selectedNodes = [];
      }
    } else {
      // If Ctrl is not pressed, start dragging
      draggingNode = clickedNode;
      draggingNode.selected = false; // Unselect node when starting drag
    }
  }

  render();
});

canvas.addEventListener("mousemove", (e) => {
  if (draggingNode) {
    const rect = canvas.getBoundingClientRect();
    draggingNode.x = e.clientX - rect.left;
    draggingNode.y = e.clientY - rect.top;
    render();
  }
});

canvas.addEventListener("mouseup", () => {
  draggingNode = null; // Stop dragging
});

// Add Node Button
document.getElementById("addNode").addEventListener("click", () => {
  const x = canvas.width / 2 + Math.random() * 100 - 50;
  const y = canvas.height / 2 + Math.random() * 100 - 50;
  const data = prompt("Enter node data (integer):", Math.floor(Math.random() * 100));
  if (data !== null && !isNaN(parseInt(data))) {
    nodes.push(new Node(x, y, parseInt(data)));
    render();
  }
});


document.getElementById("selectSource").addEventListener("click", () => {
  nodes.forEach(node => (node.selected = false));
  selectedNodes = [];
  render();
  updateDebugPanel("Click on a node to set it as the source.");

  canvas.addEventListener("mousedown", selectSource, { once: true });
});

function selectSource(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const clickedNode = nodes.find(
    node => Math.hypot(node.x - x, node.y - y) <= node.radius
  );

  if (clickedNode) {
    sourceNode = clickedNode;
    sourceNode.selected = true;
 
    updateDebugPanel(`Source selected: Node with data ${sourceNode.data}`);
    render();
  } else {
    updateDebugPanel("No node selected. Please try again.");
  }
}

// Debug Panel
const debugPanel = document.getElementById("debugPanel");

function updateDebugPanel(message) {
  debugPanel.innerText = "Debug Panel: " + message;
}

// Start Visualization Button
document.getElementById("startVisualization").addEventListener("click", () => {
  if (!sourceNode) {
    updateDebugPanel("Please select a source node before starting.");
    return;
  }

  updateDebugPanel("Starting TSP visualization...");
  startTSPVisualization();
});






function startTSPVisualization() {
    const connectedComponent = getConnectedComponent(sourceNode);
    const unvisited = new Set(connectedComponent);
 
    const path = [];
    let current = sourceNode;
    let totalDistance = 0;
  
    unvisited.delete(current);
    path.push(current);
  
    function getConnectedComponent(startNode) {
      const visited = new Set();
      const stack = [startNode];
  
      while (stack.length > 0) {
        const node = stack.pop();
        if (!visited.has(node)) {
          visited.add(node);
  
          // Add all neighbors that are directly connected
          edges.forEach(([n1, n2]) => {
            if (n1 === node && !visited.has(n2)) stack.push(n2);
            if (n2 === node && !visited.has(n1)) stack.push(n1);
          });
        }
      }
      

      return Array.from(visited);
    }
  
    function findNearestNode(node) {
      let nearest = null;
      let minDistance = Infinity;
  
      unvisited.forEach(otherNode => {
        const isConnected = edges.some(
          ([n1, n2]) =>
            (n1 === node && n2 === otherNode) || (n1 === otherNode && n2 === node)
        );
  
        if (isConnected) {
          const distance = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
          if (distance < minDistance) {
            minDistance = distance;
            nearest = otherNode;
          }
        }
      });
  
      return { nearest, minDistance };
    }
  
   async function step() {
      if (unvisited.size === 0) {
        // All nodes visited, return to the source

        const lastNode = path[path.length - 1];
        const distance = Math.hypot(lastNode.x - sourceNode.x, lastNode.y - sourceNode.y);
  
        totalDistance += distance;
  
        // Draw the final edge back to the source
        drawEdge(lastNode, sourceNode);
      
        path.push(sourceNode); // Add source node to close the cycle
        updateDebugPanel(`TSP Complete. Total Distance: ${totalDistance.toFixed(2)} units.`);
        render(); // Final render to show the complete cycle

        return;
      }
  
      const { nearest, minDistance } = findNearestNode(current);
  
      if (nearest) {
        // Mark the current node as visited
        current.visited = true;
  
        // Update total distance
        totalDistance += minDistance;
  
        // Draw the edge to the nearest node
        drawEdge(current, nearest);
  
        // Move to the nearest node
        console.log(nearest);
        path.push(nearest);
        unvisited.delete(nearest);
        current = nearest;
  
        // Update debug panel and re-render
        updateDebugPanel(`Visited Node: ${current.data}. Total Distance: ${totalDistance.toFixed(2)} units.`);
        render();
  
        setTimeout(step, animationSpeed); // Delay for visualization
      } else {
        // Handle case where no valid unvisited connected nodes are found
        updateDebugPanel("No valid unvisited connected nodes found. Checking remaining nodes...");
        render();
  
        // If this happens, the logic for identifying the nearest node needs to be rechecked.
      }
    }
  
    step(); // Start the first step
  }
  
  
  


  

function generate() {
    // Clear previous graph
    nodes.length = 0;
    edges.length = 0;
  
    const numNodes = Math.floor(Math.random() * 5) + 4; // Random size between 4 and 8 nodes
  
    // Generate random nodes
    for (let i = 0; i < numNodes; i++) {
      const x = Math.random() * (canvas.width - 100) + 50;
      const y = Math.random() * (canvas.height - 100) + 50;
      const data = Math.floor(Math.random() * 100);
      nodes.push(new Node(x, y, data));
    }
  
    // Randomly connect nodes
    const possibleEdges = [];
  
    // Generate possible edges between each pair of nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        possibleEdges.push([nodes[i], nodes[j]]);
      }
    }
  
    // Randomly shuffle the possible edges and pick a subset of them to connect the nodes
    const numEdgesToCreate = Math.floor(Math.random() * (nodes.length - 1)) + nodes.length - 1; // Random number of edges between nodes
    for (let i = 0; i < numEdgesToCreate; i++) {
      const edgeIndex = Math.floor(Math.random() * possibleEdges.length);
      const edge = possibleEdges[edgeIndex];
      edges.push(edge);
      possibleEdges.splice(edgeIndex, 1); // Remove the selected edge to avoid duplication
    }
  
    render();
  }
  

  document.getElementById("generateBtn").addEventListener("click", generate);


