module.exports = function (RED) {
    RED.nodes.registerType('ha-mqtt-bridge-discovery', function (cfg) {
        RED.nodes.createNode(this, cfg);
        const server = RED.nodes.getNode(cfg.server);
        if (server) {
            const node = this
            node.on('input', function (msg) {
                server.discovery()
                this.status({ fill: "green", shape: "ring", text: `${new Date().toLocaleTimeString()} 自动配置` });
            })
        } else {
            this.status({ fill: "red", shape: "ring", text: `node-red-contrib-ha-mqtt-bridge/common:errors.mqttNotConfigured` });
        }
    })
}