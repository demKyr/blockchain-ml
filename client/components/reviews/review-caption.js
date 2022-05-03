import Button from "../ui/button";
import classes from "./review-caption.module.css";

function ReviewCaption(props) {
  return (
    <form className={classes.form}>
      <div className={classes.controls}>
        <div className={classes.control}>
          <label htmlFor="caption">Caption</label>
          <h2>This is a caption</h2>
        </div>
        <div className={classes.control}>
          <label htmlFor="lbl">Label</label>
          <select required>
            <option disabled selected value>
              {" "}
              -- select an option --
            </option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
      </div>
      <Button>Review Caption</Button>
    </form>
  );
}

export default ReviewCaption;
