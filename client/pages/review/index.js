import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useState, useContext, useRef, useEffect } from "react";

import ContractsContext from "../../store/contract-context";
import ReviewCaption from "../../components/reviews/review-caption";
import ReviewCaptionList from "../../components/reviews/review-caption-list";
import ReviewCaptionListOfLists from "../../components/reviews/review-caption-listOfLists";

function ReviewPage() {
  const { activate, active, library: provider } = useWeb3React();
  const contractsCtx = useContext(ContractsContext);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCaptions, setLoadedCaptions] = useState([]);
  const signer = provider.getSigner();

  useEffect(() => {
    async function fetchData() {
      if (active) {
        setIsLoading(true);
        try {
          const signerAddr = await signer.getAddress();
          // const captionsData = [];
          const captionsPerModel = [];

          const modelsDataInput = await contractsCtx.contracts[
            "submitReview"
          ].getModels();
          for (const key in modelsDataInput) {
            const captionsPerModelInstance = {
              key: key,
              modelId: parseInt(modelsDataInput[key][0]),
              name: modelsDataInput[key][1],
              description: modelsDataInput[key][2],
              labels: modelsDataInput[key][5],
              captions: [],
            };
            captionsPerModel.push(captionsPerModelInstance);
          }
          // console.log(captionsPerModel);

          const captionsDataInput = await contractsCtx.contracts[
            "submitReview"
          ].getCaptions();
          for (const key in captionsDataInput) {
            if (
              !captionsDataInput[key][5] &&
              !(captionsDataInput[key][6] == signerAddr) &&
              !captionsDataInput[key][7].includes(signerAddr)
            ) {
              const captionData = {
                id: key,
                content: captionsDataInput[key][0],
              };
              captionsPerModel[captionsDataInput[key][1]]["captions"].push(
                captionData
              );
            }
          }
          // console.log(captionsPerModel);
          setIsLoading(false);
          setLoadedCaptions(captionsPerModel);
        } catch (error) {
          console.log(error);
        }
      } else {
        document.getElementById("executeButton").innerHTML =
          "Please install Metamask";
      }
    }
    fetchData();
  }, []);

  async function ReviewCaptionHandler(idx, lbl, modelId) {
    if (active) {
      try {
        await contractsCtx.contracts["submitReview"].reviewCaption(
          idx,
          lbl,
          modelId,
          {
            value: ethers.utils.parseEther("0.001"),
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

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <div>
      <h1 className="instruction">Review Captions</h1>
      <ReviewCaptionListOfLists
        capsPerModel={loadedCaptions}
        onReviewCaption={ReviewCaptionHandler}
      />
      {/* <ReviewCaptionList
        captions={loadedCaptions}
        onReviewCaption={ReviewCaptionHandler}
      /> */}
    </div>
  );
}

export default ReviewPage;
