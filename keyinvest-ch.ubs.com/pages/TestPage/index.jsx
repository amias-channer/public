import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import LeftHandNavigation from '../../components/LeftHandNavigation';
import AbstractPage from '../AbstractPage';

const currentNavigationTest = [
  {
    id: 1,
    url: '/test',
    title: 'Test link 1',
  }, {
    id: 2,
    url: '/test2',
    title: 'Test link 2',
    subLinks: [
      {
        id: 3,
        url: '/test2/test3',
        title: 'Test link 3',
        subLinks: [
          {
            id: 33,
            url: '/test2/test3/test33',
            title: 'Test link 33',
          }, {
            id: 333,
            url: '/test2/test3/test333',
            title: 'Test link 333',
          },
        ],
      }, {
        id: 4,
        url: '/test2/test4',
        title: 'Test link 4',
        subLinks: [
          {
            id: 44,
            url: '/test2/test4/test44',
            title: 'Test link 44',
          }, {
            id: 444,
            url: '/test2/test4/test444',
            title: 'Test link 444',
          },
        ],
      },
    ],
  }, {
    id: 5,
    url: '/test5',
    title: 'Test link 5',
  }, {
    id: 6,
    url: '/test6',
    title: 'Test link 6',
  },
];
export class TestPageComponent extends AbstractPage {
  render() {
    return (
      <div className="TestPage">
        {this.getHelmetData()}
        <Row>
          <LeftHandNavigation links={currentNavigationTest} className="col-2" />
          <Col xs="10">
            Content Goes Here
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});
const TestPage = connect(mapStateToProps)(TestPageComponent);
export default TestPage;
