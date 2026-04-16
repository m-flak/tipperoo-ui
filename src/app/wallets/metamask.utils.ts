import keccak256 from 'keccak256';

export const fnAbi = (signature: string): string =>
    '0x' + keccak256(signature).toString('hex').substring(0, 8);

export const hexStr = (
    value: string | number,
    encode: boolean = true,
    pad: number = 2,
    prefix: string = '',
): string => {
    const encoder = new TextEncoder();
    let hexString: string;

    if (typeof value === 'string') {
        if (encode) {
            hexString = Array.from(encoder.encode(value))
                .map((byte) => byte.toString(16).padStart(pad, '0'))
                .join('');
        } else {
            hexString = value.padStart(pad, '0');
        }
    } else {
        hexString = value.toString(16).padStart(pad, '0');
    }

    hexString = prefix + hexString;

    return hexString;
};

export const stripZeroX = (addr: string) => (addr.startsWith('0x') ? addr.replace('0x', '') : addr);
