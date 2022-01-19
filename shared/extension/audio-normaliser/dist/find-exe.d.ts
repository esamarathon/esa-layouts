/**
 * @param {string} exe executable name (without extension if on Windows)
 * @return {Promise<string|null>} executable path if found
 * */
declare function findExecutable(exe: string): Promise<string | null>;
export default findExecutable;
//# sourceMappingURL=find-exe.d.ts.map