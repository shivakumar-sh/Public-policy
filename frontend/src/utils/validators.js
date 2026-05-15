/**
 * Simple email validation
 * @param {string} email 
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Password strength validation (min 8 chars)
 * @param {string} password 
 * @returns {boolean}
 */
export const validatePassword = (password) => {
  return password && password.length >= 8;
};
