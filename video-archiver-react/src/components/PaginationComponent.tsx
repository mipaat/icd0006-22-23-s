import { isOnlyPage } from "../utils/PaginationUtils";
import PaginationButton, { PageChangeAction } from "./PaginationButton";

interface IProps {
    page: number,
    limit: number,
    total: number | null,
    amountOnPage: number,
    onPageChange: PageChangeAction;
}

const PaginationComponent = (props: IProps) => {
    const totalPages = props.total === null ? null :
        Math.ceil(props.total / props.limit);

    const pageRangeStart = props.limit * props.page + 1;

    const pageRangeEnd = props.limit * props.page + props.amountOnPage;

    interface IPaginationItem {
        page: number,
        previousPage?: number | null,
    }

    let pagesSelection = [] as IPaginationItem[];

    let maxAddedPage = 0;
    let previousPage = null as number | null;
    const selectionAmountToShow = 5;
    if (props.page - Math.ceil(selectionAmountToShow / 2) > 0) {
        pagesSelection.push({ page: 0 });
        previousPage = 0;
    }
    let selectedAmount = 0;
    let offset = 0;
    while (selectedAmount < selectionAmountToShow) {
        const page = props.page - Math.ceil(selectionAmountToShow / 2) + offset;
        if (page < 0) {
            offset++;
            continue;
        }
        if (totalPages && page >= totalPages) {
            break;
        }
        if (!totalPages && page > props.page) {
            break;
        }
        if (pagesSelection.some(p => p.page === page)) {
            offset++;
            continue;
        }
        maxAddedPage = page;
        pagesSelection.push({ page: page, previousPage: previousPage });
        previousPage = page;
        offset++;
        selectedAmount++;
    }
    if (totalPages && maxAddedPage < totalPages - 1) {
        pagesSelection.push({ page: totalPages, previousPage: previousPage });
        previousPage = totalPages;
    }

    const PaginationResultsSummary = () => {
        if (props.amountOnPage === 0) return <div>0 results on page</div>
        if (props.total) return <div>
            Showing {pageRangeStart}-{pageRangeEnd} of {props.total} results
        </div>
        if (props.amountOnPage < props.limit) return <div>
            Showing {pageRangeStart}-{pageRangeEnd} of {pageRangeEnd} results
        </div>
        return <div>
            Showing {pageRangeStart}-{pageRangeEnd} results (of unknown total)
        </div>
    }

    if (isOnlyPage(props.total, props.limit) || (props.page === 0 && props.amountOnPage < props.limit)) {
        return <div>Results: {props.amountOnPage}</div>
    }
    return <div>
        <div className="d-flex gap-1">
            {pagesSelection.map((selectionPage, index) => {
                return <div key={index}>
                    {selectionPage.previousPage !== undefined
                        && selectionPage.previousPage !== null
                        && selectionPage.previousPage + 1 < selectionPage.page ?
                        <span className="rounded-3 p-2">...</span> : <></>
                    }
                    <PaginationButton
                        page={selectionPage.page}
                        currentPage={props.page}
                        onPageChange={props.onPageChange} />
                </div>
            })}
            {(!props.total && props.amountOnPage >= props.limit) ?
                <PaginationButton
                    page={props.page + 1}
                    currentPage={props.page}
                    onPageChange={props.onPageChange}>
                    Next
                </PaginationButton> : <></>
            }
        </div>
        <PaginationResultsSummary />
    </div>
}

export default PaginationComponent;