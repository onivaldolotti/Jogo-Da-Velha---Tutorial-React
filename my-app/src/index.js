import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return(
        <button className="square" style ={props.fill? {backgroundColor: 'red'}: null} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                fill={this.props.fill[i]}
                onClick={ ()=> this.props.onClick(i)}
            />
        );
    }

    renderBoard(rows, cols) {
        rows = 3;
        cols = 3;
        let resultRows = [];
        let contador =0;

        for (let i = 0; i<rows; i++) {
            resultRows.push(
                <div className="board-row" key={i + 'board'}>
                </div>
            );

            for(let j = 0; j< cols; j++) {
                resultRows.push(
                    this.renderSquare(contador)
                )
                contador++;
            }
        }

        return resultRows;
    }

    render() {
        return (
            <div> {this.renderBoard()}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                row : 0,
                col : 0,
            }],
            xIsNext: true,
            stepNumber: 0,
            sortable: 'asc',
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber +1);
        const current = history[history.length -1];
        const squares = current.squares.slice();
        let row;
        let col;

        switch (i) {
            case 0:
            case 1:
            case 2:
                row = 1;
                break;
            case 3:
            case 4:
            case 5:
                row = 2;
                break;
            case 6:
            case 7:
            case 8:
                row =3;
                break;
            default:
                alert('Linha invalida');
        }

        switch (i) {
            case 0:
            case 3:
            case 6:
                col = 1;
                break;
            case 1:
            case 4:
            case 7:
                col = 2;
                break;
            case 2:
            case 5:
            case 8:
                col =3;
                break;
            default:
                alert('Coluna invalida');
        }

        if(calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares : squares,
                row: row,
                col: col,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
           stepNumber: step,
           xIsNext: (step % 2) === 0,
        });
    }

    sortMoves() {
        if(this.state.sortable === 'asc') {
            this.setState( {
                sortable: 'desc'
            })
        }

        if(this.state.sortable === 'desc') {
            this.setState( {
                sortable: 'asc'
            })
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const resCalculate = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? "Go to move # " + move : "Go to game start";
            const row = this.state.history[move].row;
            const col = this.state.history[move].col;
            return (
               <ol key={move}>
                   <button style={this.state.stepNumber === move ?{fontWeight: 'bold'} : {fontWeight: 'normal'}} onClick={() => this.jumpTo(move)}>{`${desc} - Linha: ${row} - Coluna: ${col}`}</button>
               </ol>
            )
    });

    let status;
    let fill = Array(9).fill(false);

    if (resCalculate) {
        status = `Winner ${resCalculate.winner}`;
        current.squares.forEach((square,index) => {
            fill[index] = resCalculate.lines.includes(index);
            // resCalculate.lines.forEach(value => {
            //    if(value === index) {
            //        fill[index] = true;
            //    }
            // });
        })
    } else {
        status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;

        if(moves.length === 10) {
            status = `Draw`;
        }
    }


    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares = {current.squares}
                    fill = {fill}
                    onClick = {(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{ status }</div>
                <ol>{this.state.sortable === 'asc'? moves : moves.reverse()}</ol>
                <button onClick={()=>this.sortMoves()}>Sort moves</button>
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
            return {'winner':squares[a], 'lines':lines[i]};
        }
    }
    return null;
}