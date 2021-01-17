import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import win from '../../src/trophy.svg';
import bet from '../../src/bet.svg';
import price from '../../src/price.svg';

function PlayCard(props) {
    const { playerInfo, isWinner } = props;
    return (
        playerInfo && <div className={isWinner ? 'player-card green-border scale' : 'player-card red-border'}>
            <Row>
                <Col md={4}>
                    <img src={playerInfo['Profile Image']} width="50" height="50"></img></Col>
                <Col>{playerInfo.Name}</Col>
            </Row>
            <Row>
                <Col md={7} className="ellipses"><img src={price} width="20" height="20"></img>{playerInfo.Price ? playerInfo.Price : 0}</Col>
                <Col md="auto"><img src={bet} width="20" height="20"></img>{playerInfo.Bet ? playerInfo.Bet : 0}</Col>
            </Row>
            <Row><img src={win} className="ml-15" width="20" height="20"></img>{playerInfo.Wins ? playerInfo.Wins : 0}</Row>
            <Row className="justify-content-md-center"><Col md={8} className={isWinner ? "result-border bg-green" : "result-border"}>{isWinner ? "WINNER" : "LOSE"}</Col></Row>
        </div>
    );
}

export default PlayCard;