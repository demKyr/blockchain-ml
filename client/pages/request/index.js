import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useState, useContext, useRef } from "react";

import ContractsContext from "../../store/contract-context";
import RequestModel from "../../components/reviews/request-model";

function RequestPage() {
  const { activate, active, library: provider } = useWeb3React();
  const contractsCtx = useContext(ContractsContext);

  async function RequestModelHandler(
    name,
    description,
    NumOfVotes,
    NumOfCaptions,
    labels
  ) {
    if (active) {
      try {
        const labelsArray = labels.split(",");
        console.log(name, description, NumOfVotes, NumOfCaptions, labelsArray);
        await contractsCtx.contracts["submitReview"].addModel(
          name,
          description,
          NumOfVotes,
          NumOfCaptions,
          labelsArray,
          {
            value: ethers.utils.parseEther("1"),
          }
        );
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
      <h1 className="instruction">Request captions for a model</h1>
      <RequestModel onRequestModel={RequestModelHandler} />
    </div>
  );
}

export default RequestPage;
