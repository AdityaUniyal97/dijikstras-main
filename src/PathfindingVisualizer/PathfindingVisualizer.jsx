import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/AStar';
import logo from './gfg-new-logo.png';
import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      selectedAlgorithm: 'dijkstra',
      selectedSpeed: 'average', // Default selected speed
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  getSpeedInMs = () => {
    const { selectedSpeed } = this.state;
    switch (selectedSpeed) {
      case 'fast':
        return 5;
      case 'slow':
        return 50;
      default:
        return 20; // average speed
    }
  };

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    const speed = this.getSpeedInMs();
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, speed * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    const speed = this.getSpeedInMs();
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, speed * i);
    }
  }

  visualizeAlgorithm() {
    const { grid, selectedAlgorithm } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    let visitedNodesInOrder;
    let nodesInShortestPathOrder;

    if (selectedAlgorithm === 'dijkstra') {
      visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    } else if (selectedAlgorithm === 'aStar') {
      visitedNodesInOrder = aStar(grid, startNode, finishNode);
      nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    }

    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  handleAlgorithmChange = (event) => {
    this.setState({ selectedAlgorithm: event.target.value });
  };

  handleSpeedChange = (event) => {
    this.setState({ selectedSpeed: event.target.value });
  };

  // Add a method to navigate to the Sorting Visualizer
  navigateToSortingVisualizer = () => {
    window.location.href = 'SortingAlgorithm/index.html'; // Update the path as needed
  };

  render() {
    const { grid, mouseIsPressed, selectedAlgorithm, selectedSpeed } = this.state;

    return (
      <div className="visualizer-container">
        <div className="control-panel">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <select value={selectedAlgorithm} onChange={this.handleAlgorithmChange}>
            <option value="dijkstra">Dijkstra's Algorithm</option>
            <option value="aStar">A* Algorithm</option>
          </select>
          <select value={selectedSpeed} onChange={this.handleSpeedChange}>
            <option value="fast">Fast</option>
            <option value="average">Average</option>
            <option value="slow">Slow</option>
          </select>
          <button onClick={() => this.visualizeAlgorithm()}>Visualize Algorithm</button>
          <button onClick={this.navigateToSortingVisualizer}>Go to Sorting Visualizer</button>
        </div>
        <div className="grid-container">
          <div className="grid">
            {grid.map((row, rowIdx) => {
              return (
                <div key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const { row, col, isFinish, isStart, isWall } = node;
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={() => this.handleMouseDown(row, col)}
                        onMouseEnter={() => this.handleMouseEnter(row, col)}
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
