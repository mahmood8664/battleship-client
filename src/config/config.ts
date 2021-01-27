export class Config {
    public static readonly baseIp = "battleship.mamiri.me";
    public static readonly restProtocol = "http://";
    public static readonly socketProtocol = "ws://";
    public static readonly restUrl = Config.restProtocol + Config.baseIp + "/api/v1";
    public static readonly socketUrl = Config.socketProtocol + Config.baseIp + "/socket";
}
