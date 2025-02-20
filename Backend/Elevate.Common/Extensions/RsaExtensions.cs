using System.Security.Cryptography;
using System.Text.RegularExpressions;
using Org.BouncyCastle.Asn1.Pkcs;
using Org.BouncyCastle.Asn1;

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
                base64 = Regex.Replace(base64, "[^a-zA-Z0-9+/=]", "");
                rsa.ImportPkcs8PrivateKey(Convert.FromBase64String(base64), out _);
                return;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to import PKCS#8 private key: {ex.Message}");
            }

            try
            {
                var base64 = pem.Replace("-----BEGIN RSA PRIVATE KEY-----", "")
                                .Replace("-----END RSA PRIVATE KEY-----", "")
                                .Replace("\n", "")
                                .Replace("\r", "")
                                .Replace(" ", "");
                base64 = Regex.Replace(base64, "[^a-zA-Z0-9+/=]", "");
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
            try
            {
                var asn1 = Asn1Object.FromByteArray(privateKeyBytes);
                var privateKeyStructure = RsaPrivateKeyStructure.GetInstance(asn1);

                return new RSAParameters
                {
                    Modulus = privateKeyStructure.Modulus.ToByteArrayUnsigned(),
                    Exponent = privateKeyStructure.PublicExponent.ToByteArrayUnsigned(),
                    D = privateKeyStructure.PrivateExponent.ToByteArrayUnsigned(),
                    P = privateKeyStructure.Prime1.ToByteArrayUnsigned(),
                    Q = privateKeyStructure.Prime2.ToByteArrayUnsigned(),
                    DP = privateKeyStructure.Exponent1.ToByteArrayUnsigned(),
                    DQ = privateKeyStructure.Exponent2.ToByteArrayUnsigned(),
                    InverseQ = privateKeyStructure.Coefficient.ToByteArrayUnsigned()
                };
            }
            catch
            {
                throw new CryptographicException("Invalid PKCS#1 private key.");
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
