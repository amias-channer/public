import { Row } from 'reactstrap';
import SceneSlider from './SceneSlider';
import LeftHandNavigation from './LeftHandNavigation';
import RealTimeIndications from './RealTimeIndications';
import Accordion from './Accordion';
import HtmlText from './HtmlText';
import Headline from './Headline';
// eslint-disable-next-line import/no-cycle
import Columns from './Columns';
import QuickSearch from './QuickSearch';
import TeaserBox from './TeaserBox';
import NewsStoriesBox from './NewsStoriesBox';
import IFrame from './IFrame';
import PieChart from './PieChart';
import ProductInformationTeaser from './ProductInformationTeaser';
import PushableChangeAbsolute from './PushManager/PushableChangeAbsolute';
import PushableChangePercent from './PushManager/PushableChangePercent';
import PushableDefault from './PushManager/PushableDefault';
import PushablePercentWithBar from './PushManager/PushablePercentWithBar';
import PushableSize from './PushManager/PushableSize';
import PushableTimestamp from './PushManager/PushableTimestamp';
import InstrumentChart from './InstrumentChart';
import TeaserTile from './TeaserTile';
import ImageComponent from './CMS/ImageComponent';
import TrendRadarBanner from './CMS/TrendRadarBanner';
import FileDownload from './FileDownload';
import ProductsInSubscription from './ProductsInSubscription';

export const getComponentByTemplate = (template) => {
  const componentsMapping = {
    'scene-slider': SceneSlider,
    'left-hand-navigation': LeftHandNavigation,
    'top-quotes-indications': RealTimeIndications,
    'html-text': HtmlText,
    headline: Headline,
    accordion: Accordion,
    columns: Columns,
    row: Row,
    'quick-turbo-search': QuickSearch,
    'teaser-box': TeaserBox,
    newsstoriesbox: NewsStoriesBox,
    'product-information-teaser': ProductInformationTeaser,
    'news-letter-iframe': IFrame,
    'Constituents Pie Chart': PieChart,
    'pushable-change-absolute': PushableChangeAbsolute,
    'pushable-change-percent': PushableChangePercent,
    'pushable-default': PushableDefault,
    'pushable-percent-with-bar': PushablePercentWithBar,
    'pushable-size': PushableSize,
    'pushable-timestamp': PushableTimestamp,
    'instrument-chart': InstrumentChart,
    'deri-teaser': TeaserTile,
    Image: ImageComponent,
    'file-download': FileDownload,
    'products-in-subscription': ProductsInSubscription,
    'trendradar-banner-image': TrendRadarBanner,
  };
  return componentsMapping[template];
};
