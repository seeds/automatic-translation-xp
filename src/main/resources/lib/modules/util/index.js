const HttpClient = require('/lib/http-client')
const Admin = require('/lib/xp/admin')
const I18n = require('/lib/xp/i18n')

module.exports = {
    performRequest,
    parseJSON,
    localize,
    isUrlValue,
    isUUIDValue,
}

function performRequest(request, MAX_RETRY = 3){
    try {
        if (MAX_RETRY === 0){
            return null
        }

        request.connectionTimeout = 60000 // 1 minute
        request.readTimeout = 60000 // 1 minute

        return HttpClient.request(request)
        
    } catch (error){
        return performRequest(request, MAX_RETRY - 1)
    }
}

function parseJSON(json) {
    try {
        return JSON.parse(json)
    } catch(err) {
        return {}
    }
}

function localize(key) {
    const locale = Admin.getLocale()

    return I18n.localize({
        key: key,
        locale: locale
    })
}

function isUrlValue(str) {
    var urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})(\/[\w.-]*)*\/?(#[\w.-]*)?$/
    return urlPattern.test(str)
}

function isUUIDValue (str) {
	const regex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
	return regex.test(str)
}