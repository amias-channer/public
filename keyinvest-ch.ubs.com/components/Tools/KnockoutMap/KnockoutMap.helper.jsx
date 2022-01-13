/* eslint-disable */
/* eslint disabled because of legacy code to generated the 3d Map */
import { path, pathOr } from 'ramda';
import { push } from 'connected-react-router';
import HttpService from '../../../utils/httpService';

export const getKnockoutMapDataURLTemplate = () => `${HttpService.getPageApiUrl()}/tool/knockout-map?sin=%s`;

// Knockout map component constants
export const KNOCK_OUT_MAP_INITIAL_UNDERLYING_SIN = 73;

export const TRADING_PLACE_SIX_SP_EXCHANGE_VALUE = 'scoach';
export const TRADING_PLACE_SWISS_DOTS_VALUE = 'swissDots';

export const TURBO_MAP_ELEMENT_ID = 'knock-out-map';
export const TURBO_MAP_WIDTH = 735;
export const TURBO_MAP_HEIGHT = 600;
export const TURBO_MAP_ROTATION_ANGLE = -114.5;

export const getUnderlying = (data) => pathOr([], ['underlying'])(data);
export const getUnderlyings = (data) => pathOr([], ['underlyings'])(data);
export const getDataLink = (data) => path(['dataLink'])(data);
export const getKoLevelLabelsLink = (data) => path(['koLevelLabelsLink'])(data);
export const getMaturityDatesAxisLabelsData = (data) => pathOr([], ['maturityDatesAxisLabels'])(data);
export const getSelectedUnderlyingValue = (data) => pathOr(false, ['target', 'value'])(data);
export const getSelectedUnderlyingName = (data) => pathOr('', ['target', 'textContent'])(data);
export const getSelectedUnderlyingSin = (data) => pathOr(false, ['selectedUnderlyingSin'])(data);
export const getTradingPlaces = (data) => path(['tradingPlaces'])(data);
export const getCurrentTradingPlaces = (data) => pathOr([], ['currentTradingPlace'])(data);
export const getTradingPlaceCheckboxValue = (data) => pathOr('', ['target', 'value'])(data);
export const getTradingPlaceCheckboxChecked = (data) => pathOr('', ['target', 'checked'])(data);

export const create3dMap = (d3, data, dispatch) => {
  const turboMap = document.getElementById(TURBO_MAP_ELEMENT_ID);
  const jsonUnderlying = getUnderlying(data);
  const jsonData = HttpService.generateUrl(getDataLink(data));
  const jsonLabel = HttpService.generateUrl(getKoLevelLabelsLink(data));
  const maturityData = getMaturityDatesAxisLabelsData(data);
  const turboMapRotation = TURBO_MAP_ROTATION_ANGLE;

  // Reset turboMap
  if (turboMap) {
    turboMap.innerHTML = '';
  }


  // Remove element from dom
  const removeDomElement = (selector) => {
    const elem = document.querySelector(selector);
    if (elem && elem.parentNode) {
      elem.parentNode.removeChild(elem);
    }
  };


  // Get mouse position
  const updateTooltipPosition = function () {
    document.onmousemove = function (event) {
      if (_t.tooltip) {
        _t.tooltip.setAttribute('style', `top: ${event.y - 50}px; left: ${event.x - 10}px;`);
      }
    };
  };

  // Tooltip
  const _t = {};
  _t.tooltip = null;

  // Build turbomap
  const width = TURBO_MAP_WIDTH;
  const height = TURBO_MAP_HEIGHT;
  const svg = d3.select(turboMap)
    .append('svg').attr('width', width).attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2}) rotate(${turboMapRotation})`);

  const partition = d3.layout.partition()
    .sort(null)
    .size([4, 61000])
    .value((d) => 1);

  const arc = d3.svg.arc()
    .startAngle((d) => d.x)
    .endAngle((d) => d.x + d.dx)
    .innerRadius((d) => Math.sqrt(d.y))
    .outerRadius((d) => Math.sqrt(d.y + d.dy));

  d3.json(jsonData).get((error, root) => {
    const path = svg.datum(root).selectAll('path')
      .data(partition.nodes)
      .enter()
      .append('path')
      .attr('display', (d) => (d.depth ? null : 'none')) // hide inner ring
      .attr('d', arc)
      .style('fill', (d) => (!d.color ? 'transparent' : d.color))
      .each(stash)
      .on('mouseover', function (element) {
        // Format price value
        const priceValue = element.name;

        if (!priceValue) {
          _t.tooltip = null;
          removeDomElement('.map-tooltip');
        }

        // Build/Show tooltip
        if (!_t.tooltip && priceValue) {
          _t.tooltip = document.createElement('div');
          _t.tooltip.setAttribute('class', 'map-tooltip');
          _t.tooltip.appendChild(document.createTextNode(priceValue));
          document.body.appendChild(_t.tooltip);
          updateTooltipPosition();
        } else if (_t.tooltip) {
          _t.tooltip.innerHTML = '';
          _t.tooltip.appendChild(document.createTextNode(priceValue));
          _t.tooltip.style.display = 'block';
        }

        // Hide tooltip
        if (element.name === 'empty' || !element.name) {
          if (_t.tooltip) {
            _t.tooltip.style.display = 'none';
          }
        } else {
          // Set styles
          this.style.cursor = 'pointer';
          this.style.opacity = 0.5;
        }
      })
      .on('mouseout', function () {
        if (_t.tooltip) _t.tooltip.style.display = 'none';

        // Reset styles
        this.style.cursor = '';
        this.style.opacity = 1;
      })
      .on('click', (d) => {
        if (d.name) {
          removeDomElement('.map-tooltip');
          dispatch(push(d.link));
        }
      });
  });

  // Stash the old values for transition.
  function stash(d) {
    d.x0 = d.x;
    d.dx0 = d.dx;
  }

  // Build value labels
  d3.json(jsonLabel).get((error, root) => {
    const labelText = svg.datum(root).selectAll('text')
      .data(partition.nodes)
      .enter()
      .append('text')
      .attr('y', (d) => d.position[0])
      .attr('x', (d) => d.position[1])
      .attr('fill', '#919191')
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(${-turboMapRotation})`)
      .text((d) => (d.label ? d.label : ''));
  });

  // Build label lines
  let lineWidth = null;
  let strokeColor = null;
  let strokeWidth = null;
  let count5 = 1;
  for (let line = 0; line < 77; line++) {
    // Set bigger style every 5th line
    count5++;
    if (count5 === 5) {
      count5 = 0;
      lineWidth = 181;
      strokeColor = '#9a9a9a';
      strokeWidth = 2;
    }
    // Set thin lines
    else {
      lineWidth = 175;
      strokeColor = '#ccc';
      strokeWidth = 1;
    }

    // Draw lines
    svg.append('line')
      .attr('transform', `rotate(${225 + line * 3.015})`)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', lineWidth)
      .attr('y2', lineWidth)
      .attr('stroke-width', strokeWidth)
      .attr('stroke', strokeColor);
  }

  // Add summary
  const defs = svg.append('defs')
    .append('linearGradient')
    .attr('id', 'grad1')
    .attr('y2', '1')
    .attr('x2', '0')
    .attr('y1', '0')
    .attr('x1', '0');
  defs
    .append('stop')
    .attr('offset', '0%')
    .attr('style', 'stop-color:#fff; stop-opacity:1');
  defs
    .append('stop')
    .attr('offset', '100%')
    .attr('style', 'stop-color:#d5d5d5; stop-opacity:1');

  svg.append('path')
    .attr('d', 'm-82,0 c0,-45 36,-82 82,-82 c45,0 82,36 82,82c 0,45 -42,57 -81,57c-39,0 -83,-12 -83,-57z')
    .attr('fill', 'url(#grad1)')
    .attr('transform', `rotate(${115})`);

  // Split title
  if (jsonUnderlying[0].length > 14) {
    const splittedTitle = jsonUnderlying[0].split(' ');
    const firstLine = splittedTitle[0];
    let secondLine = '';

    // Build second line
    for (let i = 1; i < splittedTitle.length; i++) {
      secondLine += ` ${splittedTitle[i]}`;
    }

    secondLine = secondLine.substring(0, 18);
    secondLine += '...';

    svg.append('text')
      .text(firstLine)
      .attr('class', 'summary-label')
      .attr('y', -30)
      .attr('x', 0)
      .attr('text-anchor', 'middle')
      .attr('fill', '#646464')
      .attr('transform', `rotate(${-turboMapRotation})`);

    svg.append('text')
      .text(secondLine)
      .attr('class', 'summary-label')
      .attr('y', -10)
      .attr('x', 0)
      .attr('text-anchor', 'middle')
      .attr('fill', '#646464')
      .attr('transform', `rotate(${-turboMapRotation})`);
  } else {
    svg.append('text')
      .text(jsonUnderlying[0])
      .attr('class', 'summary-label')
      .attr('y', -10)
      .attr('x', 0)
      .attr('text-anchor', 'middle')
      .attr('fill', '#646464')
      .attr('transform', `rotate(${-turboMapRotation})`);
  }

  svg.append('text')
    .text(jsonUnderlying[1])
    .attr('class', 'summary-sub-label')
    .attr('y', 12)
    .attr('x', 0)
    .attr('fill', '#646464')
    .attr('text-anchor', 'middle')
    .attr('transform', `rotate(${-turboMapRotation})`);

  // Build maturity date labels
  const dateLabels = svg.append('text')
    .attr('class', 'date-labels')
    .attr('y', 72)
    .attr('x', -56)
    .attr('transform', 'rotate(134)');

  const dateLabelsRight = svg.append('text')
    .attr('class', 'date-labels')
    .attr('y', 72)
    .attr('x', -56)
    .attr('transform', 'rotate(95)');

  // Default positions
  const startX = -65;
  const startY = 75;

  // Add left labels
  maturityData.forEach((label, index) => {
    dateLabels.append('tspan')
      .attr('fill', label.colorLeft)
      .attr('x', startX - (15 * index))
      .attr('y', startY + (15 * index))
      .text(label.text);
  });

  // Add right labels
  maturityData.forEach((label, index) => {
    dateLabelsRight.append('tspan')
      .attr('fill', label.colorRight)
      .attr('text-anchor', 'end')
      .attr('x', -1 * (startX - (15 * index)))
      .attr('y', startY + (15 * index))
      .text(label.text);
  });
};
