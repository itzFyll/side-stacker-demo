import React from 'react';

type CellProps = {
  value: string;
};

const Cell: React.FC<CellProps> = ({ value }) => (
  <div className="cell">{value}</div>
);

export default Cell;