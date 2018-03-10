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
    let classes = (i === wins[0] || i === wins[1] || i === wins[2]) ? 
      'square winning-move' : 
      'square';
    return (
      <Square 
        value={this.props.squares[i]}
        key={i}
        className={classes}
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
      let moveClass = (move === this.state.stepNumber) ? 'current-move' : '';

      let position;
      if (!move) {
        position = '';
      } else {
        let index = compareHistories(history[move - 1].squares, step.squares)
        position = '(' + (index % 3).toString() +', ' + (Math.floor(index/3)).toString()+')';
      }

      return (
        <li key={move}>
          <button 
            className={moveClass} 
            onClick={() => this.jumpTo(move)}>{desc}</button>
          <p>
            {position}
          </p>
        </li>          
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
    } else if (this.state.stepNumber === 9) {
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

function compareHistories(oldSquares, newSquares) {
  for (let i = 0; i < 9; i++) {
    if (!oldSquares[i] && newSquares[i]) {
      return i;
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
