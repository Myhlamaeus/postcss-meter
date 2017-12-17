import postcss from 'postcss';

import { meterBarSearchRE } from './regular-expressions';
import { replace } from './replace';
import { supportedVendors } from './pseudo-selectors';

export default postcss.plugin(
  'postcss-meter',
  ({ keepOriginal = false, vendors = supportedVendors } = {}) => {
    return css => {
      css.walkRules(rule => {
        if (!meterBarSearchRE.test(rule.selector)) {
          return;
        }

        for (let vendor of vendors) {
          const newRule = rule.cloneAfter();

          newRule.selector = replace(newRule.selector, vendor);
        }

        if (!keepOriginal) {
          rule.remove();
        }
      });
    };
  }
);
