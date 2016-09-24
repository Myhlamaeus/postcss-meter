import {plugin, list} from 'postcss';

const meterBarWithPseudoClassRE = /:meter-((?:sub-){0,2}optimum)::meter-bar/g;
const meterBarSearchRE = /::meter-bar/;
const meterBarRE = /::meter-bar/g;
const meterBarPseudoSelectors = {
  webkit: {
    'optimum': '::-webkit-meter-optimum-value',
    'sub-optimum': '::-webkit-meter-suboptimum-value',
    'sub-sub-optimum': '::-webkit-meter-even-less-good-value'
  },
  moz: {
    bar: ['::-moz-meter-bar']
  }
};

meterBarPseudoSelectors.webkit.bar =
    Object.keys(meterBarPseudoSelectors.webkit)
      .map(key => meterBarPseudoSelectors.webkit[key]);
for (let state of ['optimum', 'sub-optimum', 'sub-sub-optimum']) {
  meterBarPseudoSelectors.moz[state] = `:-moz-meter-${state}${meterBarPseudoSelectors.moz.bar}`;
}

function replace(selector, vendor) {
  return replaceMeterBar(
      replaceMeterBarWithPseudoClass(selector, vendor),
      vendor);
}

function replaceMeterBar(selector, vendor) {
  const selectorList = list.comma(selector);

  return selectorList
    .filter(complexSelector => meterBarSearchRE.test(complexSelector))
    .map(complexSelector => [].concat(...meterBarPseudoSelectors[vendor].bar
        .map(pseudoSelector => complexSelector
            .replace(meterBarRE, () => pseudoSelector))))
    .concat(selectorList
      .filter(complexSelector => !meterBarSearchRE.test(complexSelector)))
    .join(', ');
}

function replaceMeterBarWithPseudoClass(selector, vendor) {
  return selector.replace(meterBarWithPseudoClassRE, (_, pseudo) =>
      meterBarPseudoSelectors[vendor][pseudo]);
}

export default plugin('postcss-meter', function ({keepOriginal = false,
    vendors = Object.keys(meterBarPseudoSelectors)} = {}) {
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
