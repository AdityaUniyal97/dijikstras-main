// Performs Dijkstra's algorithm on a grid; returns all nodes in the order they were visited.
// Sets each node's previousNode to allow path reconstruction from start to finish.
export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = []; // Array to store nodes in the order they're visited

  // Set initial distances to Infinity and clear any previous path data
  const nodes = getAllNodes(grid);
  for (const node of nodes) {
    node.distance = Infinity; // Represents initial distance as unreachable
    node.previousNode = null; // Clears previous node data for path tracing
    node.isFinished = false;  // Tracks whether the node is finalized
  }
  startNode.distance = 0; // Set the start node's distance to 0 to start the algorithm

  // Main loop: find the closest unfinished node and update neighbors
  while (nodes.some(node => !node.isFinished)) {
    // Find the unfinished node with the smallest distance
    let currentNode = null;
    for (const node of nodes) {
      if (!node.isFinished && (currentNode === null || node.distance < currentNode.distance)) {
        currentNode = node;
      }
    }

    // Stop if the closest node is a wall or if no reachable nodes remain
    if (currentNode.isWall || currentNode.distance === Infinity) break;

    // Mark the node as finished (it has been processed)
    currentNode.isFinished = true;
    visitedNodesInOrder.push(currentNode); // Add to the list of visited nodes

    // If we reach the finish node, stop the algorithm
    if (currentNode === finishNode) break;

    // Update distances to neighboring nodes
    updateAdjacentNodes(currentNode, grid);
  }

  return visitedNodesInOrder; // Return the nodes in the order they were visited
}

// Updates distances of adjacent nodes that haven't been finished
function updateAdjacentNodes(node, grid) {
  const adjacentNodes = getAdjacentNodes(node, grid); // Get adjacent nodes
  for (const neighbor of adjacentNodes) {
    // Calculate a new possible distance to the neighbor
    const newDistance = node.distance + 1; // Assuming each step costs 1
    if (newDistance < neighbor.distance) { // Update if new path is shorter
      neighbor.distance = newDistance;
      neighbor.previousNode = node; // Set path back to the current node
    }
  }
}

// Returns adjacent nodes that are not walls or finished
function getAdjacentNodes(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]); // Node above
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Node below
  if (col > 0) neighbors.push(grid[row][col - 1]); // Node to the left
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Node to the right
  // Filter out walls and finished nodes
  return neighbors.filter(neighbor => !neighbor.isFinished && !neighbor.isWall);
}

// Collects all nodes from the grid into a single array
function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to build the shortest path in order.
// Call this function after running dijkstra to trace back the path.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  // Move backward from the finish node to the start node
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode); // Add node to path
    currentNode = currentNode.previousNode; // Move to previous node
  }
  return nodesInShortestPathOrder;
}
