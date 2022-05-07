import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useState, useContext, useRef, useEffect } from "react";

import ContractsContext from "../../store/contract-context";
import ReviewCaption from "../../components/reviews/review-caption";
import ReviewCaptionList from "../../components/reviews/review-caption-list";

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
          const captionsData = [];
          const captionsDataInput = await contractsCtx.contracts[
            "submitReview"
          ].getCaptions();
          for (const key in captionsDataInput) {
            console.log(captionsDataInput[key][5] == signerAddr);
            if (
              !captionsDataInput[key][3] &&
              !(captionsDataInput[key][5] == signerAddr)
            ) {
              const captionData = {
                id: key,
                content: captionsDataInput[key][0],
              };
              captionsData.push(captionData);
            }
          }

          setIsLoading(false);
          setLoadedCaptions(captionsData);
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

  async function ReviewCaptionHandler(idx, lbl) {
    if (active) {
      try {
        await contractsCtx.contracts["submitReview"].reviewCaption(idx, lbl, {
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
      <ReviewCaptionList
        captions={loadedCaptions}
        onReviewCaption={ReviewCaptionHandler}
      />
    </div>
  );
}

export default ReviewPage;
