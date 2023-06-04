import { LangString } from "../dto/LangString";

interface IProps {
    langString: LangString | null,
}

const LangStringDisplay = (props: IProps) => {
    return <>{props.langString?.translate()}</>
}

export default LangStringDisplay;