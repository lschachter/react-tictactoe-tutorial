import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.className} key={props.value} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let wins = this.props.winner;
    return (
      <Square 
        value={this.props.squares[i]}
        key={i}
        className={(i === wins[0] || i === wins[1] || i === wins[2]) ? 'square winning-move' : 'square'}
        onClick = {() => this.props.onClick(i)} 
      />
    );
  }

  render() {
    let rows = [];
    let rowNum = 0;
    let row;
    for (let i = 0; i < 3; i++) {
      row = [];
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(j + (3 * rowNum)));
      }
      rowNum++;
      rows.push(row);
    }

    let board = rows.map((row, i) => {
      return (
        <div className="board-row" key={i}>
          {row}
        </div>
      );
    });
    
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      movesReversed: false,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext 
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverseMoves(moves) {
    this.setState({
      movesReversed: !this.state.movesReversed,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button className={(move === this.state.stepNumber) ? 'current-move' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>          
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
    } else if (moves.length === 10) {
      status = "It's a draw";
    } else {
      status = 'Next player: '+ (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winner={(winner) ? winner : [-1,-1,-1]}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.reverseMoves(moves)}>Invert Moves List</button>
          <ol>{(!this.state.movesReversed) ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < wins.length; i++) {
    const [a,b,c] = wins[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a,b,c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
