

export const _fileUtils = {
    /**
     * @string
     */
    // BASE_URL: import.meta.env.BASE_URL,
    BASE_URL: import.meta.env.BASE_URL ? (import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/') : '/',

    /**
     * @param {String} url
     */
    download: (url) => {
        window.open(_fileUtils.resolvePath(url), "_blank")
    },

    /**
     * @param {String} path
     * @return {Promise<any>}
     */
    loadJSON: async (path) => {
        try {
            const resolvedPath = _fileUtils.resolvePath(path)
            const response = await fetch(resolvedPath)
            const contentType = response.headers.get("content-type") || ""

            if (!response.ok || !contentType.includes("application/json")) {
                return null
            }

            return await response.json()
        }
        catch (error) {
            console.error(`Failed to load JSON from ${path}:`, error)
            return null
        }
    },

    /**
     * @param {String} path
     * @return {String}
     */
    // resolvePath: (path) => {
    //     if(path.startsWith("http"))
    //         return path
    //     const baseUrl = _fileUtils.BASE_URL || ""
    //     return baseUrl + path
    // },
    resolvePath: (path) => {
    if (path.startsWith("http")) return path; // full URLs are returned as-is

    const baseUrl = _fileUtils.BASE_URL || "/";

    // If baseUrl ends with '/' and path starts with '/', remove one slash
    if (baseUrl.endsWith("/") && path.startsWith("/")) {
        return baseUrl.slice(0, -1) + path;
    }

    // If baseUrl does not end with '/' and path does not start with '/', add a slash between
    if (!baseUrl.endsWith("/") && !path.startsWith("/")) {
        return baseUrl + "/" + path;
    }

    // Otherwise, just concatenate
    return baseUrl + path;
}

}