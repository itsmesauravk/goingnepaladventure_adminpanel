import React from "react"

interface VideoUploadProps {
  video: File | null
  handleVideoChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  removeVideo: () => void
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  video,
  handleVideoChange,
  removeVideo,
}) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-primary mb-2 mt-3">
      Upload Video
    </h2>
    {video ? (
      <div className="flex items-center gap-4">
        <video
          src={URL.createObjectURL(video)}
          controls
          width="250"
          className="border border-gray-300 rounded-md"
        />
        <button
          onClick={removeVideo}
          className="text-red-500 hover:text-red-700 font-semibold"
        >
          Remove Video
        </button>
      </div>
    ) : (
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    )}
  </div>
)

export default VideoUpload
