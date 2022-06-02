import VerifiedCaption from "./verified-caption";
import ModalComponent from "./subcomponents/modal-component";


function VerifiedCaptionList(props) {
  return (
    <ul>
      <ModalComponent
        myName={props.myName}
        myDescription={props.myDescription}
      />
      {!props.myCaptions.length && (
        <p className="noOutputMsg">No captions available for this model</p>
      )}
      {props.myCaptions.map((caption) => (
        <VerifiedCaption
          key={caption.id}
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
