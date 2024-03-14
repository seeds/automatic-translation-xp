const License = require('/lib/license')

module.exports = {
    isCurrentLicenseValid,
    isValidLicense,
    installLicense
}

function isCurrentLicenseValid() {
    const licenseDetails = License.validateLicense({ appKey: app.name })
    return licenseDetails && !licenseDetails.expired
}

function isValidLicense(license) {
    const licenseDetails = License.validateLicense({ appKey: app.name, license })
    return licenseDetails && !licenseDetails.expired
}

function installLicense(license) {
    License.installLicense({ appKey: app.name, license })
}
