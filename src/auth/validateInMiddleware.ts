import { validateSessionToken, type SessionValidationResult } from './session';

export const validateInMiddleware = async (
  sessionToken: string | null
): Promise<SessionValidationResult | null> => {
  if (!sessionToken) {
    return null;
  }

  const result = await validateSessionToken(sessionToken);
  return result;
};
