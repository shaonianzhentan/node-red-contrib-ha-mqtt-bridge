module.exports = function (RED) {
    RED.nodes.registerType('ha-mqtt-bridge-binary_sensor', function (cfg) {
        RED.nodes.createNode(this, cfg);
        const node = this
        const server = RED.nodes.getNode(cfg.server);
        if (server) {
            const deviceNode = RED.nodes.getNode(cfg.device);
            // 获取配置
            const { name, unique_id, state_topic, json_attr_t, discovery_topic } = server.getConfig('binary_sensor', cfg.name)
            server.publish_config(discovery_topic, {
                name,
                unique_id,
                state_topic,
                json_attr_t,
                device_class: "motion",
                ...cfg.config,
                device: deviceNode.device_info
            })

            node.on('input', function (msg) {
                const { payload, attributes } = msg
                try {
                    if (payload) {
                        server.publish(state_topic, payload, RED._(`node-red-contrib-ha-mqtt-bridge/common:publish.state`))
                    }
                    if (attributes) {
                        server.publish(json_attr_t, attributes, RED._(`node-red-contrib-ha-mqtt-bridge/common:publish.attributes`))
                    }
                } catch (ex) {
                    node.status({ fill: "red", shape: "ring", text: ex });
                }
            })
        } else {
            this.status({ fill: "red", shape: "ring", text: `node-red-contrib-ha-mqtt-bridge/common:errors.mqttNotConfigured` });
        }
    })
}