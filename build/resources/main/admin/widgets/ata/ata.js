const Thymeleaf = require('/lib/thymeleaf')
const Portal = require('/lib/xp/portal')
const Content = require('/lib/xp/content')

const MyLicense = require('/lib/modules/license')
const Util = require('/lib/modules/util')

exports.get = function(req) {
    const view = resolve('ata.html')
    let model = {}

    //validate the license
    if (!MyLicense.isCurrentLicenseValid()) {
        model = {
            url: req.url,
            noLicense: true,
            licenseServiceUrl: Portal.serviceUrl({ service: 'license', type: 'absolute' }),
            translate: {
                noLicense: Util.localize('widgets.ata.view.no_license'),
                uploadLicense: Util.localize('widgets.ata.view.upload_license'),
                invalidLicense: Util.localize('widgets.ata.view.invalid_license')
            }
        }

        return {
            contentType: 'text/html',
            body: Thymeleaf.render(view, model)
        }
    }


    const contentId = req.params.contentId
    const siteConfig = (contentId && Content.getSiteConfig({
        key: contentId,
        applicationKey: app.name
    })) || {}
    const apiKey = siteConfig.google_api_key
    const mode = siteConfig.mode || 'manual'

    if (!apiKey) {
        return {
            contentType: 'text/html',
            body: `<widget class="error">${Util.localize('widgets.ata.view.error_message_api_key')}</widget>`
        }
    }

    model = {
        serviceUrl: Portal.serviceUrl({ service: 'get-translation', type: 'absolute', params: { contentId: contentId } }),
        mode: mode,
        translate: {
            input_placeholder: Util.localize('widgets.ata.view.input_placeholder'),
            alt_header: Util.localize('widgets.ata.view.alt_header'),
            alt_translate_btn: Util.localize('widgets.ata.view.alt_translate_btn'),
            alt_auto_translate_btn: Util.localize('widgets.ata.view.alt_auto_translate_btn'),
            alt_copy_btn: Util.localize('widgets.ata.view.alt_copy_btn'),
            error_message: Util.localize('widgets.ata.view.error_message'),
            alt_copy_btn_success: Util.localize('widgets.ata.view.alt_copy_btn_success')
        }
    }

    return {
        contentType: 'text/html',
        body: Thymeleaf.render(view, model)
    }
}
