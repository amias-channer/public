/**
 * @description Adds 0.5px to an y-coordinate to avoid anti-aliasing effect. See links for more detail:
 * @link https://stackoverflow.com/questions/23376308/avoiding-lines-between-adjecent-svg-rectangles/23376793#23376793
 * @link https://github.com/d3/d3-axis/blob/master/src/axis.js#L15
 * @param {number} originalCoordinate
 * @returns {string}
 */
export default function translateY(originalCoordinate: number) {
    let refinedCoordinate = Math.round(originalCoordinate * 2) / 2;

    if (Number.isInteger(refinedCoordinate)) {
        refinedCoordinate += 0.5;
    }

    return `translate(0,${refinedCoordinate})`;
}
