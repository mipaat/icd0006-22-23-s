import { IAuthor, getNameDisplay } from "../dto/IAuthor";

interface IProps {
    author: IAuthor,
}

const AuthorSummary = (props: IProps) => {
    return (
        <div className="gap-1 d-flex">
            <div className="d-inline-block">
                {(props.author.profileImages?.length ?? 0) > 0 ?
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img loading="lazy" src={props.author.profileImages![0].url} width={40} height={40} alt="Profile image" /> :
                    <div>No profile image</div>}
            </div>
            <div className="d-inline-block">
                {props.author.urlOnPlatform ?
                    <a href={props.author.urlOnPlatform}>{getNameDisplay(props.author)}</a> :
                    <span>{getNameDisplay(props.author)}</span>}
            </div>
        </div>
    );
}

export default AuthorSummary;