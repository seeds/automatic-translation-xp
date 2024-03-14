
const Google = require('/lib/modules/google')
const Cache = require("/lib/cache");

const cache = Cache.newCache({});

exports.get = function (req) {
    const params = req.params || {}
    const query = params.query

    const cacheKey = `google-languages-${req.repositoryId}-${req.host}-${req.branch}`
    const cachedValue = cache.get(cacheKey, () => Google.getAvailableLanguages())

    if (!cachedValue || !cachedValue.length) {
        cache.clear();

    }

    const filteredLanguages = filterByQuery(cachedValue, query)
    const languages = filteredLanguages.map((item) => {
        return {
            id: item.language,
            displayName: item.name,
            description: item.language
        }
    })

    return {
        contentType: 'application/json',
        body: {
            total: languages.length,
            count: languages.length,
            hits: languages
        }
    }
}

function filterByQuery(languages, searchQuery) {

    if (!searchQuery) return languages

    return languages
        .filter(language =>
            (language.name || '').toLowerCase().indexOf((searchQuery || '').toLowerCase()) !== -1
        )
}