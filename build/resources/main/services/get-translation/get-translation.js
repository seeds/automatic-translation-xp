const Content = require('/lib/xp/content')
const Context = require('/lib/xp/context')
const Common = require('/lib/xp/common')
const Node = require('/lib/xp/node')

const Google = require('/lib/modules/google')
const Util = require('/lib/modules/util')

const AutomaticTranslation = require('/lib/modules/automatic-translation')
const AutomaticTranslationConfig = require('/lib/modules/automatic-translation/config')

let currentSiteConfig

exports.post = function(req) {
    const reqBody = Util.parseJSON(req.body)
    const contentId = req.params.contentId
    const auto = reqBody.auto

    const siteConfig = Util.getAppConfig(contentId) || {}

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
        const currentSite = Content.getSite({ key: content._path })
        currentSiteConfig = currentSite && AutomaticTranslationConfig.getConfig(currentSite._id, context.repository.replace('com.enonic.cms.', ''))
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

                translateObj(dataFields, config, 'CONTENT_TYPE', content.type)

                Object.keys(xDataFields).forEach(xDataFieldKey => {
                    translateObj(xDataFields[xDataFieldKey], config, 'XDATA', xDataFieldKey.replace(/-/g, '.'))
                })

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

function isTranslatable(refType, refKey, value) {
    const refParts = (refKey || '').split(':')

    if ((refKey || '').indexOf('media:') === 0) {
        const mediaTranslatableFields = ['caption', 'artist', 'copyright', 'tags', 'altText']
        return mediaTranslatableFields.indexOf((refKey || '').substring((refKey || '').lastIndexOf(':') + 1)) !== -1 
    } else if (refParts && refParts.length > 2) {
        const refName = `${refParts[0]}:${refParts[1]}`
        const key = refParts.slice(2).join('.')
        const appKey = refParts[0].replace(/\./g, '-')
        const contentKey = refParts[1]
    
        const schemaStructureCache = AutomaticTranslation.getSchemaStructureCache(refType, refName)
        const fieldsToBeIgnored = Util.forceArray(currentSiteConfig && currentSiteConfig[appKey] && currentSiteConfig[appKey][refType] && currentSiteConfig[appKey][refType][contentKey])
    
        return value && schemaStructureCache && (['TextLine', 'TextArea', 'HtmlArea'].indexOf(schemaStructureCache[key]) !== -1) && (fieldsToBeIgnored.indexOf(key) === -1)
    }

    return false
}

function generateSchemaStructure(refType, refName) {
    if (!AutomaticTranslation.existsSchemaStructureCache(refType, refName)) {
        let schema = AutomaticTranslation.getSchemaStructure(refType, refName)
    
        if (schema) {
            const result = AutomaticTranslation.getSchemaFieldsStructure(schema)
            AutomaticTranslation.setSchemaStructureCache(refType, refName, result)
        }
    }
}

function translateObj(obj, config, refType, refName, parentKey) {
    if (refName && (refName.split(':').length == 2)) generateSchemaStructure(refType, refName)

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key]
            const newRefName = refName ? `${refName}:${key}` : key

            if (value) {
                let newParentKey
                if (Array.isArray(obj)) {
                    newParentKey = parentKey
                } else {
                    if (parentKey) {
                        newParentKey = `${parentKey}:${key}`
                    } else {
                        newParentKey = newRefName
                    }
                }

                if (isTranslatable(refType, newParentKey, value)) {
                    const macros = extractMacros(value)

                    const translated = Google.getTranslation(value, config)
    
                    if (translated) {
                        obj[key] = (macros & (macros.length > 0)) ? replaceMacros(translated, macros) : translated
                    }
                } else if (typeof value === 'object') {
                    translateObj(value, config, refType, newRefName, newParentKey)
                }
            }
        }
    }
}

function translateTextObj(obj, config) {
    const value = obj && obj.value
    if (value) {
        const translated = Google.getTranslation(value, config)

        if (translated) {
            obj.value = translated
        }
    }
}

function processPage(obj, config, refType, refName) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key]

            if (value) {
                // Generate the schema values
                if ((value.type == 'page') && value.page && value.page.descriptor) {
                    refType = 'PAGE'
                    refName = value.page.descriptor
                } else if ((value.type == 'part') && value.part && value.part.descriptor) {
                    refType = 'PART'
                    refName = value.part.descriptor
                } else if ((value.type == 'layout') && value.layout && value.layout.descriptor) {
                    refType = 'LAYOUT'
                    refName = value.layout.descriptor
                }

                // Continue the recursion
                if (value.type === 'text') {
                    translateTextObj(value.text, config)
                } else if (key === 'config') {
                    const refNameSplit = (refName || '').split(':')
                    if ((refNameSplit.length == 2) && value[refNameSplit[0].replace(/\./g, '-')][refNameSplit[1]]) {
                        translateObj(value[refNameSplit[0].replace(/\./g, '-')][refNameSplit[1]], config, refType, refName)
                    }
                } else if (typeof value === 'object') {
                    processPage(value, config, refType, refName)
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

function extractMacros(html) {
    var regex = /\[([^\]]+?)\/\]|\[([^\]]+?)\](.*?)\[\/\2\]/g
    var tags = []
    var match

    while ((match = regex.exec(html)) !== null) {
        if (match[1]) {
            tags.push(match[0])
        } else if (match[2]) {
            tags.push(match[0])
        }
    }

    return tags
}

function replaceMacros(html, macros) {
    var regex = /\[([^\]]+?)\/\]|\[([^\]]+?)\](.*?)\[\/\2\]/g
    var index = 0

    html = html.replace(regex, () => {
        if (macros[index]) {
            return macros[index++]
        }
    })

    return html
}
