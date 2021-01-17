import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import win from '../../src/trophy.svg';
import bet from '../../src/bet.svg';
import price from '../../src/price.svg';
import dice from '../../src/dice.png';
import Button from 'react-bootstrap/Button';
import Play from '../component/play';
import axios from 'axios';


class PlayerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerList: [],
            isPlaying: false,
            selectedPlayer: [],
            filteredPlayer: [],
            search: '',
            isLoading: true
        }
        this.route = this.route.bind(this);
        this.updateResult = this.updateResult.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSort = this.handleSort.bind(this);
    }

    componentDidMount() {
        axios.get("https://s3-ap-southeast-1.amazonaws.com/he-public-data/bets7747a43.json")
            .then(res => {
                this.setState({ playerList: res.data, filteredPlayer: res.data, isLoading: false });
            })
    }

    handleCheck(index, event) {
        let selectedList = this.state.selectedPlayer;
        let list = this.state.filteredPlayer;
        list[index].isSelected = !list[index].isSelected;
        if ((list[index].isSelected) && selectedList.length > 8) {
            alert("Slot filled for 9 players");
            list[index].isSelected = false;
        }

        if (selectedList.length <= 9) {
            if (list[index].isSelected) {
                if (selectedList.filter(e => e.Name === list[index].Name).length === 0) {
                    selectedList.push(list[index]);
                }
            } else {
                const ind = selectedList.findIndex(ele => ele.Name === list[index].Name);
                if (ind !== -1) {
                    selectedList.splice(ind, 1);
                }
            }
        }
        this.setState({ filteredPlayer: list, selectedPlayer: selectedList })
    }

    route(value) {
        this.setState({ isPlaying: value });
    }

    updateResult(playerInfo) {
        let playersList = this.state.playerList;
        const playerIndex = playersList.findIndex(player => player.Name === playerInfo.Name);
        playersList[playerIndex] = playerInfo;
        let selectedPlayers = this.state.selectedPlayer;
        const selectIndex = selectedPlayers.findIndex(player => player.Name === playerInfo.Name);
        selectedPlayers[selectIndex] = playerInfo;
        this.setState({ playerList: playersList, filteredPlayer: playersList, selectedPlayer: selectedPlayers });
    }

    getRow() {
        return this.state.filteredPlayer.map((ele, index) => {
            return <tr>
                <td>  <input
                    type="checkbox"
                    id="autoSizingCheck"
                    className="mb-2"
                    checked={ele.isSelected}
                    onChange={(e) => { if (this.state.selectedPlayer.length < 3) { e.stopPropagation(); } this.handleCheck(index, e) }}
                /></td>
                <td>{ele.Name}</td>
                <td><img src={ele['Profile Image']} width="50" height="50"></img></td>
                <td>{ele.Bet ? ele.Bet : 0}</td>
                <td>{ele.Wins ? ele.Wins : 0}</td>
                <td>{ele.Lost ? ele.Lost : 0}</td>
                <td>{ele.Price ? ele.Price : 0}</td>
            </tr>

        })
    }

    handleChange(event) {
        if (event.target.value !== '') {
            let filtered = this.state.playerList.filter(player => player.Name.includes(event.target.value));
            this.setState({ filteredPlayer: filtered });
        } else {
            this.setState({ filteredPlayer: this.state.playerList });
        }
    }

    handleSort(key, value) {
        let list = this.state.filteredPlayer;
        list.sort((a, b) => {
            if (value === 'asc') {
                return a[key] - b[key];
            } else {
                return b[key] - a[key];
            }
        })
        this.setState({ filteredPlayer: list });
    }

    render() {
        return (
            <div>
                {this.state.isPlaying ? <Play playerList={this.state.selectedPlayer}
                    updateResult={this.updateResult}
                    route={this.route} /> : <div className="player-list">
                        <div className="player-list left-nav">
                            <img src={dice} width="250" height="180"></img>
                            <div className="playing">Playing {this.state.selectedPlayer.length}</div>
                            {this.state.selectedPlayer.map(ele => {
                                return <div className="selected-player" key={ele.Name}>
                                    <Row>
                                        <Col md={3}>
                                            <img src={ele['Profile Image']} width="50" height="50"></img>
                                        </Col>
                                        <Col md={5}>
                                            <div>{ele.Name}</div>
                                            <div><img src={win} width="15" height="20"></img><span>{ele.Wins ? ele.Wins : 0}</span><span className="ml-15"><img src={bet} width="20" height="20"></img>{ele.bet ? ele.bet : 0}</span></div>
                                        </Col>
                                        <Col md={4}>
                                            <img src={price} width="20" height="20"></img>{ele.Price ? ele.Price : 0}
                                        </Col>
                                    </Row>

                                </div>
                            })}
                            {this.state.selectedPlayer.length > 8 && <div className="start-btn"><Button variant="primary" onClick={() => this.route(true)}>START</Button></div>}
                        </div>
                        <div className="player-list player-table">
                            <input text="text" placeholder="Search Players" onChange={this.handleChange} />
                            {this.state.isLoading ? <div>Loading...</div> :
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Select</th>
                                            <th>Player Name</th>
                                            <th>Avatar</th>
                                            <th className="flex"><span><img src={bet} width="20" height="20" />Bet</span><span><p className="arrow-up" onClick={() => this.handleSort('Bet', 'desc')}></p><div className="arrow-down" onClick={() => this.handleSort('Bet', 'asc')}></div></span></th>
                                            <th><img src={win} width="20" height="20" />Wins</th>
                                            <th>Lost</th>
                                            <th className="flex"><span><img src={price} width="20" height="20" />Price</span><span><p className="arrow-up" onClick={() => this.handleSort('Price', 'desc')}></p><div className="arrow-down" onClick={() => this.handleSort('Price', 'asc')}></div></span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.getRow()}
                                    </tbody>
                                </Table>}
                        </div>
                    </div>}
            </div>
        );
    }
}

export default PlayerList;