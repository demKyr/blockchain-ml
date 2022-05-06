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

  useEffect(() => {
    async function fetchData() {
      if (active) {
        setIsLoading(true);
        try {
          const captionsData = [];
          const captionsDataInput = await contractsCtx.contracts[
            "submitReview"
          ].getCaptions();
          for (const key in captionsDataInput) {
            if (!captionsDataInput[key][3]) {
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
      <ReviewCaptionList captions={loadedCaptions}/>
    </div>
  );
}

export default ReviewPage;
