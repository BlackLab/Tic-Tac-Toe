import React, { Component } from 'react';
import './Game.css';

function Square(props) {
    return (
      <div className="square" onClick={() => props.onClick()}>
        {props.value}
      </div>
    );
}

class Board extends Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
  }
  render() {
    return (
      <div className="board">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares : Array(9).fill(null),
        }
      ],
      player : 1,
      isStart : false,
    }
    this.handleClick.bind(this);
    this.reset.bind(this);
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.player === 1 ? 'X' : 'O';
    this.setState({
      history:history.concat([
        {
          squares : squares,
        }
      ]),
      player: this.state.player === 1 ? 2 : 1,
    },this.aiMove);
  }

  aiMove() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const noSelect = [];
    squares.forEach((e, index) => {
      if(e === null) {
        noSelect.push({index: index});
      }
    })

    const randomIndex = noSelect[Math.floor(Math.random() * noSelect.length)]['index'];

    if (calculateWinner(squares) || squares[randomIndex]) {
      return;
    }
    squares[randomIndex] = this.state.player === 1 ? 'X' : 'O';
    this.setState({
      history:history.concat([
        {
          squares : squares,
        }
      ]),
      player: this.state.player == 1 ? 2 : 1,
    });
  }

  reset() {
    this.setState({
      history: [
        {
          squares : Array(9).fill(null),
        }
      ],
      player : 1,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let announce;
    if(winner) {
      announce = (
        <div className="announce">
          <div>
            {winner} Win !;
          </div>
          <button className="reset" onClick={() => this.reset()}>Reset</button>
        </div>
      );
    }
    return (
      <div className="game">
        <Board 
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
        />
        {announce}
      </div>
    );
  }
}

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

export default Game;
