const ACCESS_TOKEN_TTL_SECONDS = 15 * 60
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60

const getTokenSecrets = () => {
    const accessTokenSecret = process.env.JWT_ACCESS_TOKEN
    const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN

    if (!accessTokenSecret || !refreshTokenSecret) {
        throw new Error("JWT_ACCESS_TOKEN and JWT_REFRESH_TOKEN must be configured")
    }

    if (accessTokenSecret === refreshTokenSecret) {
        throw new Error("JWT access and refresh secrets must be different")
    }

    return { accessTokenSecret, refreshTokenSecret }
}

module.exports = {
    ACCESS_TOKEN_TTL_SECONDS,
    REFRESH_TOKEN_TTL_SECONDS,
    getTokenSecrets
}
