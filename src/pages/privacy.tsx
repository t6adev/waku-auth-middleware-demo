import { Link } from 'waku';

export default async function PrivacyPage() {
  return (
    <div>
      <title>Privacy Policy</title>
      <p>text text text</p>
      <Link to="/" className="mt-4 inline-block underline">
        Return home
      </Link>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  };
};
