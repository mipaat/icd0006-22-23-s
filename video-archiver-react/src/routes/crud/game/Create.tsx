import { useContext, useState, MouseEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IGameData } from "../../../dto/domain/IGameData";
import { GameService } from "../../../services/GameService";
import { AuthContext } from "../../Root";
import { DateTime } from "luxon";

const GameCreate = () => {
    const authContext = useContext(AuthContext);

    const navigate = useNavigate();

    const [validationErrors, setValidationErrors] = useState([] as string[]);

    const [gameData, setGameData] = useState({
        igdbId: "",
        name: "",
        boxArtUrl: "",
        etag: "",
        lastFetched: null as Date | null,
        lastSuccessfulFetch: null as  Date | null,
    } as IGameData);

    const handleChange = (target: EventTarget & HTMLInputElement) => {
        if (gameData) {
            setGameData({ ...gameData, [target.name]: target.value });
        }
    }

    const onSubmit = async (event: MouseEvent) => {
        event.preventDefault();
        const newValidationErrors = [] as string[];
        if (gameData) {
            if (!gameData.igdbId) {
                newValidationErrors.push("IgdbID is required");
            }
            if (!gameData.name) {
                newValidationErrors.push("Name is required");
            }
            if (!gameData.lastFetched) {
                newValidationErrors.push("LastFetched is required");
            }
            if (newValidationErrors.length > 0) {
                setValidationErrors(newValidationErrors);
                return;
            }

            const gameService = new GameService(authContext);
            const result = await gameService.create(gameData);
            if (result) {
                setValidationErrors([result]);
            }

            navigate("/Crud/Game/");
        }
    }

    if (gameData) {
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
                                    value={gameData.igdbId ?? ""} />
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
                                    value={gameData.name ?? ""} />
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="boxArtUrl">BoxArtUrl</label>
                                <input
                                    className="form-control"
                                    onChange={e => handleChange(e.target)}
                                    type="text"
                                    maxLength={4096}
                                    name="boxArtUrl"
                                    value={gameData.boxArtUrl ?? ""} />
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="etag">Etag</label>
                                <input
                                    className="form-control"
                                    onChange={e => handleChange(e.target)}
                                    type="text"
                                    id="etag" maxLength={4096}
                                    name="etag"
                                    value={gameData.etag ?? ""} />
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="lastFetched">LastFetched</label>
                                <input
                                    className="form-control"
                                    onChange={e => setGameData({ ...gameData, lastFetched: getDateFromDateString(e.target.value) })}
                                    type="datetime-local"
                                    id="lastFetched"
                                    name="lastFetched"
                                    value={getDateString(gameData.lastFetched)} />
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="lastSuccessfulFetch">LastSuccessfulFetch</label>
                                <input
                                    className="form-control"
                                    onChange={e => setGameData({ ...gameData, lastSuccessfulFetch: getDateFromDateString(e.target.value) })}
                                    type="datetime-local"
                                    id="lastSuccessfulFetch"
                                    name="lastSuccessfulFetch"
                                    value={getDateString(gameData.lastSuccessfulFetch)} />
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
    return DateTime.fromJSDate(date).toISO({ includeOffset: false })!;
}

function getDateFromDateString(dateString: string): Date {
    return DateTime.fromISO(dateString).toJSDate();
}

export default GameCreate;