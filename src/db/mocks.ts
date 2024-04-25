const data: { users: User[]; sessions: Session[] } = {
  users: [],
  sessions: [],
};

const sleep = (time: number) => new Promise((resolve) => setTimeout(() => resolve(true), time));

class BaseModel {
  constructor(name: 'users' | 'sessions') {
    this.name = name;
  }
  name: 'users' | 'sessions';

  async findUnique(id: string): Promise<any> {
    await sleep(500);
    // Yes, this is lazy
    const session = data.sessions.find((u) => u.id === id);
    const userBySessionId = data.users.find((u) => u.id === session?.userId);
    if (this.name === 'sessions') {
      return session ? { ...session, user: userBySessionId } : null;
    }
    const user = data.users.find((u) => u.id === id);
    const sessionByUserId = data.sessions.find((s) => s.userId === user?.id);
    return user ? { ...user, session: sessionByUserId } : null;
  }

  async findMany(id: string): Promise<any[]> {
    await sleep(500);
    const found = data[this.name].filter((u) => u.id === id);
    return found;
  }

  async create(attributes: any): Promise<any> {
    await sleep(500);
    data[this.name].push(attributes);
    return attributes;
  }

  async updateExpiresAt(id: string, expiresAt: Date): Promise<any> {
    await sleep(500);
    const found = data[this.name].find((u) => u.id === id);
    if (!found) throw new Error('Not found');
    const updated = { ...found, expiresAt };
    data[this.name].map((d) => {
      if (d.id === id) {
        return updated;
      }
      return d;
    });
    return updated;
  }

  async deleteManyById(id: string): Promise<void> {
    await sleep(500);
    // @ts-ignore
    data[this.name] = data[this.name].filter((d) => d.id !== id);
  }
}

interface User {
  id: string;
  username: string;
  hashed_password: string;
}
export class UserModel<U extends User> extends BaseModel {
  constructor() {
    super('users');
  }
  async findUnique(id: string): Promise<U | null> {
    return super.findUnique(id);
  }

  async findMany(id: string): Promise<U[]> {
    return super.findMany(id);
  }

  async create(attributes: U): Promise<U> {
    return super.create(attributes);
  }

  async updateExpiresAt(id: string, expiresAt: Date): Promise<U> {
    return super.updateExpiresAt(id, expiresAt);
  }

  async deleteManyById(id: string): Promise<void> {
    return super.deleteManyById(id);
  }
}

interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  // fresh: boolean;
}
export class SessionModel<S extends Session> extends BaseModel {
  constructor() {
    super('sessions');
  }
  async findUnique(id: string): Promise<S | null> {
    return super.findUnique(id);
  }

  async findMany(id: string): Promise<S[]> {
    return super.findMany(id);
  }

  async create(attributes: S): Promise<S> {
    return super.create(attributes);
  }

  async updateExpiresAt(id: string, expiresAt: Date): Promise<S> {
    return super.updateExpiresAt(id, expiresAt);
  }

  async deleteManyById(id: string): Promise<void> {
    return super.deleteManyById(id);
  }
  async deleteManyExpired(): Promise<void> {
    await sleep(500);
    data.sessions = data.sessions.filter((d) => d.expiresAt.getTime() > new Date().getTime());
  }
}
