import { Link } from 'waku';
import { unstable_rerenderRoute } from 'waku/router/server';
import { validateInRSC } from '../auth/validateInRSC';

export default async function ProtectedtPage() {
  const auth = await validateInRSC();
  if (!auth.user) {
    unstable_rerenderRoute('/login');
    return;
  }
  const { user } = auth;

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">Protected Page</h1>
      <p>Hey, {user.username}</p>
      <Link to="/" className="mt-4 inline-block underline">
        Return home
      </Link>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  };
};
