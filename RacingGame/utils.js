/**
 * @param {HTMLElement} element 
 */
export function removeAllChildNodes(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export function rollProbability(probability) {
    return Math.random() < probability;
}