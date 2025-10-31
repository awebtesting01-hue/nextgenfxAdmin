import react from "react";
import ComponentCard from "../../common/ComponentCard";
import Checkbox from "../input/Checkbox";
function CheckboxComponents() {
    var _a = (0, react_1.useState)(false), isChecked = _a[0], setIsChecked = _a[1];
    var _b = (0, react_1.useState)(true), isCheckedTwo = _b[0], setIsCheckedTwo = _b[1];
    var _c = (0, react_1.useState)(false), isCheckedDisabled = _c[0], setIsCheckedDisabled = _c[1];
    return (<ComponentCard title="Checkbox">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Checkbox checked={isChecked} onChange={setIsChecked}/>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Default
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox checked={isCheckedTwo} onChange={setIsCheckedTwo} label="Checked"/>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox checked={isCheckedDisabled} onChange={setIsCheckedDisabled} disabled label="Disabled"/>
        </div>
      </div>
    </ComponentCard>);
}
export default CheckboxComponents;
