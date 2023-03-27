export function removeAllChildNodes(element: HTMLElement) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export function rollProbability(probability: number) {
    return Math.random() < probability;
}