import { useRef } from "react";

import Button from "../ui/button";
import classes from "./request-model.module.css";

function RequestModel(props) {
  const nameInputRef = useRef();
  const descriptionInputRef = useRef();
  const NumOfVotesInputRef = useRef();
  const NumOfCaptionsInputRef = useRef();
  const labelsInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const givenName = nameInputRef.current.value;
    const givenDescription = descriptionInputRef.current.value;
    const givenNumOfVotes = NumOfVotesInputRef.current.value;
    const givenNumOfCaptions = NumOfCaptionsInputRef.current.value;
    const givenlabels = labelsInputRef.current.value;

    if (!isNaN(+givenNumOfVotes) && !isNaN(+givenNumOfCaptions)) {
      props.onRequestModel(
        givenName,
        givenDescription,
        givenNumOfVotes,
        givenNumOfCaptions,
        givenlabels
      );
    }
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.controls}>
        <div className={classes.mainControl} id={classes.Name}>
          <label htmlFor="Name">Name of Model</label>
          <input type="text" required id="Name" ref={nameInputRef} />
        </div>

        <div className={classes.mainControl}>
          <label htmlFor="description">Description</label>
          <textarea
            placeholder="Give short description of the model and give an example"
            required
            id="description"
            rows="5"
            ref={descriptionInputRef}
          ></textarea>
        </div>

        <div className={classes.mainControl}>
          <label htmlFor="NumOfVotes">Number of Votes for verification</label>
          <input
            type="text"
            required
            id="NumOfVotes"
            ref={NumOfVotesInputRef}
          />
        </div>

        <div className={classes.mainControl}>
          <label htmlFor="NumOfCaptions">Number of Captions requested</label>
          <input
            type="text"
            required
            id="NumOfCaptions"
            ref={NumOfCaptionsInputRef}
          />
        </div>

        <div className={classes.mainControl}>
          <label htmlFor="labels">Labels</label>
          <textarea
            placeholder="Give the labels for the requested captions separated with commas and without spaces or quotes (eg positive,negative,neutral)"
            required
            id="labels"
            rows="5"
            ref={labelsInputRef}
          ></textarea>
        </div>

        <div className={classes.secondaryControl}>
          <Button>Request Model</Button>
        </div>
      </div>
    </form>
  );
}

export default RequestModel;
