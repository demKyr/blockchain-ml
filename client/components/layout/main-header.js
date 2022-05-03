import Link from "next/link";

import classes from "./main-header.module.css";

function MainHeader() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link href="/">Home page</Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link href="/submit">Submit</Link>
          </li>
          <li>
            <Link href="/review">Review</Link>
          </li>
          <li>
            <Link href="/verify">Verify</Link>
          </li>
          <li>
            <Link href="/predict">Predict</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainHeader;
