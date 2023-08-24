export const longtext = (text: string, long: number): string => {
    if (text.length <= long) {
        return text;
    } else {
        return text.substring(0, long) + " ...";
    }
};

