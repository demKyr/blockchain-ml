import VerifiedCaption from "./verified-caption";

function VerifiedCaptionList(props) {
  return (
    <ul>
      {props.captions.map((caption) => (
        <VerifiedCaption
          myCaption={caption.content}
          myProposedLbl={caption.proposedLbl}
          myVerifiedLbl={caption.verifiedLbl}
          myGoodData={caption.goodData}
        />
      ))}
    </ul>
  );
}

export default VerifiedCaptionList;