/**
 * Draws a dotted line on a jsPDF doc between two points.
 * Note that the segment length is adjusted a little so
 * that we end the line with a drawn segment and don't
 * overflow.
*/
function DottedLine(ParamPDF, xFrom, yFrom, xTo, yTo, segmentLength) {
    // Calculate line length (c)
    var a = Math.abs(xTo - xFrom);
    var b = Math.abs(yTo - yFrom);
    var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    // Make sure we have an odd number of line segments (drawn or blank)
    // to fit it nicely
    var fractions = c / segmentLength;
    var adjustedSegmentLength = (Math.floor(fractions) % 2 === 0) ? (c / Math.ceil(fractions)) : (c / Math.floor(fractions));

    // Calculate x, y deltas per segment
    var deltaX = adjustedSegmentLength * (a / c);
    var deltaY = adjustedSegmentLength * (b / c);

    var curX = xFrom, curY = yFrom;
    while (curX <= xTo && curY <= yTo) {
        ParamPDF.setLineWidth(0.25);
        ParamPDF.line(curX, curY, curX + deltaX, curY + deltaY);
        curX += 2 * deltaX;
        curY += 2 * deltaY;
    }
}

module.exports = { DottedLine }