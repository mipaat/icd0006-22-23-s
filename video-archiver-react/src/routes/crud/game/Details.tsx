import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IGame } from "../../../dto/domain/IGame";
import { isIRestApiErrorResponse } from "../../../dto/IRestApiErrorResponse";
import { GameService } from "../../../services/GameService";
import { AuthContext } from "../../Root";

const GameDetails = () => {
    const authContext = useContext(AuthContext);

    const { id } = useParams();

    const [game, setGame] = useState(null as IGame | null);

    useEffect(() => {
        if (id) {
            const gameService = new GameService(authContext);
            const fetchAndUpdateGame = async () => {
                const fetchedGame = await gameService.getById(id);
                if (!isIRestApiErrorResponse(fetchedGame) && fetchedGame !== undefined) {
                    setGame(fetchedGame);
                }
            }
            fetchAndUpdateGame();
        }
    }, [authContext]);

    if (game) {
        return (
            <>
                <h1>Details</h1>

                <div>
                    <h4>Game</h4>
                    <hr />
                    <dl className="row">
                        <dt className="col-sm-2">
                            IgdbId
                        </dt>
                        <dd className="col-sm-10">
                            {game.igdbId}
                        </dd>
                        <dt className="col-sm-2">
                            Name
                        </dt>
                        <dd className="col-sm-10">
                            {game.name}
                        </dd>
                        <dt className="col-sm-2">
                            BoxArtUrl
                        </dt>
                        <dd className="col-sm-10">
                            {game.boxArtUrl}
                        </dd>
                        <dt className="col-sm-2">
                            Etag
                        </dt>
                        <dd className="col-sm-10">
                            {game.etag}
                        </dd>
                        <dt className="col-sm-2">
                            LastFetched
                        </dt>
                        <dd className="col-sm-10">
                            {game.lastFetched.toLocaleString()}
                        </dd>
                        <dt className="col-sm-2">
                            LastSuccessfulFetch
                        </dt>
                        <dd className="col-sm-10">
                            {game.lastSuccessfulFetch?.toLocaleString()}
                        </dd>
                    </dl>
                </div>
                <div>
                    <Link to={`/Crud/Game/Edit/${encodeURIComponent(game.id)}`} >Edit</Link> |{"\u00A0"}
                    <a href="../">Back to List</a>
                </div>
            </>
        );
    } else {
        return <div>LOADING GAME</div>
    }
}

export default GameDetails;