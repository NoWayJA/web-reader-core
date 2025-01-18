const isValidRegex =(regex: string): boolean =>  {
    try {
        new RegExp(regex);
        return true;
    } catch (e) {
        console.error("Error validating regex", e);
        return false;
    }
} 

const addLog = (message: string) => {
    if (globalThis.logs) {
        globalThis.logs_updated = new Date().toISOString();
        globalThis.logs.push(`${message} ${globalThis.logs_updated}`);
        if (globalThis.logs.length > 50) {
            globalThis.logs.shift();
        }
    }
}

export { isValidRegex, addLog };