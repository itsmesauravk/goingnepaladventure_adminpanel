"use client"

import React, { useState, useCallback } from "react"

import CountrySelect from "./addForm/CountrySelectForm"
import DifficultySelect from "./addForm/DifficultySelectForm"
import Accommodation from "./addForm/AccommodationForm"
import MealSelect from "./addForm/MealsForm"
import BestSeasonsSelect from "./addForm/SeasonsForm"
import ImageUpload from "./addForm/ImagesForm"
import VideoUpload from "./addForm/VideoForm"

import NameInput from "./addForm/NameInputForm"
import PriceInput from "./addForm/PriceInputForm"
import ThumbnailInput from "./addForm/ThumbnailForm"
import TrekkingDaysInput from "./TrekkingDaysForm"
import LocationInput from "./addForm/LocationForm"
import GroupSizeInput from "./addForm/GroupSizeForm"
import StartingEndingPointInput from "./addForm/StartEndPointForm"
import FAQList from "./addForm/FaqForm"
import Highlights from "./addForm/HighlightsForm"
import { nanoid } from "nanoid"
import { useRouter } from "next/navigation"

interface FAQ {
  id: string
  question: string
  answer: string
}

type FAQField = "question" | "answer"

interface Link {
  text: string
  url: string
}

interface Highlight {
  content: string
  links: Link[]
}

const AddTrekForm: React.FC = () => {
  const route = useRouter()
  // State management
  const [accommodations, setAccommodations] = useState<string[]>([""])
  const [name, setName] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [country, setCountry] = useState("")
  const [minDays, setMinDays] = useState<number>(1)
  const [maxDays, setMaxDays] = useState<number>(1)
  const [location, setLocation] = useState<string>("")
  const [difficulty, setDifficulty] = useState<string>("")
  const [minGroupSize, setMinGroupSize] = useState<number>(0)
  const [maxGroupSize, setMaxGroupSize] = useState<number>(0)
  const [meal, setMeal] = useState<string>("")
  const [startingPoint, setStartingPoint] = useState<string>("")
  const [endingPoint, setEndingPoint] = useState<string>("")
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [video, setVideo] = useState<File | null>(null)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [highlights, setHighlights] = useState<Highlight[]>([])

  // name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  // accomodation
  const handleAccommodationChange = (index: number, value: string) => {
    const updatedAccommodations = [...accommodations]
    updatedAccommodations[index] = value
    setAccommodations(updatedAccommodations)
  }
  const handleAddAccommodation = () => {
    setAccommodations([...accommodations, ""])
  }
  const handleRemoveAccommodation = (index: number) => {
    setAccommodations(accommodations.filter((_, i) => i !== index))
  }
  // price
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(parseFloat(e.target.value))
  }
  // thumbnail
  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setThumbnailPreview(imageUrl)
    }
  }
  // country
  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(event.target.value)
  }
  // trekking days
  const handleMinDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinDays(Number(event.target.value))
  }
  const handleMaxDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxDays(Number(event.target.value))
  }
  // location
  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value)
  }
  // difficulty
  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDifficulty(event.target.value)
  }
  // group size
  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinGroupSize(Number(event.target.value))
  }
  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxGroupSize(Number(event.target.value))
  }
  // meal
  const handleMealChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMeal(event.target.value)
  }
  // starting & ending point
  const handleStartingPointChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartingPoint(event.target.value)
  }
  const handleEndingPointChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEndingPoint(event.target.value)
  }
  // best seasons
  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    )
    setSelectedSeasons(options)
  }
  // images
  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (files) {
        const newFiles = Array.from(files)
        const allowedFiles = newFiles.slice(0, Math.max(0, 10 - images.length))

        const newPreviews = allowedFiles.map((file) =>
          URL.createObjectURL(file)
        )

        setImages((prevImages) => [
          ...prevImages,
          ...allowedFiles.map((file) => URL.createObjectURL(file)),
        ])
        setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews])
      }
    },
    [images]
  )
  const removeImage = useCallback((index: number) => {
    setImages((prevImages) => {
      const newImages = [...prevImages]
      newImages.splice(index, 1)
      return newImages
    })
    setPreviews((prevPreviews) => {
      const newPreviews = [...prevPreviews]
      URL.revokeObjectURL(newPreviews[index]) // Clean up the URL object
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }, [])
  React.useEffect(() => {
    // Clean up URLs when component unmounts
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [])
  // video
  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setVideo(file)
  }
  const removeVideo = () => {
    setVideo(null)
  }
  // faq
  const handleFaqChange = useCallback(
    (id: string, field: FAQField, value: string) => {
      setFaqs((prevFaqs) =>
        prevFaqs.map((faq) =>
          faq.id === id ? { ...faq, [field]: value } : faq
        )
      )
    },
    []
  )
  const addFaq = useCallback(() => {
    setFaqs((prevFaqs) => [
      ...prevFaqs,
      { id: nanoid(), question: "", answer: "" },
    ])
  }, [])
  const removeFaq = useCallback((id: string) => {
    setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id !== id))
  }, [])
  // highlights
  const handleContentChange = (index: number, value: string) => {
    setHighlights((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], content: value }
      return updated
    })
  }

  const handleLinkChange = (
    highlightIndex: number,
    linkIndex: number,
    key: keyof Link,
    value: string
  ) => {
    setHighlights((prev) => {
      const updated = [...prev]
      updated[highlightIndex].links[linkIndex] = {
        ...updated[highlightIndex].links[linkIndex],
        [key]: value,
      }
      return updated
    })
  }

  const addNewLink = (highlightIndex: number) => {
    setHighlights((prev) => {
      const updated = [...prev]
      updated[highlightIndex].links.push({ text: "", url: "" })
      return updated
    })
  }

  const addNewHighlight = () => {
    const newHighlight: Highlight = {
      content: "",
      links: [{ text: "", url: "" }],
    }
    setHighlights((prev) => [...prev, newHighlight])
  }

  const removeHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index))
  }

  const removeLink = (highlightIndex: number, linkIndex: number) => {
    setHighlights((prev) => {
      const updated = [...prev]
      updated[highlightIndex].links = updated[highlightIndex].links.filter(
        (_, i) => i !== linkIndex
      )
      return updated
    })
  }

  // function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = {
      name,
      price,
      thumbnail: thumbnailPreview,
      country,
      trekkingDays: {
        min: minDays,
        max: maxDays,
      },
      location,
      difficulty,
      groupSize: {
        min: minGroupSize,
        max: maxGroupSize,
      },
      startingPoint,
      endingPoint,
      accommodations: accommodations.filter((acc) => acc.trim() !== ""), // Remove empty accommodations
      meal,
      bestSeasons: selectedSeasons,
      images: previews,
      video: video
        ? {
            name: video.name,
            size: video.size,
            type: video.type,
          }
        : null,
      faqs: faqs.map(({ question, answer }) => ({
        question,
        answer,
      })),
    }

    // Log the formatted data
    console.log("Trek Data:", formData)

    // You can also log individual sections for better readability
    console.group("Trek Submission Details:")
    console.log("Basic Information:", {
      name,
      price,
      country,
      location,
      difficulty,
    })
    console.log("Duration:", {
      minDays,
      maxDays,
    })
    console.log("Group Size:", {
      min: minGroupSize,
      max: maxGroupSize,
    })
    console.log("Locations:", {
      startingPoint,
      endingPoint,
    })
    console.log("Accommodations:", accommodations)
    console.log("Meal Plan:", meal)
    console.log("Best Seasons:", selectedSeasons)
    console.log("Media:", {
      thumbnailPreview,
      images: previews,
      video: video
        ? `${video.name} (${(video.size / 1024 / 1024).toFixed(2)}MB)`
        : null,
    })
    console.log("FAQs:", faqs)
    console.groupEnd()

    // Add validation feedback
    const requiredFields = {
      name,
      price,
      thumbnail: thumbnailPreview,
      country,
      location,
      difficulty,
      startingPoint,
      endingPoint,
      meal,
    }

    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (emptyFields.length > 0) {
      console.warn("Missing required fields:", emptyFields)
      // You can add UI feedback here later
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        {/* Back Button */}
        <div
          onClick={() => route.back()}
          className="bg-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Back
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-primary text-center flex-1">
          Add New Trek
        </h1>
      </div>
      {/* Separator */}
      <hr className="border-gray-300 mb-6" />

      <form onSubmit={handleSubmit} className="px-10">
        {/* Name */}
        <NameInput value={name} onChange={handleNameChange} />
        {/* second compartement */}
        <div className="flex justify-between">
          {/* Price */}
          <PriceInput value={price} onChange={handlePriceChange} />

          {/* Country */}
          <CountrySelect
            country={country}
            handleCountryChange={handleCountryChange}
          />
          {/* Difficulty */}
          <DifficultySelect
            difficulty={difficulty}
            handleDifficultyChange={handleDifficultyChange}
          />
        </div>

        {/* Thumbnail */}
        <ThumbnailInput
          preview={thumbnailPreview}
          handleImageChange={handleThumbnailChange}
        />

        {/* compartment 3  */}
        <div className="flex justify-between">
          {/* Best Seasons */}
          <BestSeasonsSelect
            selectedSeasons={selectedSeasons}
            handleSeasonChange={handleSeasonChange}
          />
          {/* Location */}
          <LocationInput
            location={location}
            handleLocationChange={handleLocationChange}
          />
          {/* Meal */}
          <MealSelect meal={meal} handleMealChange={handleMealChange} />
        </div>
        {/* Trekking Days */}
        <TrekkingDaysInput
          minDays={minDays}
          maxDays={maxDays}
          handleMinDaysChange={handleMinDaysChange}
          handleMaxDaysChange={handleMaxDaysChange}
        />

        {/* Group Size */}
        <GroupSizeInput
          minGroupSize={minGroupSize}
          maxGroupSize={maxGroupSize}
          handleMinChange={handleMinChange}
          handleMaxChange={handleMaxChange}
        />
        {/* Starting & Ending Points */}
        <StartingEndingPointInput
          startingPoint={startingPoint}
          endingPoint={endingPoint}
          handleStartingPointChange={handleStartingPointChange}
          handleEndingPointChange={handleEndingPointChange}
        />
        {/* Accommodation */}
        <Accommodation
          accommodations={accommodations}
          handleAccommodationChange={handleAccommodationChange}
          handleAddAccommodation={handleAddAccommodation}
          handleRemoveAccommodation={handleRemoveAccommodation}
        />

        {/* Highlights */}
        <Highlights
          highlights={highlights}
          onContentChange={handleContentChange}
          onLinkChange={handleLinkChange}
          onAddLink={addNewLink}
          onAddHighlight={addNewHighlight}
          onRemoveHighlight={removeHighlight}
          onRemoveLink={removeLink}
        />
        {/* FAQ */}
        <FAQList
          faqs={faqs}
          onFaqChange={handleFaqChange}
          onAddFaq={addFaq}
          onRemoveFaq={removeFaq}
        />
        {/* Image Upload */}
        <ImageUpload
          images={images}
          previews={previews}
          handleImageChange={handleImageChange}
          removeImage={removeImage}
        />
        {/* Video Upload */}
        <VideoUpload
          video={video}
          handleVideoChange={handleVideoChange}
          removeVideo={removeVideo}
        />
        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white font-semibold rounded
                     hover:bg-primary transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
          >
            Submit Trek
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTrekForm
