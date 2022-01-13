import * as React from 'react';
import Cell from '../grid/cell';
import * as gridStyles from '../grid/grid.css';
import TextWithHints from '../text-with-hints';
import * as taskFormStyles from './task-form.css';

interface Props {
    translationCode: string;
    renderHint?: (hintTranslationCode: string) => React.ReactNode | React.ReactNode[];
}

const TaskDescription: React.FunctionComponent<Props> = ({translationCode, renderHint}) => (
    <div className={gridStyles.row}>
        <Cell size={12} className={taskFormStyles.taskDescription}>
            <TextWithHints renderHint={renderHint} translationCode={translationCode} />
        </Cell>
    </div>
);

export default React.memo(TaskDescription);
