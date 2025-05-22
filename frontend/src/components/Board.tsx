import React from 'react';
import './Board.css';
import classNames from 'classnames';

type Cell = 'x' | 'o' | null;

interface BoardProps {
  board: Cell[][];
  onCellClick: (row: number, side: 'L' | 'R') => void;
  currentPlayer: 'x' | 'o';
  disabled?: boolean;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, currentPlayer, disabled }) => {
  const className = classNames(
    'stacker--board',
    { 'stacker--board--disabled': disabled },
  );

  return (
    <div className={className}>
      <div className="stacker--board__current-player">
        <strong>
          Current Player:{' '}
          <span
            className={`stacker--board__player stacker--board__player--${currentPlayer}`}
          >
            {currentPlayer?.toUpperCase()}
          </span>
        </strong>
      </div>
      <table className="stacker--board__table">
        <tbody>
          {board?.map((row, rowIdx) => (
            <tr key={rowIdx} className="stacker--board__row">
              <td>
                <button
                  className="stacker--board__side-btn"
                  onClick={() => onCellClick(rowIdx, 'L')}
                  title="Add from left"
                  disabled={disabled}
                >
                  ⬅️
                </button>
              </td>
              {row.map((cell, colIdx) => (
                <td key={colIdx}>
                  <div
                    className={`stacker--board__cell stacker--board__cell--${cell ?? 'empty'}`}
                  >
                    {cell ? cell.toUpperCase() : ''}
                  </div>
                </td>
              ))}
              <td>
                <button
                  className="stacker--board__side-btn"
                  onClick={() => onCellClick(rowIdx, 'R')}
                  title="Add from right"
                  disabled={disabled}
                >
                  ➡️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Board;