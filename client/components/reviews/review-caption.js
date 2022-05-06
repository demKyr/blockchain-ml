import { useRef } from "react";

import Button from "../ui/button";
import classes from "./review-caption.module.css";

function ReviewCaption(props) {
  const lblInputRef = useRef();

  function reviewHandler(event){
    event.preventDefault();

    const givenLbl = lblInputRef.current.value;
    if (!isNaN(+givenLbl)) {
      props.onReviewCaption(props.myId, givenLbl);
    }
  }


  return (
    <form className={classes.form} onSubmit={reviewHandler}>
      <div className={classes.controls}>
        <div className={classes.control}>
          <label htmlFor="caption">Caption</label>
          <h2>{props.myCaption}</h2>
        </div>
        <div className={classes.control}>
          <label htmlFor="lbl">Label</label>
          <select required defaultValue={"default"} id="lbl" ref={lblInputRef}>
            <option value="default" disabled>
              -- select an option --
            </option>
            <option value="0">Positive</option>
            <option value="1">Negative</option>
            <option value="2">Neutral</option>
          </select>
        </div>
      </div>
      <Button>Review Caption</Button>
    </form>
  );
}

export default ReviewCaption;
