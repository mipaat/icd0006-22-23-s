import { Link } from "react-router-dom";
import { IGame } from "../../../dto/domain/IGame";
import queryString from 'query-string';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Root";
import { GameService } from "../../../services/GameService";
import { isIRestApiErrorResponse } from "../../../dto/IRestApiErrorResponse";

const GameIndexHeader = () => {
    return (
        <tr>
            <th>
                IgdbId
            </th>
            <th>
                Name
            </th>
            <th>
                BoxArtUrl
            </th>
            <th>
                Etag
            </th>
            <th>
                LastFetched
            </th>
            <th>
                LastSuccessfulFetch
            </th>
            <th></th>
        </tr>
    );
}

interface IGameIndexRowProps {
    game: IGame
}

const GameIndexRow = (props: IGameIndexRowProps) => {
    return (
        <tr>
            <td>
                {props.game.igdbId}
            </td>
            <td>
                {props.game.name}
            </td>
            <td>
                {props.game.boxArtUrl}
            </td>
            <td>
                {props.game.etag}
            </td>
            <td>
                {props.game.lastFetched.toLocaleString()}
            </td>
            <td>
                {props.game.lastSuccessfulFetch?.toLocaleString()}
            </td>
            <td>
                <Link to={`Edit/${encodeURIComponent(props.game.id)}`}>Edit</Link> |{"\u00A0"}
                <Link to={`Details/${encodeURIComponent(props.game.id)}`}>Details</Link> |{"\u00A0"}
                <Link to={`Delete/${encodeURIComponent(props.game.id)}`}>Delete</Link>
            </td>
        </tr>
    );
}

const GameIndex = () => {
    const authContext = useContext(AuthContext);

    const [games, setGames] = useState(null as IGame[] | null);

    useEffect(() => {
        const gameService = new GameService(authContext);
        async function fetchAndUpdateGames() {
            const fetchedGames = await gameService.getAll();
            if (!isIRestApiErrorResponse(fetchedGames) && fetchedGames !== undefined) {
                setGames(fetchedGames);
            }
        }
        fetchAndUpdateGames();
    }, [authContext]);

    const GameIndexList = () => {
        if (games) {
            return <>
                {games.map((entity, index) => {
                    return <GameIndexRow key={index} game={entity} />
                })}
            </>
        } else {
            return <></>
        }
    }

    const GamesTable = () => {
        if (games) {
            return (
                <table className="table">
                    <thead>
                        <GameIndexHeader />
                    </thead>
                    <tbody>
                        <GameIndexList />
                    </tbody>
                </table>
            );
        } else {
            return <div>LOADING GAMES</div>
        }
    }

    return <>
        <h1>Index</h1>

        <p>
            <Link to="Create">Create New</Link>
        </p>

        <GamesTable />
    </>
}

export default GameIndex;