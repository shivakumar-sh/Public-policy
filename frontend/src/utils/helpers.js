/**
 * Formats a date string into a readable format
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Truncates text to a specified length
 * @param {string} text 
 * @param {number} length 
 * @returns {string}
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Copies text to clipboard
 * @param {string} text 
 */
export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

/**
 * Downloads a string as a file
 * @param {string} content 
 * @param {string} filename 
 */
export const downloadFile = (content, filename) => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
