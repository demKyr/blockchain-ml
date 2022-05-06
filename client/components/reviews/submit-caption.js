import { useRef } from "react";

import Button from "../ui/button";
import classes from "./submit-caption.module.css";

function SubmitCaption(props) {
  const captionInputRef = useRef();
  const lblInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const givenCaption = captionInputRef.current.value;
    const givenLbl = lblInputRef.current.value;

    if (!isNaN(+givenLbl) && givenCaption.length > 0) {
      props.onSubmitCaption(givenCaption, +givenLbl);
    }
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.controls}>
        <div className={classes.mainControl}>
          <label htmlFor="caption">Caption</label>
          <input type="text" required id="caption" ref={captionInputRef} />
        </div>
        <div className={classes.secondaryControl}>
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
        <div className={classes.secondaryControl}>
          <Button>Submit Caption</Button>
        </div>
      </div>
    </form>
  );
}

export default SubmitCaption;
