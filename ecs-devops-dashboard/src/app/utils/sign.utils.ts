import * as CryptoJS from 'crypto-js'

export class SignUtils {

  public static hashSha256(message: any) {
    return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex)
  }

  public static hmacSHA256(message: any, secret: any) {
    return CryptoJS.HmacSHA256(message, secret).toString(CryptoJS.enc.Hex);
  }

  public static base64Encode(message: string) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(message))
  }

  public static base64Decode(message: string) {
    return CryptoJS.enc.Base64.parse(message).toString(CryptoJS.enc.Utf8)
  }

  public static hexEncode(message: string) {
    return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(message))
  }

  public static hexDecode(message: string) {
    return CryptoJS.enc.Hex.parse(message).toString()
  }

}
