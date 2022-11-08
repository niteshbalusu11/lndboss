const fullTokensType = 'full';
const isString = (n: any) => typeof n === 'string';
const tokensAsBigUnit = (tokens: number) => (tokens / 1e8).toFixed(8);

/** Format tokens for display
  {
    [none]: <No Value Substitute String>
    tokens: <Tokens Number>
  }
  @returns
  {
    display: <Formtted Tokens String>
  }
*/

type Args = {
  none?: string;
  tokens: number;
};
const formatTokens = ({ none, tokens }: Args) => {
  if (isString(none) && !tokens) {
    return { display: none };
  }

  // Exit early for tokens environment displays the value with no leading zero
  if (process.env.PREFERRED_TOKENS_TYPE === fullTokensType) {
    return { display: tokens.toLocaleString() };
  }

  return { display: tokensAsBigUnit(tokens) };
};

export default formatTokens;
