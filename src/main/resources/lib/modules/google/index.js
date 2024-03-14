const Util = require('/lib/modules/util')
const Portal = require('/lib/xp/portal');
const Encode = require('/lib/text-encoding');

const baseUrl = 'https://translation.googleapis.com/language/translate/v2'

module.exports = {
    getTranslation,
    getAvailableLanguages,
}

function getApiInfo() {
    const siteConfig = Portal.getSiteConfig() || {}
    
    return {
        authKey: siteConfig.google_api_key || '',
        sourceLanguage: siteConfig.google_api_source_language || '',
        targetLanguage: siteConfig.google_api_target_language || ''
    }
}

function getAvailableLanguages(config){

    const apiInfo = config || getApiInfo()

    const response = Util.performRequest({
        method: 'GET',
        url: `${baseUrl}/languages?target=en&key=${apiInfo.authKey}`,
        headers: {
            'Content-Type': 'application/json',
        },
        contentType: 'application/json'
    })

    if (response && response.body && response.status === 200) {
        const body = Util.parseJSON(response.body)

        return body.data.languages || []
    } else {
        return []
    }
}

function getTranslation(text, config) {
    const apiInfo = config || getApiInfo()

    const response = Util.performRequest({
        method: 'POST',
        url: `${baseUrl}?key=${apiInfo.authKey}`,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: text,
            source: apiInfo.sourceLanguage,
            target: apiInfo.targetLanguage,
        }),
        contentType: 'application/json'
    })

    if (response && response.body && response.status === 200) {
        const body = Util.parseJSON(response.body)
        
        const translatedText = body.data.translations[0].translatedText || null
        return Encode.htmlUnescape(translatedText) || null
        
    } else {
        return null
    }
}