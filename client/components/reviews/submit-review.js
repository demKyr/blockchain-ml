import Button from "../ui/button";
import classes from "./submit-review.module.css"

function SubmitReview(props) {
    return (
      <form className={classes.form}>
        <div className={classes.controls}>
          <div className={classes.control}>
            <label htmlFor="caption">Caption</label>
            <input type="text" required id="caption" />
          </div>
          <div className={classes.control}>
            <label htmlFor="lbl">Label</label>
            <select required>
              <option disabled selected value> -- select an option --</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
        </div>
        <Button>Submit Caption</Button>
      </form>
    );
}

export default SubmitReview;