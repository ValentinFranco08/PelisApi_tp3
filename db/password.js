const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const encodeBase64 = (text) => {
  let output = '';
  let index = 0;
  const utf8 = encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  while (index < utf8.length) {
    const chr1 = utf8.charCodeAt(index++);
    const chr2 = utf8.charCodeAt(index++);
    const chr3 = utf8.charCodeAt(index++);

    const enc1 = chr1 >> 2;
    const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    let enc4 = chr3 & 63;

    if (Number.isNaN(chr2)) {
      enc3 = 64;
      enc4 = 64;
    } else if (Number.isNaN(chr3)) {
      enc4 = 64;
    }

    output +=
      base64Chars.charAt(enc1) +
      base64Chars.charAt(enc2) +
      base64Chars.charAt(enc3) +
      base64Chars.charAt(enc4);
  }

  return output;
};

export const hashPassword = (password) => {
  const plain = typeof password === 'string' ? password : '';
  return encodeBase64(`pelisapi:${plain}`);
};

export { encodeBase64 };
