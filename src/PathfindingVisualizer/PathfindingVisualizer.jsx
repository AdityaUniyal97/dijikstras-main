import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/aStar';
import logo from './gfg-new-logo.png';
import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      selectedAlgorithm: 'dijkstra',
      selectedSpeed: 'average',
      startNode: { row: 10, col: 15 },
      finishNode: { row: 10, col: 35 },
      isSettingStartNode: false,
      isSettingFinishNode: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid(this.state.startNode, this.state.finishNode);
    this.setState({ grid });
  }

  toggleSettingStartNode = () => {
    this.setState({ 
      isSettingStartNode: !this.state.isSettingStartNode,
      isSettingFinishNode: false 
    });
  };

  toggleSettingFinishNode = () => {
    this.setState({ 
      isSettingFinishNode: !this.state.isSettingFinishNode,
      isSettingStartNode: false 
    });
  };

  handleMouseDown(row, col) {
    if (this.state.isSettingStartNode) {
      this.setState({ startNode: { row, col }, isSettingStartNode: false }, () => {
        const grid = getInitialGrid(this.state.startNode, this.state.finishNode);
        this.setState({ grid });
      });
    } else if (this.state.isSettingFinishNode) {
      this.setState({ finishNode: { row, col }, isSettingFinishNode: false }, () => {
        const grid = getInitialGrid(this.state.startNode, this.state.finishNode);
        this.setState({ grid });
      });
    } else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
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
        return 20;
    }
  };

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, algorithmType) {
    const speed = this.getSpeedInMs();
    const visitedClass = algorithmType === 'aStar' ? 'node node-visited-aStar' : 'node node-visited';

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = visitedClass;
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
    const { grid, selectedAlgorithm, startNode, finishNode } = this.state;
    const start = grid[startNode.row][startNode.col];
    const finish = grid[finishNode.row][finishNode.col];
    let visitedNodesInOrder;
    let nodesInShortestPathOrder;

    if (selectedAlgorithm === 'dijkstra') {
      visitedNodesInOrder = dijkstra(grid, start, finish);
      nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
      this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, 'dijkstra');
    } else if (selectedAlgorithm === 'aStar') {
      visitedNodesInOrder = aStar(grid, start, finish);
      nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
      this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, 'aStar');
    }
  }

  handleAlgorithmChange = (event) => {
    this.setState({ selectedAlgorithm: event.target.value });
  };

  handleSpeedChange = (event) => {
    this.setState({ selectedSpeed: event.target.value });
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
          <button onClick={this.toggleSettingStartNode}>
            {this.state.isSettingStartNode ? 'Cancel Setting Start Node' : 'Set Start Node'}
          </button>
          <button onClick={this.toggleSettingFinishNode}>
            {this.state.isSettingFinishNode ? 'Cancel Setting Finish Node' : 'Set Finish Node'}
          </button>
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
                        id={`node-${row}-${col}`}
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

const getInitialGrid = (startNode, finishNode) => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row, startNode, finishNode));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row, startNode, finishNode) => {
  return {
    col,
    row,
    isStart: row === startNode.row && col === startNode.col,
    isFinish: row === finishNode.row && col === finishNode.col,
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
