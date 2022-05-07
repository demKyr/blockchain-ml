import { useWeb3React } from "@web3-react/core";
import { useState, useContext, useRef, useEffect } from "react";

import ContractsContext from "../../store/contract-context";
import VerifiedCaptionList from "../../components/reviews/verified-caption-list";
import { NumOfVotes, labelMapping } from "../../constants/parameters";

function VerifyPage() {
  const { activate, active } = useWeb3React();
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
            if (captionsDataInput[key][3]) {
              let verifiedLabel;
              if (captionsDataInput[key][4]) {
                verifiedLabel = captionsDataInput[key][1];
              } else {
                for (const k in captionsDataInput[key][2]) {
                  if (captionsDataInput[key][2][k] == NumOfVotes) {
                    verifiedLabel = k;
                  }
                }
              }
              const captionData = {
                id: key,
                content: captionsDataInput[key][0],
                proposedLbl: labelMapping[captionsDataInput[key][1]],
                verifiedLbl: labelMapping[verifiedLabel],
                goodData: captionsDataInput[key][4],
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
      <h1 className="instruction">Verified Captions</h1>
      <VerifiedCaptionList captions={loadedCaptions} />
    </div>
  );
}

export default VerifyPage;
