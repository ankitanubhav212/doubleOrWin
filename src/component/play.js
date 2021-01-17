import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import PlayCard from './playerCard';

function Play(props) {


    const [count, setCount] = useState(null);
    const [winners, setWinners] = useState([]);

    const generateRandom = () => {
        let newWinner = [];
        const randNumber = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
        setCount(randNumber);
        props.playerList.forEach((player, index) => { if (player.Bet == randNumber) { newWinner.push(index); } });
        let updatedPlayerList = props.playerList;
        updatedPlayerList.forEach((player, index) => {
            if (newWinner.includes(index)) {
                player.Price = player.Price ? player.Price * 2 : player.Price;
                player.Wins = player.Wins ? player.Wins + 1 : 1;
            } else {
                player.Lost = player.Lost ? player.Lost + 1 : 1;
            }
            props.updateResult(player);
        });
        setWinners(newWinner);
    }

    return (
        <div className="play-backgound">
            <div className="top-row">
                {props.playerList.map((obj, index) => {
                    if (index > 4) {
                        return null;
                    }
                    const isWinner = winners.includes(index);
                    return <PlayCard playerInfo={obj} isWinner={isWinner} />
                })}
            </div>
            <div className="roll">
                {count}
            </div>
            <div className="roll-btn"><Button variant="primary" onClick={generateRandom}>Roll</Button></div>
            <div className="bottom-row">
                {props.playerList.map((obj, index) => {
                    if (index < 5) {
                        return null;
                    }
                    const isWinner = winners.includes(index);
                    return <PlayCard playerInfo={obj} isWinner={isWinner} />
                })}
            </div>
            <div className="ml-15">
                <Button variant="dark" onClick={() => props.route(false)}>Back</Button>
            </div>
        </div>
    );
}

export default Play;