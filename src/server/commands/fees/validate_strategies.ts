import { auto, each } from 'async';

import tagsCommand from '../tags/tags_command';

const isNumber = n => !isNaN(n);
const isPublicKey = n => !!n && /^0[2-3][0-9A-F]{64}$/i.test(n);

type Args = {
  configs: {
    config: {
      basefees: string;
      feerate: string;
      id: Array<string>;
      maxhtlcratio: string;
      messageid: string;
      parsed_id: Array<string>;
      ratio: string;
    }[];
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
              if (!isNumber(Number(config.basefees))) {
                throw new Error('ExpectedNumericBaseFeesValues');
              }

              if (!isNumber(Number(config.feerate))) {
                throw new Error('ExpectedNumericFeeRateValues');
              }

              if (!isNumber(Number(config.maxhtlcratio))) {
                throw new Error('ExpectedNumericMaxHtlcRatioValues');
              }

              if (!isNumber(Number(config.ratio))) {
                throw new Error('ExpectedNumericOutboundCapacityValues');
              }

              if (Number(config.basefees) < 0) {
                throw new Error('ExpectedBaseFeesGreaterThanZero');
              }

              if (Number(config.feerate) < 0) {
                throw new Error('ExpectedFeeRateGreaterThanZero');
              }

              if (Number(config.ratio) < 0 || Number(config.ratio) > 1) {
                throw new Error('ExpectedOutboundCapacityRatioLessThanOneAndGreaterThanZero');
              }

              if (Number(config.maxhtlcratio) < 0 || Number(config.maxhtlcratio) > 1) {
                throw new Error('ExpectedMaxHtlcRatioLessThanOneAndGreaterThanZero');
              }

              const ids = config.parsed_id.filter(n => !!n);

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
