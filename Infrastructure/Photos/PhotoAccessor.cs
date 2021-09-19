using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary cloudinary;

        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            cloudinary = new Cloudinary(account);
        }

        public async Task<PhotoUploadResults> AddPhoto(IFormFile file)
        {
            if (file.Length > 0)
            {
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill")
                };
                var uploadResults = await cloudinary.UploadAsync(uploadParams);
                if (uploadResults.Error != null)
                {
                    throw new Exception(uploadResults.Error.Message);
                }

                return new PhotoUploadResults
                {
                    PublicId = uploadResults.PublicId,
                    Url = uploadResults.SecureUrl.ToString()
                };
            }

            return null;
        }

        public async Task<string> DeletePhoto(string publicId)
            => (await cloudinary.DestroyAsync(CreateDeletetionParams(publicId))).HandleResult();

        

        private DeletionParams CreateDeletetionParams(string publicId) => new(publicId);

    }

    public static class PhotoAccessorExtensions 
    {
        public static string HandleResult(this DeletionResult result) => result.Result == "ok" ? result.Result : null;
    }
}