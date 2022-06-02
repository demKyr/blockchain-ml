import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useState, useContext, useRef, useEffect } from "react";

import ContractsContext from "../../store/contract-context";
import PredictCaptionList from "../../components/reviews/predict-caption-list";
// import { APIpath } from "../../constants/parameters";

function PredictPage() {
  const { activate, active, library: provider } = useWeb3React();
  const contractsCtx = useContext(ContractsContext);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedModels, setLoadedModels] = useState([]);

  // const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (active) {
        setIsLoading(true);
        try {
          const modelsData = [];
          const modelsDataInput = await contractsCtx.contracts[
            "submitReview"
          ].getModels();
          for (const key in modelsDataInput) {
            const modelData = {
              key: key,
              id: parseInt(modelsDataInput[key][0]),
              name: modelsDataInput[key][1],
              description: modelsDataInput[key][2],
              labels: modelsDataInput[key][5],
            };
            modelsData.push(modelData);
          }
          setIsLoading(false);
          setLoadedModels(modelsData);
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

  // async function PredictCaptionHandler(caption, modelId) {
  //   if (active) {
  //     try {

  //       // axios({
  //       //   method: "post",
  //       //   url: "myurl",
  //       //   data: bodyFormData,
  //       //   headers: { "Content-Type": "multipart/form-data" },
  //       // }).then(function (response) {
  //       //   //handle success
  //       //   console.log(response);
  //       // });


  //         // Axios({
  //         //   method: "post",
  //         //   mode: "no-cors",
  //         //   headers: { "Content-Type": "application/json" },
  //         //   url: APIpath + "/test",
  //         //   data: caption,
  //         // })
  //         //   .then(function (response) {
  //         //     console.log(response);
  //         //   })
  //         //   .catch(function (error) {
  //         //     console.log(error);
  //         //   });
        

  //       const reqOptions = {
  //         method: "POST",
  //         // mode: "no-cors",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Access-Control-Allow-Origin": "*",
  //         },
  //         body: JSON.stringify({ caption: caption }),
  //       };

        
  //       console.log(reqOptions);
  //       fetch(APIpath + "/test", reqOptions)
  //         // .then((res) => {
  //         //   console.log(res);
  //         // });
  //         .then((res) => res.text())
  //         .then((data) => {
  //           // setData(data);
  //           console.log(data);
  //         });

  //       // const req2Options = {
  //       //   method: "GET",
  //       //   // mode: "no-cors",
  //       // };

  //       // console.log(req2Options);
  //       // fetch(APIpath + "/evaluate", req2Options)
  //       //   .then((res) => res.json())
  //       //   .then((data) => {
  //       //     // setData(data);
  //       //     console.log(data);
  //       //   });

  //       // }, []);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     document.getElementById("executeButton").innerHTML =
  //       "Please install Metamask";
  //   }
  // }

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <div>
      <h1 className="instruction">Predict label for a caption</h1>
      <PredictCaptionList
        models={loadedModels}
        // onPredictCaption={PredictCaptionHandler}
      />
    </div>
  );
}

export default PredictPage;
