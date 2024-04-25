import type {
  Adapter,
  DatabaseSession,
  RegisteredDatabaseSessionAttributes,
  DatabaseUser,
  RegisteredDatabaseUserAttributes,
  UserId,
} from 'lucia';

export class MockAdapter implements Adapter {
  private sessionModel: MockModel<SessionSchema>;

  constructor(sessionModel: BasicModel) {
    this.sessionModel = sessionModel as MockModel<SessionSchema>;
  }

  public async deleteSession(sessionId: string): Promise<void> {
    try {
      await this.sessionModel.deleteManyById(sessionId);
    } catch {
      // ignore if session id is invalid
    }
  }

  public async deleteUserSessions(userId: UserId): Promise<void> {
    await this.sessionModel.deleteManyById(userId);
  }

  public async getSessionAndUser(
    sessionId: string
  ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
    const result = await this.sessionModel.findUnique(sessionId);
    if (!result) return [null, null];
    const forTSType = result as SessionSchema & { user: UserSchema };
    const { user, ...sessionData } = forTSType;
    return [transformIntoDatabaseSession(sessionData), transformIntoDatabaseUser(user)];
  }

  public async getUserSessions(userId: UserId): Promise<DatabaseSession[]> {
    const result = await this.sessionModel.findMany(userId);
    return result.map(transformIntoDatabaseSession);
  }

  public async setSession(value: DatabaseSession): Promise<void> {
    await this.sessionModel.create({
      id: value.id,
      userId: value.userId,
      expiresAt: value.expiresAt,
      ...value.attributes,
    });
  }

  public async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
    await this.sessionModel.updateExpiresAt(sessionId, expiresAt);
  }

  public async deleteExpiredSessions(): Promise<void> {
    await this.sessionModel.deleteManyExpired?.();
  }
}

function transformIntoDatabaseSession(raw: SessionSchema): DatabaseSession {
  const { id, userId, expiresAt, ...attributes } = raw;
  return {
    id,
    userId,
    expiresAt,
    attributes,
  };
}

function transformIntoDatabaseUser(raw: UserSchema): DatabaseUser {
  const { id, ...attributes } = raw;
  return {
    id,
    attributes,
  };
}

interface BasicModel {
  findUnique: any;
}

interface UserSchema extends RegisteredDatabaseUserAttributes {
  id: UserId;
}

interface SessionSchema extends RegisteredDatabaseSessionAttributes {
  id: string;
  userId: UserId;
  expiresAt: Date;
}

interface MockModel<_Schema extends {}> {
  name: string;
  findUnique: (id: string) => Promise<null | _Schema>;
  findMany: (id: string) => Promise<_Schema[]>;
  create: (data: _Schema) => Promise<_Schema>;
  updateExpiresAt: (id: string, expiresAt: Date) => Promise<_Schema>;
  deleteManyById: (id: string) => Promise<void>;
  deleteManyExpired?: () => Promise<void>;
}
