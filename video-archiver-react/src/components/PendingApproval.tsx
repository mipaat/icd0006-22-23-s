interface IPendingApprovalProps {
    pendingApproval?: boolean;
}

const PendingApproval = (props: IPendingApprovalProps) => {
    if (props.pendingApproval === true || props.pendingApproval === undefined) return (
        <>
            <h2 className="text-danger">
                This user account must be approved by an administrator before it can be used.
            </h2>
            <h3>Please try logging in again later.</h3>
        </>
    );
    return <></>
};

export default PendingApproval;
