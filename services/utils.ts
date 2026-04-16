
// services/utils.ts

// Masks a full name, e.g., "Ahmet Engin" -> "AH*** ***IN"
export function maskFullName(fullName: string): string {
    if (!fullName || fullName.trim().length < 3) return "N/A";
    const parts = fullName.trim().toUpperCase().split(' ');
    const maskedParts = parts.map(part => {
        if (part.length <= 2) return part;
        return `${part[0]}${'*'.repeat(part.length - 2)}${part[part.length - 1]}`;
    });
    return maskedParts.join(' ');
}

// Masks an ID number, e.g., "12345678901" -> "123*********01"
export function maskIdNumber(idNumber: string): string {
    if (!idNumber || idNumber.length < 4) return "ID MASKED";
    return `${idNumber.substring(0, 3)}${'*'.repeat(idNumber.length - 5)}${idNumber.substring(idNumber.length - 2)}`;
}

// Conceptually masks a credit card number for display purposes
export function maskCreditCard(cardNumber: string): string {
    if (!cardNumber || cardNumber.length < 16) return "************";
    return `${cardNumber.substring(0, 4)} **** **** ${cardNumber.substring(cardNumber.length - 4)}`;
}

// Masks an email address, e.g., "ahmet.engin@example.com" -> "a*****n@e*****.com"
export function maskEmail(email: string): string {
    if (!email || !email.includes('@')) return "EMAIL MASKED";
    const [localPart, domainPart] = email.split('@');
    
    const maskPart = (part: string) => {
        if (part.length <= 2) return part;
        return `${part[0]}${'*'.repeat(part.length - 2)}${part[part.length - 1]}`;
    };

    return `${maskPart(localPart)}@${maskPart(domainPart)}`;
}

// Masks a phone number, e.g., "+905321234567" -> "+90 53*******67"
export function maskPhone(phone: string): string {
    if (!phone) return "PHONE MASKED";
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7) return phone;
    // Assuming a standard Turkish mobile format after country code
    const countryCode = phone.startsWith('+') ? phone.substring(0, 3) : '';
    const numberPart = digitsOnly.substring(digitsOnly.length - 10);
    return `${countryCode} ${numberPart.substring(0,2)}*******${numberPart.substring(numberPart.length - 2)}`;
}

// Converts degrees to radians
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

// Calculates Haversine distance between two sets of coordinates in miles
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3958.8; // Radius of Earth in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
}

// Converts DMS (Degrees, Minutes, Seconds) to Decimal Degrees
export function dmsToDecimal(dmsString: string): { lat: number, lng: number } | null {
    const latMatch = dmsString.match(/([NS])\s*(\d+)°(\d+)’(\d+)’’/i);
    const lngMatch = dmsString.match(/([EW])\s*(\d+)°(\d+)’(\d+)’’/i);

    if (!latMatch || !lngMatch) return null;

    const parsePart = (match: RegExpMatchArray) => {
        const sign = (match[1].toUpperCase() === 'S' || match[1].toUpperCase() === 'W') ? -1 : 1;
        const degrees = parseInt(match[2]);
        const minutes = parseInt(match[3]);
        const seconds = parseInt(match[4]);
        return sign * (degrees + minutes / 60 + seconds / 3600);
    };

    const lat = parsePart(latMatch);
    const lng = parsePart(lngMatch);

    return { lat, lng };
}

// Centralized coordinate formatter
export const formatCoordinate = (coord: number, type: 'lat' | 'lng'): string => {
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    const absCoord = Math.abs(coord);
    const degrees = Math.floor(absCoord);
    const minutesFloat = (absCoord - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = Math.round((minutesFloat - minutes) * 60);
    return `${degrees}°${minutes}'${seconds}'' ${direction}`;
};

/**
 * Returns the current time in Maritime Standard Format (UTC/Zulu).
 * Format: HH:mm:ss Z
 */
export const getCurrentMaritimeTime = (): string => {
    const now = new Date();
    // ISO String is UTC by default (e.g., 2023-10-27T10:00:00.000Z)
    // We extract the time part and append 'Z' explicitly.
    return now.toISOString().split('T')[1].split('.')[0] + ' Z';
};
