import Link from "next/link";
import Image from "next/image";

import classes from "./main-header.module.css";

function MainHeader() {
  const localPathname = window.location.pathname;
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link href="/">
          <a>
            <Image
              src="/Thesis_Logo_2.png"
              alt="home"
              width="100"
              height="100"
            />
          </a>
        </Link>
      </div>

      <nav>
        <ul>
          <li
            className={
              localPathname == "/request"
                ? classes.selectedTab
                : classes.nonSelectedTab
            }
          >
            <Link href="/request">Request</Link>
          </li>
          <li
            className={
              localPathname == "/submit"
                ? classes.selectedTab
                : classes.nonSelectedTab
            }
          >
            <Link href="/submit">Submit</Link>
          </li>
          <li
            className={
              localPathname == "/review"
                ? classes.selectedTab
                : classes.nonSelectedTab
            }
          >
            <Link href="/review">Review</Link>
          </li>
          <li
            className={
              localPathname == "/predict"
                ? classes.selectedTab
                : classes.nonSelectedTab
            }
          >
            <Link href="/predict">Predict</Link>
          </li>
          <li
            className={
              localPathname == "/verified"
                ? classes.selectedTab
                : classes.nonSelectedTab
            }
          >
            <Link href="/verified">Train</Link>
          </li>
          <li
            className={
              localPathname == "/evaluation"
                ? classes.selectedTab
                : classes.nonSelectedTab
            }
          >
            <Link href="/evaluation">Evaluation</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainHeader;
