import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import HttpService from '../../../utils/httpService';
import Logger from '../../../utils/logger';
import { DESKTOP_MODE, MOBILE_MODE, TABLET_MODE } from '../../../utils/responsive';
import Icon from '../../Icon';
import HistoryTable from '../../HistoryTable';
import Headline from '../../Headline';
import i18n from '../../../utils/i18n';
import './AsyncHistoryLightbox.scss';

export const AsyncHistoryLightboxCmp = (props) => {
  const {
    isOpen, setIsOpen, dataUrl, className, responsiveMode,
  } = props;
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const closeFunc = () => setIsOpen(false);
  const smallMode = responsiveMode === MOBILE_MODE || responsiveMode === TABLET_MODE;

  useEffect(() => {
    if (isOpen && !responseData) {
      setIsLoading(true);
      try {
        HttpService.fetch(HttpService.generateUrl(dataUrl)).then((response) => {
          setResponseData(response.data);
          setIsLoading(false);
        });
      } catch (e) {
        setIsLoading(false);
        Logger.error('AsyncHistoryLightbox component fetchData() fetch error: ', e);
      }
    }
  }, [dataUrl, isOpen, responseData]);

  const getLightBoxContent = (data) => (
    <Modal
      unmountOnClose
      fade={false}
      size="xl"
      isOpen={isOpen}
      toggle={closeFunc}
      className={classNames('DefaultPopup', 'AsyncHistoryLightboxPopup', className, smallMode ? 'modal-full' : '')}
      backdrop
    >
      <ModalHeader className="align-items-end justify-content-end">
        <Icon className="close-button" type="close" onClick={closeFunc} />
      </ModalHeader>
      <ModalBody>
        <div className={classNames(isLoading ? 'is-loading mt-5' : '', 'pr-3')}>
          {data && (
            <>
              <Headline className="title" data={{ size: 'h1', text: i18n.t('history') }} />
              <HistoryTable
                columns={data.columnsToRender}
                rows={data.rows}
                className="w-100"
              />
            </>
          )}
        </div>
      </ModalBody>
      <ModalFooter />
    </Modal>
  );

  return (
    <div className={classNames('AsyncHistoryLightbox', className)}>
      {getLightBoxContent(responseData)}
    </div>
  );
};

AsyncHistoryLightboxCmp.propTypes = {
  dataUrl: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  className: PropTypes.string,
  responsiveMode: PropTypes.string,
};
AsyncHistoryLightboxCmp.defaultProps = {
  className: '',
  responsiveMode: DESKTOP_MODE,
};

const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});

export default React.memo(connect(mapStateToProps)(AsyncHistoryLightboxCmp));
