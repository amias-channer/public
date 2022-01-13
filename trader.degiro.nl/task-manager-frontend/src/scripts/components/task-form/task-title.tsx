import * as React from 'react';
import Cell from '../grid/cell';
import * as gridStyles from '../grid/grid.css';
import * as taskFormStyles from './task-form.css';

const TaskTitle: React.FunctionComponent = ({children}) => (
    <div className={gridStyles.row}>
        <Cell size={12} className={taskFormStyles.taskTitle} data-name="taskTitle">
            {children}
        </Cell>
    </div>
);

export default React.memo<React.PropsWithChildren<{}>>(TaskTitle);
