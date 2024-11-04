// A* algorithm implementation for pathfinding
export function aStar(grid, startNode, finishNode) {
    const openSet = [startNode];
    const visitedNodesInOrder = [];
    startNode.g = 0;
    startNode.h = heuristic(startNode, finishNode);
    startNode.f = startNode.g + startNode.h;
  
    while (openSet.length > 0) {
      openSet.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
      const currentNode = openSet.shift();
  
      // Add currentNode to the visited nodes
      visitedNodesInOrder.push(currentNode);
      if (currentNode === finishNode) {
        return visitedNodesInOrder;
      }
  
      const neighbors = getNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (neighbor.isWall || visitedNodesInOrder.includes(neighbor)) continue;
  
        const tentativeG = currentNode.g + 1;
        if (tentativeG < neighbor.g || !openSet.includes(neighbor)) {
          neighbor.g = tentativeG;
          neighbor.h = heuristic(neighbor, finishNode);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previousNode = currentNode;
  
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }
    return visitedNodesInOrder;
  }
  
  // Heuristic function to estimate distance to the finish node
  function heuristic(nodeA, nodeB) {
    const dx = Math.abs(nodeA.row - nodeB.row);
    const dy = Math.abs(nodeA.col - nodeB.col);
    return dx + dy;
  }
  
  function getNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
  }
  