import ReviewCaptionList from "./review-caption-list";

function ReviewCaptionListOfLists(props){
    return (
      <ul>
        {props.capsPerModel.map((model) => (
          <ReviewCaptionList
            myKey={model.key}
            myName={model.name}
            myDescription={model.description}
            myLabels={model.labels}
            myModelId={model.modelId}
            myCaptions={model.captions}
            onReviewCaption={props.onReviewCaption}
          />
        ))}
      </ul>
    );
}

export default ReviewCaptionListOfLists;