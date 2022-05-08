import ReviewCaption from "./review-caption";
import classes from "./review-caption-list.module.css";

function ReviewCaptionList(props) {
  return (
    <ul>
      <h2>{props.myName}</h2>
      {!props.myCaptions.length && <p className={classes.noOutputMsg}>No captions available for this model</p>}
      {props.myCaptions.map((caption) => (
        <ReviewCaption
          myCaption={caption.content}
          myId={caption.id}
          myModelId={props.myModelId}
          myLabels={props.myLabels}
          onReviewCaption={props.onReviewCaption}
        />
      ))}
    </ul>
  );
}

export default ReviewCaptionList;
