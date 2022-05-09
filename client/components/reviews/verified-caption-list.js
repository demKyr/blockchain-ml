import VerifiedCaption from "./verified-caption";

function VerifiedCaptionList(props) {
  return (
    <ul>
      <h2>{props.myName}</h2>
      {!props.myCaptions.length && (
        <p className="noOutputMsg">No captions available for this model</p>
      )}
      {props.myCaptions.map((caption) => (
        <VerifiedCaption
          myKey={caption.id}
          myCaption={caption.content}
          myProposedLbl={caption.proposedLbl}
          myVerifiedLbl={caption.verifiedLbl}
          myGoodData={caption.goodData}
          myLabels={props.myLabels}
        />
      ))}
    </ul>
  );
}

export default VerifiedCaptionList;
