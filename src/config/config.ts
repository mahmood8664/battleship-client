export class Config {
    // public static readonly baseIp = "api.battleship.mamiri.me";
    public static readonly baseIp = "192.168.1.118:8080";
    public static readonly restProtocol = "http://";
    public static readonly socketProtocol = "ws://";
    public static readonly restUrl = Config.restProtocol + Config.baseIp + "/api/v1";
    public static readonly socketUrl = Config.socketProtocol + Config.baseIp + "/socket";
}
