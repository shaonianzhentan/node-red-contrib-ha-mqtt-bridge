# node-red-contrib-ha-mqtt-bridge
在本地和云端生成HomeAssistant的MQTT实体

云端发布
```yaml
topic: 'ha-mqtt-bridge/192.168.1.101'
payload:
  topic: homeassistant/status
  payload: online
```


本地发布
```yaml
topic: 'ha-mqtt-bridge/111.111.111.111'
payload:
  topic: ha-mqtt-bridge/switch/kai_guan/state
  payload: 'ON'
```