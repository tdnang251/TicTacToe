import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square({ value, onClick,isLineWin}) {
  if (isLineWin){
    return (
      <button
        className="square-highlight"
        onClick={() => onClick()}
      >
        {value}
      </button>
    );
  }
    return (
      <button
        className="square"
        onClick={() => onClick()}
      >
        {value}
      </button>
    );

}

class Board extends React.Component {
  renderSquare(i,isLineWin) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      isLineWin={isLineWin}
    />;
  }



  render() {
    const lineWin=this.props.lineWin
    const size = 3;
    const rows = Array(size).fill(null)
    const cols = Array(size).fill(null)

    const board = rows.map((row, numRow) => {
      const boardRow = cols.map((col, numCol) => {
        const numSquare = numRow * size + numCol;
        let isLineWin=false;
        if (lineWin){
          isLineWin=lineWin.includes(numSquare)
        }
        return <span key={numSquare}>{this.renderSquare(numSquare,isLineWin)}</span>
      })
      return <div className="board-row" key={numRow}>{boardRow}</div>
    })
    return (
      <div>
        {board}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        local: ["(-1;-1)"],
        click: -1,
      }],
      stepNumber: 0,
      xIsNext: true,
      isReverse: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice();
    const click = current.click;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    //Take last local(col,row)
    const colLenght = Math.sqrt(history[history.length - 1].squares.length);
    const col = parseInt(i / colLenght) + 1;
    const row = i % colLenght + 1;

    const lastlocal = "(" + col + ";" + row + ")"

    this.setState({
      history: history.concat([{
        squares: squares,
        local: lastlocal,
        click: click,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    const history = this.state.history;
    for (let i = 0; i <= history.length - 1; i++) {
      history[i].click = step;
    }
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      history: history,
    });
  }

  //Up[date attribute isReverse when button "Reverse list" is clicked
  handleReverse() {
    this.setState({
      isReverse: !this.state.isReverse
    })
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const emptySquare=current.squares.includes(null)

    const moves = history.slice(0).map((step, move, element) => {
      const desc = move ?
        'Go to move #' + move + element[move].local :
        'Go to game start';
      if (element[move].click === move) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }

    });


    let status;
    if (winner) {
      status = 'Winner' + winner;
    } else {
      if (!emptySquare){
        status="Draw"
      }else {
        status = 'Next player' + (this.state.xIsNext ? "X" : "O");
      }
      
    }

    const isReverse = this.state.isReverse

    const lineWin=localWinner(current.squares)

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick((i))}
            lineWin={lineWin}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{isReverse ? moves.reverse() : moves}</ol>
          <button onClick={() => { this.handleReverse() }}>Reverse history</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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

function localWinner(squares) {
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
      return lines[i];
    }
  }
  return null;
}