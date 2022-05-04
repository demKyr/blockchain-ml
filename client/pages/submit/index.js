import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { abi } from "../../constants/abi";

import SubmitCaption from "../../components/reviews/submit-caption";

function SubmitPage() {
  const { activate, active, library: provider } = useWeb3React();

  async function SubmitCaptionHandler(caption, lbl) {
    if (active) {
      const signer = provider.getSigner();
      const contractAddress = "0xd9B79a39DA867C6050F976AAf13c1051cCdc0D24";
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        await contract.addCaption(caption, lbl, {
          value: ethers.utils.parseEther("1")
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
