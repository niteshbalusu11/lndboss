import { auto, each } from 'async';

import tagsCommand from '../tags/tags_command';

const allowedKeys = [
  'activity_period',
  'base_fee_msat',
  'config',
  'fee_ppm',
  'id',
  'max_ratio',
  'min_ratio',
  'name',
  'strategy',
];

const allowedKeyTypes = {
  activity_period: 'string',
  base_fee_msat: 'number',
  config: 'null',
  fee_ppm: 'number',
  id: 'array',
  name: 'string',
  max_ratio: 'number',
  min_ratio: 'number',
  strategy: 'string',
};

const { isArray } = Array;
const isNumber = n => !isNaN(n);
const isObject = n => typeof n === 'object';
const isPublicKey = n => !!n && /^0[2-3][0-9A-F]{64}$/i.test(n);
const isString = n => typeof n === 'string';

type Args = {
  configs: Array<object>;
};
type Tasks = {
  validate: undefined;
  getTags: any;
  getDestructuredArray: {
    data: { key: string; value: string | string[] }[];
  };
  validateConfigs: undefined;
};
const validateKeysAndValues = async ({ configs }: Args) => {
  return (
    await auto<Tasks>({
      // validate
      validate: (cbk: any) => {
        if (!configs || !isArray(configs)) {
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

      getDestructuredArray: [
        'validate',
        ({}, cbk: any) => {
          const destructuredArray = [];
          const keys = [];

          configs.forEach(data => {
            const validate = ({ data, keys }) => {
              if (!!data && !isArray(data) && !!isObject(data)) {
                Object.keys(data).forEach(key => {
                  keys.push(key);
                  const value = data[key];

                  const obj = {
                    key,
                    value: !isObject(value) || !!isArray(value) ? data[key] : '',
                  };

                  destructuredArray.push(obj);
                  if (!!isObject(value) && !isArray(value)) {
                    validate({ data: value, keys });
                  }
                });
              }
            };

            validate({ data, keys });
          });

          return cbk(null, { data: destructuredArray });
        },
      ],

      validateConfigs: [
        'getDestructuredArray',
        'getTags',
        async ({ getDestructuredArray, getTags }) => {
          const { data } = getDestructuredArray;
          const { tags } = getTags;

          await each(data, async n => {
            if (!allowedKeys.includes(n.key)) {
              throw new Error(`InvalidKey ${n.key}`);
            }

            if (!allowedKeyTypes[n.key]) {
              throw new Error(`MissingKeyTypeFor ${n.key}`);
            }

            if (allowedKeyTypes[n.key] === 'string' && !isString(n.value)) {
              throw new Error(`ExpectedStringType ${n.value} for ${n.key}`);
            }

            if (allowedKeyTypes[n.key] === 'number' && !isNumber(n.value)) {
              throw new Error(`ExpectedNumberType ${n.value} for ${n.key}`);
            }

            if (allowedKeyTypes[n.key] === 'null' && n.value !== '') {
              throw new Error(`ExpectedNullValue ${n.value} for ${n.key}`);
            }

            if (allowedKeyTypes[n.key] === 'array' && !isArray(n.value)) {
              throw new Error(`ExpectedArrayType ${n.value} for ${n.key}`);
            }

            if (n.key === 'id' && !!isArray(n.value)) {
              n.value.forEach(id => {
                if (!isPublicKey(id) && !tags.includes(id)) {
                  throw new Error(`ExpectedValidTagNameOrPubkey ${id} for ${n.key}`);
                }
              });
            }
          });
        },
      ],
    })
  ).validateConfigs;
};

export default validateKeysAndValues;
