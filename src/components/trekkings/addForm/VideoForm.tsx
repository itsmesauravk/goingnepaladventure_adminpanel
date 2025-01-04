import React from "react"

interface VideoUploadProps {
  video: File | null
  preview: string
  handleVideoChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  removeVideo: () => void
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  video,
  preview,
  handleVideoChange,
  removeVideo,
}) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-primary mb-2 mt-3">
      Upload Video
    </h2>
    {preview && (
      <div className="flex items-center gap-4">
        <video
          src={preview}
          controls
          width="250"
          className="border border-gray-300 rounded-md"
        />
      </div>
    )}

    <div className="flex items-center gap-4">
      <input
        type="file"
        accept="video/*"
        onChange={handleVideoChange}
        className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
)

export default VideoUpload
