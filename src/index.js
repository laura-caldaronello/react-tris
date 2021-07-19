import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const rows = 3;

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i,k) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          key={k}
        />
      );
    }
  
    render() {
      var structure = [];
      var num = 0;
      for (let i = 0; i < rows; i++) {
        var row = [];
        for (let t = 0; t < rows; t++) {
          row.push(this.renderSquare(num,"square-" + num));
          num++;
        }
        structure.push(<div className="board-row" key={"board-row-" + i}>{row}</div>);
      }
      return (
        <div>{structure}</div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null),
            location: null
          }
        ],
        stepNumber: 0,
        selected: null,
        xIsNext: true
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      
      if (calculateWinner(squares) || squares[i]) {
          return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    location: i
                }
            ]),
            stepNumber: history.length,
            selected: null,
            xIsNext: !this.state.xIsNext
        });
    }
  
    jumpTo(step) {
      for (let t = 0; t < 9; t++) {
        document.getElementsByClassName('square')[t].classList.remove('highlighted');
      }
      this.setState({
        stepNumber: step,
        selected: step,
        xIsNext: (step % 2) === 0
      });
    }

    reorder(moves) {
      var invisible = document.getElementsByClassName('invisible')[0];
      if (invisible.classList.contains('reverse')) {
        invisible.classList.remove('invisible');
        document.getElementsByClassName('ordered')[0].classList.add('invisible');
      }
      else {
        invisible.classList.remove('invisible');
        document.getElementsByClassName('reverse')[0].classList.add('invisible');
      }
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
  
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move + ', location: (' + (step.location % 3 + 1) + ',' + (Math.floor(step.location / 3) + 1) + ')' :
          'Go to game start';
        return (
          <li key={move}>
            <button className={(move === this.state.selected) ? "highlighted" : ""} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      const par = (moves.length === 10) ? 'No one wins' : '';
  
      let status;
      if (winner) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol className="ordered">{moves}</ol>
            <ol className="reverse invisible">{moves}</ol>
          </div>
          <div>
            <button onClick={() => this.reorder(moves)}>reorder moves</button>
          </div>
          <div>{par}</div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        var array = [a,b,c];
        for (let t = 0; t < array.length; t++) {
          document.getElementsByClassName('square')[array[t]].classList.add('highlighted');
        }
        return squares[a];
      }
    }
    return null;
  }
  