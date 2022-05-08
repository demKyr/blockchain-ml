import SubmitCaption from "./submit-caption";

function SubmitCaptionList(props) {
  return (
    <ul>
      {props.models.map((model) => (
        <SubmitCaption
          myKey={model.myKey}
          myName={model.name}
          myDescription={model.description}
          myLabels={model.labels}
          myId={model.id}
          onSubmitCaption={props.onSubmitCaption}
        />
      ))}
    </ul>
  );
}
export default SubmitCaptionList;
