import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';

//Actions
import { fetchStats, resetStats } from "../actions/StatActions";
import Loader from "./elements/Loader";

function StatsReport(props) {

    const isFetching = props.stats.byId.isFetching;

    const dispatch = useDispatch();

    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        dispatch(fetchStats());

        let interval = setInterval(
            () => {
                dispatch(fetchStats());
            }, 10000
        );
        setIntervalId(interval);

        return function clean() {
            dispatch(resetStats());
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [])

    const stats = props.stats.allIds.map(idStat => {
        const stat = props.stats.byId.stats[idStat];

        const score = stat.score;
        const nickname = stat.nickname;
        const createdAt = stat.createdAt;
        return (
            <tr key={stat.id}>
                <td>{nickname}</td>
                <td className="font-weight-bold">{score}</td>
                <td>{createdAt}</td>
            </tr>
        )
    });

    return (
        <section className="psh-game psh-game-report">
            <div className="psh-game-report-container">
                <h1>Top 10 Players</h1>
                <div className="table-responsive mt-3 mx-1">
                    <table className="table psh-game-report-table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Player</th>
                                <th scope="col">Score</th>
                                <th scope="col">Creation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                isFetching ?
                                    <tr>
                                        <td colSpan={3}>
                                            <Loader display={true} />
                                        </td>
                                    </tr>
                                    :
                                    stats
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

function mapStateToProps(state) {
    return {
        stats: state.stats,
    };
}

export default connect(mapStateToProps)(StatsReport);