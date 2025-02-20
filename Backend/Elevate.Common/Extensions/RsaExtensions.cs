using System.Security.Cryptography;
using Org.BouncyCastle.OpenSsl;
using Org.BouncyCastle.Crypto.Parameters;
using System.Text.RegularExpressions;

namespace Elevate.Common.Extensions
{
    public static class RsaExtensions
    {
        public static void ImportRSAPrivateKeyPem(this RSA rsa, string pem)
        {
            try
            {
                var base64 = pem.Replace("-----BEGIN PRIVATE KEY-----", "")
                                .Replace("-----END PRIVATE KEY-----", "")
                                .Replace("\n", "")
                                .Replace("\r", "")
                                .Replace(" ", "");
                base64 = Regex.Replace(pem, "[^a-zA-Z0-9+/=]", "");
                rsa.ImportPkcs8PrivateKey(Convert.FromBase64String(base64), out _);
                return;
            }
            catch (Exception) { /* Ignore and try PKCS#1 */ }

            try
            {
                var base64 = pem.Replace("-----BEGIN RSA PRIVATE KEY-----", "")
                                .Replace("-----END RSA PRIVATE KEY-----", "")
                                .Replace("\n", "")
                                .Replace("\r", "")
                                .Replace(" ", "");
                base64 = Regex.Replace(pem, "[^a-zA-Z0-9+/=]", "");
                var rsaParams = DecodePKCS1PrivateKey(Convert.FromBase64String(base64));

                rsa.ImportParameters(rsaParams);
                return;
            }
            catch (Exception ex)
            {
                throw new CryptographicException("Invalid PEM private key. Tried both PKCS#8 and PKCS#1.", ex);
            }
        }

        private static RSAParameters DecodePKCS1PrivateKey(byte[] privateKeyBytes)
        {
            using (var reader = new StreamReader(new MemoryStream(privateKeyBytes)))
            {
                var pemReader = new PemReader(reader);
                var pkcs1 = pemReader.ReadObject() as RsaPrivateCrtKeyParameters;
                if (pkcs1 == null)
                {
                    throw new CryptographicException("Invalid PKCS#1 private key.");
                }

                var rsaParams = new RSAParameters
                {
                    Modulus = pkcs1.Modulus.ToByteArrayUnsigned(),
                    Exponent = pkcs1.PublicExponent.ToByteArrayUnsigned(),
                    D = pkcs1.Exponent.ToByteArrayUnsigned(),
                    P = pkcs1.P.ToByteArrayUnsigned(),
                    Q = pkcs1.Q.ToByteArrayUnsigned(),
                    DP = pkcs1.DP.ToByteArrayUnsigned(),
                    DQ = pkcs1.DQ.ToByteArrayUnsigned(),
                    InverseQ = pkcs1.QInv.ToByteArrayUnsigned()
                };
                return rsaParams;
            }
        }

        public static void ImportRSAPublicKeyPem(this RSA rsa, string pem)
        {
            try
            {
                byte[] publicKeyBytes = Convert.FromBase64String(
                    pem.Replace("-----BEGIN PUBLIC KEY-----", "")
                       .Replace("-----END PUBLIC KEY-----", "")
                       .Replace("\n", "")
                       .Replace("\r", ""));
                rsa.ImportSubjectPublicKeyInfo(publicKeyBytes, out int bytesRead);
            }
            catch (Exception ex)
            {
                throw new CryptographicException("Invalid PEM public key.", ex);
            }
        }

        public static string ExportRSAPublicKeyPem(this RSA rsa)
        {
            var publicKeyBytes = rsa.ExportRSAPublicKey();
            var base64 = Convert.ToBase64String(publicKeyBytes);
            return "-----BEGIN PUBLIC KEY-----\n" +
                   string.Join("\n", SplitLines(base64, 64)) +
                   "\n-----END PUBLIC KEY-----";
        }

        private static IEnumerable<string> SplitLines(string s, int lineLength)
        {
            for (int i = 0; i < s.Length; i += lineLength)
            {
                yield return s.Substring(i, Math.Min(lineLength, s.Length - i));
            }
        }
    }
}
