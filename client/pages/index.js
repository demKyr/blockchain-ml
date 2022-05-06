import Link from "next/link";
import { useWeb3React } from "@web3-react/core";
import { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

import { submitReviewAbi } from "../constants/submitReview-abi";
import { contractAddresses } from "../constants/contract-address";
import ContractsContext from "../store/contract-context";


function HomePage() {
  const [loading, setLoading] = useState(true);
  const contractsCtx = useContext(ContractsContext);
  const { account, library: provider } = useWeb3React();

  useEffect(() => {
    function setCtxs() {
      const signer = provider.getSigner();
      const contractAddress = contractAddresses["submitReview"];
      const contract = new ethers.Contract(
        contractAddress,
        submitReviewAbi,
        signer
      );
      contractsCtx.addContract("submitReview", contract);
    }
    setCtxs();
  }, []);

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
          <Link href="/verified">Verified</Link>
        </li>
        <li>
          <Link href="/predict">Predict</Link>
        </li>
      </ul>
    </div>
  );
}

export default HomePage;
