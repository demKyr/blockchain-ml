import Link from "next/link";

function HomePage() {
  return (
    <div>
      <h1>This is the home page</h1>
      <ul>
        <li>
          <Link href="/submit">Submit</Link>
        </li>
        <li>
          <Link href="/review">Review</Link>
        </li>
        <li>
          <Link href="/verify">Predict</Link>
        </li>
        <li>
          <Link href="/predict">Predict</Link>
        </li>
      </ul>
    </div>
  );
}

export default HomePage;
