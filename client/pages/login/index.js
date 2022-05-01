import styles from "../../styles/Home.module.css";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useRouter } from "next/router";
import { ethers } from "ethers";
// import { abi } from "../../constants/abi";

const injected = new InjectedConnector();

function LoginPage() {
//   const { activate, active, library: provider } = useWeb3React();
  const { activate, active} = useWeb3React();
  const router = useRouter();

  async function connect() {
    try {
      await activate(injected);
      router.push({
          pathname: '/'
      });
    } catch (e) {
      console.log(e);
    }
  }

//   async function execute() {
//     if (active) {
//       const signer = provider.getSigner();
//       const contractAddress = "0x0BAe79c4C2ee55f8bA24cAed11524d5DC7F8613B";
//       const contract = new ethers.Contract(contractAddress, abi, signer);
//       try {
//         await contract.store(42);
//       } catch (error) {
//         console.log(error);
//       }
//     } else {
//       document.getElementById("executeButton").innerHTML =
//         "Please install Metamask";
//     }
//   }

  return (
    <div className={styles.container}>
      {active ? (
        <>
          Connected
        </>
      ) : (
        <button onClick={() => connect()}>Connect</button>
      )}
    </div>
  );
}


export default LoginPage;