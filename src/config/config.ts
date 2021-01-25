export class Config {
    public static readonly baseIp = "http://battleship.mamiri.me:9090";
    public static readonly restProtocol = "http://";
    public static readonly socketProtocol = "ws://";
    public static readonly restUrl = Config.restProtocol + Config.baseIp + "/api/v1";
    public static readonly socketUrl = Config.socketProtocol + Config.baseIp + "/socket";
}
