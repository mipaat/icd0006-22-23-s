export function centerVertically(element) {
    element.style.position = "relative";
    element.style.top = "50%";
    element.style.transform = "translateY(-50%)";
}

export function centerHorizontally(element) {
    element.style.margin = "auto";
    element.style.textAlign = "center";
}

/**
 * @param {HTMLElement} element 
 */
export function removeAllChildNodes(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}