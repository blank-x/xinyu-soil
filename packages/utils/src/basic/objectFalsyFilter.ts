export function objectFalsyFilter(params: { [key: string]: any }) {
  const filtedParams: { [key: string]: any } = {};
  Object.keys(params)
    .filter((field) => params[field] !== null && params[field] !== undefined && params[field] !== '')
    .forEach((field) => {
      filtedParams[field] = params[field];
    });
  return filtedParams;
}

export default objectFalsyFilter