using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using Elevate.Common.Extensions;
using System.Security.Claims;
using System.Text;

namespace Elevate.Common.Utilities
{
    public class JwtUtility(IConfiguration configuration)
    {
        private readonly IConfiguration _configuration = configuration;

        public static void GenerateRsaKeyPair(string privateKeyPath, string publicKeyPath)
        {
            using (var rsa = RSA.Create(2048))
            {
                var privateKeyPem = rsa.ExportRSAPrivateKeyPem();
                var publicKeyPem = rsa.ExportRSAPublicKeyPem();

                File.WriteAllText(privateKeyPath, privateKeyPem, Encoding.UTF8);
                File.WriteAllText(publicKeyPath, publicKeyPem, Encoding.UTF8);
            }
        }

        public string GenerateJwtRsa(object claims)
        {
            string? privateKey = _configuration["Jwt:PrivateKey"];
            string? issuer = _configuration["Jwt:Issuer"];
            string? audience = _configuration["Jwt:Audience"];

            if (string.IsNullOrEmpty(privateKey) || string.IsNullOrEmpty(issuer) || string.IsNullOrEmpty(audience))
            {
                throw new InvalidOperationException("Missing JWT configuration (private key, issuer, or audience).");
            }

            var rsa = RSA.Create();
            rsa.ImportRSAPrivateKeyPem(privateKey);
            var securityKey = new RsaSecurityKey(rsa);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.RsaSha256);

            var audienceList = audience.Split(',', StringSplitOptions.RemoveEmptyEntries);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims as IEnumerable<Claim>),
                Expires = DateTime.Now.AddDays(1),
                Issuer = issuer,
                Audience = audienceList[0],
                SigningCredentials = credentials
            };

            if (audienceList.Length > 1)
            {
                var additionalAudiences = audienceList.Skip(1).Select(aud => new Claim("aud", aud)).ToArray();
                tokenDescriptor.Subject.AddClaims(additionalAudiences);
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public static bool ValidateJwtRsa(string token, string publicKey, string issuer, string audience)
        {
            using (var rsa = RSA.Create())
            {
                rsa.ImportRSAPublicKeyPem(publicKey);

                var audienceList = audience.Split(',', StringSplitOptions.RemoveEmptyEntries);

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new RsaSecurityKey(rsa),
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = true,
                    ValidAudiences = audienceList,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(5)
                };

                try
                {
                    new JwtSecurityTokenHandler().ValidateToken(token, validationParameters, out SecurityToken validatedToken);
                    return true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"JWT validation failed: {ex.Message}");
                    return false;
                }
            }
        }
    }
}
