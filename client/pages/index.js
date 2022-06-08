import Link from "next/link";
import { useWeb3React } from "@web3-react/core";
import { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

import { submitReviewAbi } from "../constants/submitReview-abi";
import { contractAddresses } from "../constants/contract-address";
import ContractsContext from "../store/contract-context";
import classes from "./index.module.css";
import Image from "next/image";

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
      <h1 className={classes.title}>Welcome to DEMOS</h1>
      <div className={classes.logo}>
        <Image src="/logo.png" alt="home" width="350" height="350" />
      </div>
      <p className={classes.bodyText}>
        DEMOS (Distributedly Enhanced Machine learning Optimization System) is a
        dApp (decentrilazed Application) which uses a{" "}
        <strong>Blockchain Network</strong> in order to collect, store and use
        data to train <strong>Supervised Learning Models on NLP</strong>{" "}
        (Natural Language Processing)
        <br />
        <br />
        DEMOS uses a{" "}
        <a
          href="https://huggingface.co/bert-base-uncased?text=Paris+is+the+%5BMASK%5D+of+France"
          target="_blank"
        >
          pretrained model
        </a>{" "}
        by Hugging Face team based on{" "}
        <a href="https://arxiv.org/abs/1810.04805" target="_blank">
          BERT
        </a>{" "}
        (Bidirectional Encoder Representations from Transformers) language
        representation model
        <br />
        <br />
        <br />
        With DEMOS you can:
        <br />
        <br />
      </p>
      <ul className={classes.bodyText}>
        <li>
          <strong>Request</strong> data to be collected for a specific NLP
          problem
        </li>
        <li>
          <strong>Submit</strong> data for other NLP problems
        </li>
        <li>
          <strong>Review</strong> submited data for other NLP problems
        </li>
        <li>
          Use NLP models to <strong>Predict</strong> labels for given captions
        </li>
        <li>
          Use data provided and verified by other users to{" "}
          <strong>Train</strong> your model
        </li>
        <li>
          Observe the history of the <strong>Evaluation</strong> of your models
        </li>
      </ul>
    </div>
  );
}

export default HomePage;
