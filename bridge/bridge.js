module.exports = function (RED) {
    RED.nodes.registerType('ha-mqtt-bridge-bridge', function (cfg) {
        RED.nodes.createNode(this, cfg);
        const local = RED.nodes.getNode(cfg.local);
        const cloud = RED.nodes.getNode(cfg.cloud);
        if (local && cloud) {
            local.register(this)
            cloud.register(this)
            console.log('MQTT桥：', cloud.broker, local.broker)
            // 监听本地操作，发送到云端
            local.subscribe(`ha-mqtt-bridge/${cloud.broker}/#`, { qos: 0 }, function (mtopic, mpayload, mpacket) {
                console.log(mtopic, mpayload)
                cloud.client.publish(mtopic, mpayload)
            })
            // 监听云端操作，发送到本地
            cloud.subscribe(`ha-mqtt-bridge/${local.broker}`, { qos: 0 }, function (mtopic, mpayload, mpacket) {
                const { topic, payload } = JSON.parse(mpayload)
                console.log(topic, payload)
                local.client.publish(topic, payload)
            })
        } else {
            this.status({ fill: "red", shape: "ring", text: `node-red-contrib-ha-mqtt-bridge/common:errors.mqttNotConfigured` });
        }
    })
}