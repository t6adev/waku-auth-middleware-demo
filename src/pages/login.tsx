import { Link } from 'waku';

import { SignIn } from '../components/SignIn';
import { signin } from '../actions/signin';

export default async function LoginPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Login</h2>
      <div className="mt-4">
        <SignIn signin={signin} />
      </div>
      <p className="mt-4">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  };
};
