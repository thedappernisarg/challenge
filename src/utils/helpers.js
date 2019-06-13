'use strict';

/**
 * Validates time string to be UTC with Regex
 *
 * @param {String} ts UTC Time
 */
export const checkTimestamp = ts => {
  return ts.match(
    /\b[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z\b/
  );
};

/**
 * Filters an object returning only properties specified
 *
 * @param  {Object} obj  Source object
 * @param  {Array}  keys List of (strings) properties to keep
 * @return {Object}      Object with only props specified in `keys`
 */
export const filterKeys = (obj, keepKeys, dropKeys) => {
    if (typeof obj !== 'object') {
        throw new Error('Param `obj` must be an object');
    }

    const okeys = Object.keys(obj);
    const keep = keepKeys || okeys;
    const drop = dropKeys || [];

    if (!(keep instanceof Array)) {
        throw new Error('Param `keepKeys` must be an array');
    }
    if (!(drop instanceof Array)) {
        throw new Error('Param `dropKeys` must be an array');
    }
    if (!keep.length && !drop.length) {
        throw new Error('Either param `keepKeys` or `dropKeys` must contain more than one key');
    }
    return okeys
        .reduce((result, it) => {
            if (!keep.includes(it) || drop.includes(it)) return result;
            return [...result, it];
        }, [])
        .reduce((result, it) => ({
            ...result,
            [it]: obj[it]
        }), {});
};
