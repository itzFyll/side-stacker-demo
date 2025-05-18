import React from 'react';

type PlayerInfoProps = {
  player: string;
  isActive: boolean;
};

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, isActive }) => (
  <div>
    {player} {isActive && '(Your turn)'}
  </div>
);

export default PlayerInfo;