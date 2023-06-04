import classNames from "classnames";
import { ReactNode } from "react";

interface IProps {
    page: number,
    currentPage: number,
    onPageChange: PageChangeAction,
    children?: ReactNode
}

export type PageChangeAction = ((page: number) => Promise<void>) | ((page: number) => void);

const PaginationButton = (props: IProps) => {
    return <button onClick={_ => props.onPageChange(props.page)}
        className={classNames({
            btn: true,
            'btn-primary': props.page === props.currentPage,
            'btn-outline-primary': props.page !== props.currentPage
        })}>
        {props.children ?? <>{props.page + 1}</>}
    </button>
}

export default PaginationButton;