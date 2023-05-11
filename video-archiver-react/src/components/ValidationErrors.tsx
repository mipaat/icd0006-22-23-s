interface IProps {
    errors: string[];
}

const ValidationErrors = (props: IProps) => {
    if (props.errors.length === 0) {
        return <></>;
    }
    return (
        <ul>
            {props.errors.map((error, index) => {
                return <li key={error}>{error}</li>;
            })}
        </ul>
    );
};

export default ValidationErrors;
