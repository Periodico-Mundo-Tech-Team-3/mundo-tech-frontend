const MONTHS_ES = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export const formatDate = (isoString) => {
    if (!isoString) return '';

    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = MONTHS_ES[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};