import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="">
      <Link prefetch={false} href={{
        pathname: '/[username]',
        query: { username: 'shecodez'}
      }}><a>Niico's profile</a></Link>
    </div>
  );
}
