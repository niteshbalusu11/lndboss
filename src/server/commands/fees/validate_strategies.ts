import { auto, each } from 'async';

import tagsCommand from '../tags/tags_command';

const { isArray } = Array;
const checkRatio = (n: string[]) => Number(n[0]) < Number(n[1]);
const isNumber = n => !isNaN(n);
const isPublicKey = n => !!n && /^0[2-3][0-9A-F]{64}$/i.test(n);

type Args = {
  configs: {
    config: {
      basefees: string[];
      feerates: string[];
      ids: string[];
      maxhtlcratios: string[];
      parsed_ids: string[];
      ratios: string[];
    }[];
    message_id: string;
    node: string;
  };
};

type Tasks = {
  validate: undefined;
  getTags: any;
  validateConfig: undefined;
};
const validateKeysAndValues = async ({ configs }: Args) => {
  return (
    await auto<Tasks>({
      // validate
      validate: (cbk: any) => {
        if (!configs) {
          return cbk([400, 'ExpectedConfigsToValidateStrategies']);
        }

        if (!configs.message_id) {
          return cbk([400, 'ExpectedMessageIdToValidateStrategies']);
        }

        if (configs.node === undefined) {
          return cbk([400, 'ExpectedNodeNameStringToValidateStrategies']);
        }

        if (!isArray(configs.config)) {
          return cbk([400, 'ExpectedArrayOfConfigToValidateStrategies']);
        }

        return cbk();
      },

      getTags: [
        'validate',
        async () => {
          const args = {
            add: [],
            icon: '',
            id: '',
            is_avoided: false,
            remove: [],
            tag: '',
          };

          const { result } = await tagsCommand({ args });

          return { tags: result.map(n => n.alias) };
        },
      ],

      validateConfig: [
        'getTags',
        async ({ getTags }) => {
          const { tags } = getTags;

          return await each(configs.config, async config => {
            if (!!config.basefees.filter(n => !isNumber(Number(n))).length) {
              throw new Error('ExpectedNumericBaseFeesValues');
            }

            if (!!config.feerates.filter(n => !isNumber(Number(n))).length) {
              throw new Error('ExpectedNumericFeeRateValues');
            }

            if (!!config.maxhtlcratios.filter(n => !isNumber(Number(n))).length) {
              throw new Error('ExpectedNumericMaxHtlcRatioValues');
            }

            if (!!config.basefees.filter(n => Number(n) < 0).length) {
              throw new Error('ExpectedBaseFeesGreaterThanZero');
            }

            if (!!config.feerates.filter(n => Number(n) < 0).length) {
              throw new Error('ExpectedFeeRateGreaterThanZero');
            }

            if (!!config.maxhtlcratios.filter(n => Number(n) < 0 || Number(n) > 1).length) {
              throw new Error('ExpectedMaxHtlcRatioLessThanOneAndGreaterThanZero');
            }

            config.ratios.forEach(n => {
              const split = n.split('-');

              if (split.length !== 2) {
                throw new Error('Expected Valid Range Of Ratios');
              }

              split.forEach(n => {
                if (!isNumber(Number(n))) {
                  throw new Error('Expected Numeric Values In Ratios In Row');
                }

                if (Number(n) > 1 || Number(n) < 0) {
                  throw new Error('Expected Outbound Capacity Ratio Less Than One And Greater Than Zero In Row');
                }
              });

              if (!checkRatio(split)) {
                throw new Error('Expected First Number In Ratio Lower Than Second Number In Row');
              }
            });

            const ids = config.parsed_ids.filter(n => !!n);

            ids.forEach(n => {
              if (!n || n === '') {
                return;
              }

              if (!isPublicKey(n) && !tags.includes(n)) {
                throw new Error(`ExpectedValidTagNameOrPubkey ${n}`);
              }
            });

            return true;
          });
        },
      ],
    })
  ).validateConfig;
};

export default validateKeysAndValues;
