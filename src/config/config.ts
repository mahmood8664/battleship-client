export class Config {
    public static readonly baseIp = "mamiri.me/api/battleship";
    // public static readonly baseIp = "192.168.1.118:8080";
    public static readonly restProtocol = "https://";
    public static readonly socketProtocol = "wss://";
    public static readonly restUrl = Config.restProtocol + Config.baseIp + "/api/v1";
    public static readonly socketUrl = Config.socketProtocol + Config.baseIp + "/socket";
}
