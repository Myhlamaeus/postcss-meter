const pseudoSelectors = {
  webkit: {
    'optimum': '::-webkit-meter-optimum-value',
    'sub-optimum': '::-webkit-meter-suboptimum-value',
    'sub-sub-optimum': '::-webkit-meter-even-less-good-value'
  },
  moz: {
    bar: ['::-moz-meter-bar']
  }
};

const webkit = pseudoSelectors.webkit;
webkit.bar = Object.keys(webkit).map(key => webkit[key]);

const moz = pseudoSelectors.moz;
for (let state of ['optimum', 'sub-optimum', 'sub-sub-optimum']) {
  moz[state] = `:-moz-meter-${state}${moz.bar}`;
}

export default pseudoSelectors;
export const supportedVendors = Object.keys(pseudoSelectors);
