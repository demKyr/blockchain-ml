import ReviewCaption from "./review-caption";

function ReviewCaptionList(props){
    return (
      <ul>
        {props.captions.map((caption) => (
          <ReviewCaption
            myCaption={caption.content}
            myId={caption.id}
            onReviewCaption={props.onReviewCaption}
          />
        ))}
      </ul>
    );
}

export default ReviewCaptionList;