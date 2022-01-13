import * as React from 'react';
import { filterOptionAllId } from '../../../services/filter';
const HiddenNativeOption = ({ children }) => (React.createElement("option", { disabled: true, hidden: true, value: filterOptionAllId }, children));
export default React.memo(HiddenNativeOption);
//# sourceMappingURL=hidden-native-option.js.map