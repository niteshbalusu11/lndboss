import { auto, each } from 'async';

import tagsCommand from '../tags/tags_command';

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
  }[];
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
          return cbk([400, 'ExpectedConfigsToValidateKeysAndValues']);
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

          return await each(configs, async eachConfig => {
            return await each(eachConfig.config, async config => {
              if (!!config.basefees.filter(n => !isNumber(Number(n))).length) {
                throw new Error('ExpectedNumericBaseFeesValues');
              }

              if (!!config.feerates.filter(n => !isNumber(Number(n))).length) {
                throw new Error('ExpectedNumericFeeRateValues');
              }

              if (!!config.maxhtlcratios.filter(n => !isNumber(Number(n))).length) {
                throw new Error('ExpectedNumericMaxHtlcRatioValues');
              }

              if (!!config.ratios.filter(n => !isNumber(Number(n))).length) {
                throw new Error('ExpectedNumericOutboundCapacityValues');
              }

              if (!!config.basefees.filter(n => Number(n) < 0).length) {
                throw new Error('ExpectedBaseFeesGreaterThanZero');
              }

              if (!!config.feerates.filter(n => Number(n) < 0).length) {
                throw new Error('ExpectedFeeRateGreaterThanZero');
              }

              if (!!config.ratios.filter(n => Number(n) < 0 || Number(n) > 1).length) {
                throw new Error('ExpectedOutboundCapacityRatioLessThanOneAndGreaterThanZero');
              }

              if (!!config.maxhtlcratios.filter(n => Number(n) < 0 || Number(n) > 1).length) {
                throw new Error('ExpectedMaxHtlcRatioLessThanOneAndGreaterThanZero');
              }

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
          });
        },
      ],
    })
  ).validateConfig;
};

export default validateKeysAndValues;
