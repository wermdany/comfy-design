export const hyphenate = (str: string) => str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
