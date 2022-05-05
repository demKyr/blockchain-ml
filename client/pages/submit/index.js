import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useState, useContext, useRef } from "react";

import ContractsContext from "../../store/contract-context";
import SubmitCaption from "../../components/reviews/submit-caption";

function SubmitPage() {
  const { activate, active, library: provider } = useWeb3React();
  const contractsCtx = useContext(ContractsContext);

  async function SubmitCaptionHandler(caption, lbl) {
    if (active) {
      try {
        await contractsCtx.contracts["submitReview"].addCaption(caption, lbl, {
          value: ethers.utils.parseEther("1"),
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      document.getElementById("executeButton").innerHTML =
        "Please install Metamask";
    }
  }

  return (
    <div>
      <h1 className="instruction">Submit a caption with its label</h1>
      <SubmitCaption onSubmitCaption={SubmitCaptionHandler} />
    </div>
  );
}

export default SubmitPage;
