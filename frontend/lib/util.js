export const shortenAddress = (str) => {
    if (str === undefined) return str;
    return str.substring(0,6) + "..." + str.substring(str.length - 4);
  }