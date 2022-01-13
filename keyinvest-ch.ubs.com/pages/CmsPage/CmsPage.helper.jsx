import React from 'react';
import CmsComponentsContainer from '../../components/CmsComponentsContainer';

// eslint-disable-next-line import/prefer-default-export
export const generateCmsLayout = (content) => {
  if (content && content.length) {
    return content.map(
      (row, rowIndex) => row.map(
        (cell, cellIndex) => (
          <CmsComponentsContainer
            key={cell.id || cell.url || `r-${rowIndex}-c-${cellIndex}`}
            components={cell.components}
          />
        ),
      ),
    );
  }
  return [];
};
