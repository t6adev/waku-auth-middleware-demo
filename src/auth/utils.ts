// From https://lucia-auth.com/guides/email-and-password/basics

export const validateUsername = (username: unknown): username is string => {
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (
    typeof username !== 'string' ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return false;
  }
  return true;
};

export const validatePassword = (password: unknown): password is string => {
  if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
    return false;
  }
  return true;
};
