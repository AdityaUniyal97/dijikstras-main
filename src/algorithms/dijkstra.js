// Performs Dijkstra's algorithm on a grid; returns all nodes in the order they were visited.
// Also sets each node's previousNode to reconstruct the shortest path from start to finish.
export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];

  // Initialize distances and previous nodes
  const nodes = getAllNodes(grid);
  for (const node of nodes) {
    node.distance = Infinity; // Similar to dist[] in Java code
    node.previousNode = null;
    node.isFinished = false; // Similar to fin[] in Java code
  }
  startNode.distance = 0;

  // Main loop: process nodes until all are finalized
  while (nodes.some(node => !node.isFinished)) {
    // Select the unfinished node with the smallest distance
    let currentNode = null;
    for (const node of nodes) {
      if (!node.isFinished && (currentNode === null || node.distance < currentNode.distance)) {
        currentNode = node;
      }
    }

    // If we encounter a wall or the smallest distance is Infinity, break the loop
    if (currentNode.isWall || currentNode.distance === Infinity) break;

    // Mark the node as finished
    currentNode.isFinished = true;
    visitedNodesInOrder.push(currentNode);

    // If we have reached the finish node, we can exit
    if (currentNode === finishNode) break;

    // Update distances to adjacent unfinished nodes
    updateAdjacentNodes(currentNode, grid);
  }

  return visitedNodesInOrder;
}

// Updates the distances of adjacent unfinished nodes
function updateAdjacentNodes(node, grid) {
  const adjacentNodes = getAdjacentNodes(node, grid);
  for (const neighbor of adjacentNodes) {
    // Calculate new tentative distance
    const newDistance = node.distance + 1; // Assuming edge weight is 1 for grid movement
    if (newDistance < neighbor.distance) {
      neighbor.distance = newDistance;
      neighbor.previousNode = node;
    }
  }
}

// Retrieves adjacent unfinished nodes (excluding walls)
function getAdjacentNodes(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]); // Up
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
  if (col > 0) neighbors.push(grid[row][col - 1]); // Left
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right
  // Return neighbors that are not finished and not walls
  return neighbors.filter(neighbor => !neighbor.isFinished && !neighbor.isWall);
}

// Retrieves all nodes from the grid
function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Should be called after the dijkstra function.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
