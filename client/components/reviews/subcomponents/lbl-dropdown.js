import { Fragment } from "react";
import { labelMapping } from "../../../constants/parameters";

function LblDropdown(props) {
  return (
    <Fragment>
      <option value="default" disabled>
        -- select an option --
      </option>
      {labelMapping.map((lbl, idx) => (
        <option value={idx}>{lbl}</option>
      ))}
    </Fragment>
  );
}

export default LblDropdown;
