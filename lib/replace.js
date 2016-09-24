import {list} from 'postcss';
import pseudoSelectors from './pseudo-selectors';
import {meterBarSearchRE, meterBarRE, meterBarWithPseudoClassRE}
    from './regular-expressions';

function replaceMeterBarWithPseudoClass(selector, vendor) {
  return selector.replace(meterBarWithPseudoClassRE, (_, pseudo) =>
      pseudoSelectors[vendor][pseudo]);
}

function replaceMeterBar(selector, vendor) {
  const selectorList = list.comma(selector);

  return selectorList
    .filter(complexSelector => meterBarSearchRE.test(complexSelector))
    .map(complexSelector => [].concat(...pseudoSelectors[vendor].bar
        .map(pseudoSelector => complexSelector
            .replace(meterBarRE, () => pseudoSelector))))
    .concat(selectorList
      .filter(complexSelector => !meterBarSearchRE.test(complexSelector)))
    .join(', ');
}

export function replace(selector, vendor) {
  return replaceMeterBar(
      replaceMeterBarWithPseudoClass(selector, vendor),
      vendor);
}
