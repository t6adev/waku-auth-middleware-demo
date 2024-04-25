import { Link } from 'waku';
import { SignUp } from '../components/SignUp';
import { signup } from '../actions/signup';

export default async function SignUpPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Create an account</h2>
      <div className="mt-4">
        <SignUp signup={signup} />
      </div>
      <p className="mt-4">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  };
};
