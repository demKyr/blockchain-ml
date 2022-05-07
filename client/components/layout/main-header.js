import Link from "next/link";

import classes from "./main-header.module.css";

function MainHeader() {
  const localPathname = window.location.pathname;
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link href="/">Home page</Link>
      </div>
      <nav>
        <ul>
          <li className={localPathname == "/request" && classes.selectedTab}>
            <Link href="/request">Request</Link>
          </li>
          <li className={localPathname == "/submit" && classes.selectedTab}>
            <Link href="/submit">Submit</Link>
          </li>
          <li className={localPathname == "/review" && classes.selectedTab}>
            <Link href="/review">Review</Link>
          </li>
          <li className={localPathname == "/verified" && classes.selectedTab}>
            <Link href="/verified">Verified</Link>
          </li>
          <li className={localPathname == "/predict" && classes.selectedTab}>
            <Link href="/predict">Predict</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainHeader;
