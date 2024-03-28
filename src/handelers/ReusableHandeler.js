export function epochToDate(epoch) {
    // Convert epoch to milliseconds
    const date = new Date(epoch );

    // Array of month names
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Get month, day, and year
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    // Construct the date string in the format "MMM DD, YYYY"
    const dateString = `${month} ${day}, ${year}`;

    return dateString;
}


