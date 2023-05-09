import { useContext, useState, useEffect, MouseEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IGame } from "../../../dto/domain/IGame";
import { isIRestApiErrorResponse } from "../../../dto/IRestApiErrorResponse";
import { GameService } from "../../../services/GameService";
import { AuthContext } from "../../Root";

const GameDelete = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const { id } = useParams();

    const [game, setGame] = useState(null as IGame | null);
    const [error, setError] = useState(null as string | null);

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

    const Error = () => {
        if (error) {
            return <div className="text-danger">`{error}`</div>
        } else {
            return <></>
        }
    }

    if (game) {
        const onSubmit = async (event: MouseEvent) => {
            event.preventDefault();

            const gameService = new GameService(authContext);
            gameService.deleteById(game.id).then(success => {
                if (success) {
                    navigate('/Crud/Game');
                } else {
                    setError('Failed to delete');
                }
            });
        }
    return (
        <>
            <h1>Delete</h1>

            <Error />
            <h3>Are you sure you want to delete this?</h3>
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

                <button onClick={e => onSubmit(e)} className="btn btn-danger">Delete</button>
                <Link to="/Crud/Game">Back to List</Link>
            </div>
        </>
    );
    } else {
        return <div>LOADING GAME</div>
    }
}

export default GameDelete;