"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CheckboxComponents;
var react_1 = require("react");
var ComponentCard_1 = require("../../common/ComponentCard");
var Checkbox_1 = require("../input/Checkbox");
function CheckboxComponents() {
    var _a = (0, react_1.useState)(false), isChecked = _a[0], setIsChecked = _a[1];
    var _b = (0, react_1.useState)(true), isCheckedTwo = _b[0], setIsCheckedTwo = _b[1];
    var _c = (0, react_1.useState)(false), isCheckedDisabled = _c[0], setIsCheckedDisabled = _c[1];
    return (<ComponentCard_1.default title="Checkbox">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Checkbox_1.default checked={isChecked} onChange={setIsChecked}/>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Default
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox_1.default checked={isCheckedTwo} onChange={setIsCheckedTwo} label="Checked"/>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox_1.default checked={isCheckedDisabled} onChange={setIsCheckedDisabled} disabled label="Disabled"/>
        </div>
      </div>
    </ComponentCard_1.default>);
}
