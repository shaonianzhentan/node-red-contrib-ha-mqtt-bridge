module.exports = function (RED) {
    RED.nodes.registerType('ha-mqtt-bridge-device', function (cfg) {
        RED.nodes.createNode(this, cfg);
        let { name, config } = cfg
        config = config ? JSON.parse(config) : {}
        this.device_info = {
            configuration_url: 'https://github.com/shaonianzhentan/node-red-contrib-ha-mqtt-bridge',
            identifiers: ['shaonianzhentan', 'ha-mqtt-bridge', name],
            manufacturer: "shaonianzhentan",
            model: 'HA-MQTT',
            sw_version: '1.0',
            ...config,
            name
        }
    })
}