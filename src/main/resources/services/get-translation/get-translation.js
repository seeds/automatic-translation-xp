const Content = require('/lib/xp/content')
const Context = require('/lib/xp/context')
const Common = require('/lib/xp/common')
const Node = require('/lib/xp/node')

const Google = require('/lib/modules/google')
const Util = require('/lib/modules/util')

const DateFns = require('/lib/external/date-fns')

exports.post = function(req) {
    const reqBody = Util.parseJSON(req.body)
    const contentId = req.params.contentId
    const auto = reqBody.auto

    const siteConfig = (contentId && Content.getSiteConfig({
        key: contentId,
        applicationKey: app.name
    })) || {}

    const apiInfo = {
        authKey: siteConfig.google_api_key || '',
        sourceLanguage: siteConfig.google_api_source_language || '',
        targetLanguage: siteConfig.google_api_target_language || ''
    }

    if (auto) {
        if (!contentId) {
            return {
                status: 400
            }
        }

        autoTranslate(contentId, apiInfo)

        return {
            status: 200
        }
    } else {
        const translated = Google.getTranslation(reqBody.text, apiInfo)

        return {
            contentType: 'application/json',
            body: {
                text: translated
            }
        }
    }
}

function autoTranslate(contentId, config) {
    const content = Content.get({ key: contentId }) || {}
    const context = Context.get()

    if (content) {
        const DraftRepo = Node.connect({
            repoId: context.repository,
            branch: 'draft',
            principals: ['role:system.admin']
        })
        DraftRepo.modify({
            key: content._id,
            editor: (node) => {
                const dataFields = node.data || {}
                const xDataFields = node.x || {}
                const componentFields = node.components || []

                translateMainFields(node, config)

                translateObj(dataFields, config)
                translateObj(xDataFields, config)

                processPage(componentFields, config)

                if(node.inherit){
                    node.inherit = node.inherit.filter(flag => flag !== "CONTENT" && flag !== "NAME");
                }

                if (!node.workflow) node.workflow = {}
                node.workflow.state = 'IN_PROGRESS'
                
                return node
            }
        })
    }
}

function isTranslatable(value) {
    return value 
        && (typeof value === 'string')
        && !DateFns.isDateValue(value)
        && !Util.isUrlValue(value)
        && !Util.isUUIDValue(value)
}

function translateObj(obj, config) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key]

            if (value) {
                if (isTranslatable(value)) {
                    const translated = Google.getTranslation(value, config)
    
                    if (translated) {
                        obj[key] = translated
                    }
                } else if (typeof value === 'object') {
                    translateObj(value, config)
                }
            }
        }
    }
}

function processPage(obj, config) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key]

            if (value) {
                if (value.type === 'text') {
                    translateObj(value.text, config)
                } else if (key === 'config') {
                    translateObj(value, config)
                } else if (typeof value === 'object') {
                    processPage(value, config)
                }
            }
        }
    }
}

function translateMainFields(obj, config) {
    const name = obj.displayName ? Google.getTranslation(obj.displayName, config) : null

    if (name) {
        obj.displayName = name
        Content.move({
            source: obj._id,
            target: Common.sanitize(name),
        })
    }
}
