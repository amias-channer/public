import React from 'react';
import './MainFooter.scss';
import { Button } from 'reactstrap';
import getAppConfig from '../../main/AppConfig';
import i18n from '../../utils/i18n';
import MainFooterContact from './MainFooterContact';
import HttpService from '../../utils/httpService';
import FileDownloadManager from '../FileDownloadManager';
import FooterNavigation from './FooterNavigation';
import Icon from '../Icon';
import { generateCmsLayout } from '../../pages/CmsPage/CmsPage.helper';
import { adformTrackEventClick } from '../../adformTracking/AdformTracking.helper';

class MainFooter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      contactOpen: false,
    };
  }

  toggle(event) {
    const { contactOpen } = this.state;
    adformTrackEventClick(
      event,
      'contact-click',
    );
    if (!contactOpen) {
      HttpService.fetch(`${HttpService.getPageApiUrl()}/contact`).then((response) => {
        const success = response.state === 'OK';
        if (success) {
          this.setState({
            contactFormData: response.data,
            contactOpen: true,
          });
        }
      });
    } else {
      this.setState({
        contactOpen: false,
      });
    }
  }

  render() {
    const { contactOpen, contactFormData } = this.state;
    const { footer } = getAppConfig();
    return (
      <div className="MainFooter">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <FooterNavigation />
            </div>

            <div className="text-md-right col-md-5">
              {i18n.t('Follow us on')}
              {/* <Button color="outline"><Icon name="twitter" /></Button> */}
              <a
                href="https://www.linkedin.com/showcase/ubs-keyinvest/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <Icon type="linkedin" />
              </a>
            </div>
          </div>
        </div>
        {generateCmsLayout(footer && footer.data ? footer.data : [])}
        <div className="fixed-bottom d-print-none">
          <Button color="green" className="float-right rounded-circle support-button" onClick={this.toggle}>
            <i className="icon-support" />
            <span>{i18n.t('Contact')}</span>
          </Button>
          { contactOpen && (<MainFooterContact toggle={this.toggle} data={contactFormData} />)}
        </div>
        <FileDownloadManager className="container fixed-bottom d-print-none" />
      </div>
    );
  }
}

export default MainFooter;
