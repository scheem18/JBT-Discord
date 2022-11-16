require('dotenv').config();
module.exports = {
    "TOKEN":process.env['TOKEN'],
    "ID":process.env['ID'],
    "AUDIT_WEBHOOKURL":process.env['AUDIT_WEBHOOKURL'],
    "SIGNATURE_WEBHOOKURL":process.env['SIGNATURE_WEBHOOKURL']
}