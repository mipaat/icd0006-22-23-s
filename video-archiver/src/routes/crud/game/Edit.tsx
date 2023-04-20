import { useContext, useEffect, useState, MouseEvent, ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isDate } from "util/types";
import { IGame } from "../../../dto/domain/IGame";
import { IGameData } from "../../../dto/domain/IGameData";
import { isIRestApiErrorResponse } from "../../../dto/IRestApiErrorResponse";
import { GameService } from "../../../services/GameService";
import { AuthContext } from "../../Root";
import {DateTime} from "luxon";

const GameEdit = () => {
    const authContext = useContext(AuthContext);

    const navigate = useNavigate();

    const [validationErrors, setValidationErrors] = useState([] as string[]);

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

    const handleChange = (target: EventTarget & HTMLInputElement) => {
        console.log("handleChange", game);
        if (game) {
            setGame({ ...game, [target.name]: target.value });
        }
    }

    const onSubmit = async (event: MouseEvent) => {
        event.preventDefault();
        const newValidationErrors = [] as string[];
        if (game) {
            console.log(game);
            if (!game.igdbId) {
                console.log(game.igdbId);
                newValidationErrors.push("IgdbID is required");
            }
            if (!game.name) {
                newValidationErrors.push("Name is required");
            }
            if (!game.lastFetched) {
                newValidationErrors.push("LastFetched is required");
            }
            if (newValidationErrors.length > 0) {
                setValidationErrors(newValidationErrors);
                return;
            }

            const gameService = new GameService(authContext);
            const result = await gameService.update(game);
            if (result) {
                setValidationErrors([result]);
            }

            navigate("/Crud/Game/");
        }
    }

    if (game) {
        return (
            <>
                <h1>Edit</h1>


                <ul style={{ 'display': validationErrors.length == 0 ? 'none' : '' }}>
                    <li>{validationErrors.length > 0 ? validationErrors[0] : ''}</li>
                </ul>

                <h4>Game</h4>
                <hr />
                <div className="row">
                    <div className="col-md-4">
                        <form>
                            <div className="form-group">
                                <label className="control-label" htmlFor="igdbId">IgdbId</label>
                                <input
                                    className="form-control"
                                    onChange={e => handleChange(e.target)}
                                    type="text"
                                    id="igdbId"
                                    maxLength={16}
                                    name="igdbId"
                                    value={game.igdbId} />
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="name">Name</label>
                                <input
                                    className="form-control"
                                    onChange={e => handleChange(e.target)}
                                    type="text"
                                    id="name"
                                    maxLength={512}
                                    name="name"
                                    value={game.name} />
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="boxArtUrl">BoxArtUrl</label>
                                <input
                                    className="form-control"
                                    onChange={e => handleChange(e.target)}
                                    type="text"
                                    maxLength={4096}
                                    name="boxArtUrl"
                                    value={game.boxArtUrl ?? ""} />
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="eTag">Etag</label>
                                <input
                                    className="form-control"
                                    onChange={e => handleChange(e.target)}
                                    type="text"
                                    id="eTag" maxLength={4096}
                                    name="eTag"
                                    value={game.eTag ?? ""} />
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="lastFetched">LastFetched</label>
                                <input
                                    className="form-control"
                                    onChange={e => setGame({...game, lastFetched: getDateFromDateString(e.target.value)})}
                                    type="datetime-local"
                                    id="lastFetched"
                                    name="lastFetched"
                                    value={getDateString(game.lastFetched)} />
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="lastSuccessfulFetch">LastSuccessfulFetch</label>
                                <input
                                    className="form-control"
                                    onChange={e => setGame({...game, lastSuccessfulFetch: getDateFromDateString(e.target.value)})}
                                    type="datetime-local"
                                    id="lastSuccessfulFetch"
                                    name="lastSuccessfulFetch"
                                    value={getDateString(game.lastSuccessfulFetch)} />
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Save" className="btn btn-primary" onClick={e => onSubmit(e)} />
                            </div>
                        </form>
                    </div>
                </div>

                <div>
                    <Link to="/Crud/Game">Back to List</Link>
                </div>

            </>
        );
    } else {
        return <div>LOADING GAME</div>
    }
}

function getDateString(date: Date | null): string {
    date ??= new Date();
    return DateTime.fromJSDate(date).toISO({includeOffset: false})!;
}

function getDateFromDateString(dateString: string): Date {
    console.log(DateTime.fromISO(dateString).toJSDate())
    return DateTime.fromISO(dateString).toJSDate();
}

export default GameEdit;