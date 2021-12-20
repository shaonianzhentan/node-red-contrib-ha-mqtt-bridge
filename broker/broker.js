module.exports = function (RED) {
    RED.nodes.registerType('ha-mqtt-bridge-broker', function (cfg) {
        RED.nodes.createNode(this, cfg);

        this.publish = (topic, payload) => {
            
        }
        // 本地

        // 云端
    })
}