/* eslint-disable camelcase */
import times_light from 'fontawesome-pro/advanced-options/raw-svg/light/times.svg';
import chevron_left_regular from 'fontawesome-pro/advanced-options/raw-svg/regular/chevron-left.svg';
import backspace_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/backspace.svg';
import caret_down_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/caret-down.svg';
import check_circle_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/check-circle.svg';
import check_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/check.svg';
import envelope_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/envelope.svg';
import exclamation_circle_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/exclamation-circle.svg';
import exclamation_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/exclamation.svg';
import eye_slash_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/eye-slash.svg';
import eye_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/eye.svg';
import info_circle_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/info-circle.svg';
import lock_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/lock.svg';
import mobile_alt_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/mobile-alt.svg';
import question_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/question.svg';
import user_solid from 'fontawesome-pro/advanced-options/raw-svg/solid/user.svg';
import {iconShapeNoBound} from 'frontend-core/dist/components/ui-common/icon/icon.css';

const iconsTemplates: {[key: string]: string} = {
    'caret-down_solid': caret_down_solid,
    backspace_solid,
    check_solid,
    'check-circle_solid': check_circle_solid,
    times_light,
    exclamation_solid,
    'exclamation-circle_solid': exclamation_circle_solid,
    question_solid,
    'mobile-alt_solid': mobile_alt_solid,
    'info-circle_solid': info_circle_solid,
    lock_solid,
    'chevron-left_regular': chevron_left_regular,
    eye_solid,
    'eye-slash_solid': eye_slash_solid,
    envelope_solid,
    user_solid
};
/* eslint-enable */

Object.entries(iconsTemplates).forEach(([name, template]) => {
    iconsTemplates[name] = template.replace('<svg', `<svg class="${iconShapeNoBound}"`);
});

export default iconsTemplates;
