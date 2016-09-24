import {plugin} from 'postcss';
import {meterBarSearchRE} from './regular-expressions';
import {replace} from './replace';
import {supportedVendors} from './pseudo-selectors';

export default plugin('postcss-meter', function ({keepOriginal = false,
    vendors = supportedVendors} = {}) {
  return function (css) {
    css.walkRules(meterBarSearchRE, function (rule) {
      for (let vendor of vendors) {
        const newRule = rule.cloneAfter();

        newRule.selector = replace(newRule.selector, vendor);
      }

      if (!keepOriginal) {
        rule.remove();
      }
    });
  };
});
