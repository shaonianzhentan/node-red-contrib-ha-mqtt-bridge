module.exports = function (RED) {
    RED.nodes.registerType('ha-mqtt-bridge-switch', function (cfg) {
        RED.nodes.createNode(this, cfg);
        const node = this
        const server = RED.nodes.getNode(cfg.server);
        if (server) {
            const deviceNode = RED.nodes.getNode(cfg.device);
            // 获取配置
            const { name, unique_id, state_topic, json_attr_t, command_topic, discovery_topic } = server.getConfig('switch', cfg.name)
            server.publish_config(discovery_topic, {
                name,
                unique_id,
                state_topic,
                json_attr_t,
                command_topic,
                payload_on: "ON",
                payload_off: "OFF",
                state_on: "ON",
                state_off: "OFF",
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
            server.subscribe(command_topic, (payload) => {
                node.send({ payload })
                server.publish(state_topic, payload)
            })
        } else {
            this.status({ fill: "red", shape: "ring", text: `node-red-contrib-ha-mqtt-bridge/common:errors.mqttNotConfigured` });
        }
    })
}