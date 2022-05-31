import { useRef, useState } from "react";

import Button from "../ui/button";
import classes from "./predict-caption.module.css";
import ModalComponent from "./subcomponents/modal-component";

function PredictCaption(props) {
  const captionInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const givenCaption = captionInputRef.current.value;

    if ( givenCaption.length > 0) {
      props.onPredictCaption(givenCaption, props.myId);
    }
  }

  return (
    <div>
      <ModalComponent
        myName={props.myName}
        myDescription={props.myDescription}
      />
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.controls}>
          <div className={classes.mainControl}>
            <label htmlFor="caption">Caption</label>
            <input type="text" required id="caption" ref={captionInputRef} />
          </div>
          <div className={classes.secondaryControl}>
            <Button>Predict Caption</Button>
          </div>

          <div className={classes.secondaryControl}>
            <label htmlFor="lbl">Prediction</label>
            <label htmlFor="prediction">Positive</label>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PredictCaption;
