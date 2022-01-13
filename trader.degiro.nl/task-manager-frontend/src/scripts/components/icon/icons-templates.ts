/* eslint-disable camelcase */
import check_circle_regular from 'fontawesome-pro/advanced-options/raw-svg/regular/check-circle.svg';
import check_regular from 'fontawesome-pro/advanced-options/raw-svg/regular/check.svg';
import chevron_left_regular from 'fontawesome-pro/advanced-options/raw-svg/regular/chevron-left.svg';
import chevron_right_regular from 'fontawesome-pro/advanced-options/raw-svg/regular/chevron-right.svg';
import plus_regular from 'fontawesome-pro/advanced-options/raw-svg/regular/plus.svg';
import times_circle_solid from 'fontawesome-pro/advanced-options/raw-svg/regular/times-circle.svg';
import times_regular from 'fontawesome-pro/advanced-options/raw-svg/regular/times.svg';
import address_card_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/address-card.svg';
import check_circle_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/check-circle.svg';
import cloud_download_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/cloud-download-alt.svg';
import exclamation_triangle_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/exclamation-triangle.svg';
import exclamation_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/exclamation.svg';
import info_circle_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/info-circle.svg';
import lock_alt_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/lock-alt.svg';
import mobile_alt_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/mobile-alt.svg';
import pen_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/pen.svg';
import phone_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/phone.svg';
import upload_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/upload.svg';
import {iconShapeNoBound} from 'frontend-core/dist/components/ui-common/icon/icon.css';

const iconsTemplates: {[key: string]: string} = {
    'address-card_solid': address_card_solid,
    'check-circle_solid': check_circle_solid,
    exclamation_solid,
    'exclamation-triangle_solid': exclamation_triangle_solid,
    'lock-alt_solid': lock_alt_solid,
    phone_solid,
    pen_solid,
    'info-circle_solid': info_circle_solid,
    upload_solid,
    'mobile-alt_solid': mobile_alt_solid,
    'cloud-download_solid': cloud_download_solid,
    'chevron-left_regular': chevron_left_regular,
    'chevron-right_regular': chevron_right_regular,
    'check-circle_regular': check_circle_regular,
    check_regular,
    plus_regular,
    times_regular,
    'times-circle_solid': times_circle_solid
};
/* eslint-enable */

Object.entries(iconsTemplates).forEach(([name, template]) => {
    iconsTemplates[name] = template.replace('<svg', `<svg class="${iconShapeNoBound}"`);
});

export default iconsTemplates;
