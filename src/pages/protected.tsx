import { Link } from 'waku';
import { validateInRSC } from '../auth/validateInRSC';

export default async function ProtectedtPage() {
  const auth = await validateInRSC();
  if (!auth.user) {
    return <div>Invalid auth: Unexpected here.</div>;
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
