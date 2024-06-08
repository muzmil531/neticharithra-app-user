import { formatDistanceToNow } from 'date-fns'

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



import { Dimensions } from 'react-native';

export const { width, height } = Dimensions.get('window');
// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;

export const scaleFont = (fontSize) => {
  const scaleFactor = width / guidelineBaseWidth;
  const scaledFontSize = fontSize * scaleFactor;
  return Math.round(scaledFontSize);
};



const screenHeight = Dimensions.get('window').height;

export const calculateNumberOfLines = (percentageHeight, fontSize) => {
    const availableHeight = (percentageHeight / 100) * screenHeight;
    const lineHeight = fontSize * 1.2; // Approximate line height
    const numberOfLines = Math.floor(availableHeight / lineHeight);
    return numberOfLines;
};


export function timeAgo(date) {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
}