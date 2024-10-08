export function isEmpty(data: Array<unknown> | string) {
    if (typeof data == "string") data = data.trim();
    return data.length === 0;
}


export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function sanitizeString(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
}


export const uniqueList = (arr: Array<any>) => [...new Set(arr)];


export function isValidPassword(password: string): boolean {
    return password.length >= 8;
}

export function createRandomCode(){
    return Math.floor(100000 + Math.random() * 900000);
}

export function isValidPhone(value: string) : boolean {
    return /^([0]?|\+?234)([7-9]{1})([0|1]{1})([\d]{1})([\d]{7})$/g.test(String(value));
}