interface IProps<T> {
    values: T[],
}

interface IToString {
    toString: () => string,
}

const SelectListOptions = <T extends IToString,>(props: IProps<T>) => {
    return (<>
        {props.values.map((value) => {
            return (
                <option
                    key={value.toString()}>
                    {value.toString()}
                </option>
            );
        })}
    </>)
};

export default SelectListOptions;