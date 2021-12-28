const crypto = require('crypto');

function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex').toLocaleLowerCase()
}

module.exports = function (RED) {
    RED.nodes.registerType('ha-mqtt-bridge-broker', function (cfg) {
        RED.nodes.createNode(this, cfg);
        const server = RED.nodes.getNode(cfg.server);
        if (server) {
            server.register(this)
            const node = this
            // 发布
            this.publish = (topic, payload) => {
                const type = Object.prototype.toString.call(payload)
                switch (type) {
                    case '[object Uint8Array]':
                        node.server.client.publish(topic, payload, { retain: false })
                        return;
                    case '[object Object]':
                        payload = JSON.stringify(payload)
                        break;
                    case '[object Number]':
                        payload = String(payload)
                        break;
                }
                server.client.publish(`ha-mqtt-bridge/${cfg.host}`, JSON.stringify({ topic, payload }))
            }

            // 订阅
            this.subscribe = (topic, callback) => {
                console.log(topic)
                server.subscribe(topic, { qos: 0 }, function (mtopic, mpayload, mpacket) {
                    console.log(mpayload)
                    callback(mpayload.toString())
                })
            }

            // 获取配置
            this.getConfig = (type, name) => {
                const unique_id = md5(type + name)
                const publish_topic = `ha-mqtt-bridge/${unique_id}/`
                const subscribe_topic = `ha-mqtt-bridge/${server.broker}/${unique_id}`
                return {
                    name,
                    unique_id,
                    discovery_topic: `homeassistant/${type}/${unique_id}/config`,
                    // 发布到HomeAssistant
                    state_topic: `${publish_topic}state`,
                    json_attr_t: `${publish_topic}attr`,
                    // 订阅
                    command_topic: `${subscribe_topic}set`,
                }
            }

            // 发送配置
            const DiscoveryDevice = {}
            this.publish_config = (discovery_topic, data) => {
                DiscoveryDevice[discovery_topic] = data
                node.publish(discovery_topic, data)
            }

            // 
            this.discovery = () => {                
                Object.keys(DiscoveryDevice).forEach(topic => {
                    node.publish(topic, DiscoveryDevice[topic])
                })
            }
        }
    })
}