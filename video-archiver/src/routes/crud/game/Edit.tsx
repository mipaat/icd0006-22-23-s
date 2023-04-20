import { useParams } from "react-router-dom";

const GameEdit = () => {
    const {id} = useParams();

    return <>Edit {id}</>
}

export default GameEdit;