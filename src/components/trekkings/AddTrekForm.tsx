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
import { nanoid } from "nanoid"
import { useRouter } from "next/navigation"

import { Button } from "../ui/button"
import HighlightForm from "./addForm/HighlightsForm"
import ItineraryForm from "./addForm/ItineraryForm"
import FAQForm from "./addForm/FaqForm"

interface FAQ {
  question: string
  answer: string
}
type FAQField = "question" | "answer"

interface Highlight {
  content: string
  links: { text: string; url: string }[]
}

interface Link {
  text: string
  url: string
}

interface Itinerary {
  day: number
  title: string
  details: string
  links: Link[]
}

interface Itinerary {
  day: number
  title: string
  details: string
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
  const [faqs, setFaqs] = useState<FAQ[]>([{ question: "", answer: "" }])
  const [highlights, setHighlights] = useState<Highlight[]>([
    { content: "", links: [{ text: "", url: "" }] },
  ])
  const [itineraries, setItineraries] = useState<Itinerary[]>([
    { day: 1, title: "", details: "", links: [{ text: "", url: "" }] },
  ])

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
  const addFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }])
  }
  const updateFAQ = (index: number, updatedFAQ: FAQ) => {
    const newFaqs = [...faqs]
    newFaqs[index] = updatedFAQ
    setFaqs(newFaqs)
  }
  const removeFAQ = (index: number) => {
    const newFaqs = [...faqs]
    newFaqs.splice(index, 1)
    setFaqs(newFaqs)
  }
  // highlights
  const addHighlight = () => {
    setHighlights([
      ...highlights,
      { content: "", links: [{ text: "", url: "" }] },
    ])
  }
  const updateHighlights = (index: number, updatedHighlight: Highlight) => {
    const newHighlights = [...highlights]
    newHighlights[index] = updatedHighlight
    setHighlights(newHighlights)
  }
  const removeHighlight = (index: number) => {
    const newHighlights = [...highlights]
    newHighlights.splice(index, 1)
    setHighlights(newHighlights)
  }
  // itineraries
  const addItinerary = () => {
    setItineraries([
      ...itineraries,
      {
        day: itineraries.length + 1,
        title: "",
        details: "",
        links: [{ text: "", url: "" }],
      },
    ])
  }

  const updateItineraries = (index: number, updatedItinerary: Itinerary) => {
    const newItineraries = [...itineraries]
    newItineraries[index] = updatedItinerary
    setItineraries(newItineraries)
  }

  const removeItinerary = (index: number) => {
    const newItineraries = [...itineraries]
    newItineraries.splice(index, 1)

    // Recalculate days after removing
    const recalculatedItineraries = newItineraries.map((itinerary, i) => ({
      ...itinerary,
      day: i + 1,
    }))
    setItineraries(recalculatedItineraries)
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

      <form onSubmit={handleSubmit} className=" items-center px-10">
        <h1 className="text-red-600 text-2xl font-bold mt-10 mb-10 items-center flex justify-center">
          Part 1 (Basic Information)
        </h1>

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

        <h1 className="text-red-600 text-2xl font-bold mt-10 mb-10 items-center flex justify-center">
          Part 2 (highlights, Itenaries & faq)
        </h1>

        {/* Highlight */}

        <div>
          <h1 className="mb-4 text-2xl font-bold">Highlight</h1>

          {highlights.map((highlight, index) => (
            <HighlightForm
              key={index}
              index={index}
              highlight={highlight}
              updateHighlight={(updatedHighlight) =>
                updateHighlights(index, updatedHighlight)
              }
              removeHighlight={() => removeHighlight(index)}
            />
          ))}

          <Button
            type="button"
            onClick={addHighlight}
            className="flex items-center"
          >
            Add Highlight
          </Button>
        </div>

        {/* Itinerary */}

        <div className="mt-5">
          <h1 className="mb-4 text-2xl font-bold">Itineraries</h1>

          {itineraries.map((itinerary, index) => (
            <ItineraryForm
              key={index}
              index={index}
              itinerary={itinerary}
              updateItinerary={(updatedItinerary) =>
                updateItineraries(index, updatedItinerary)
              }
              removeItinerary={() => removeItinerary(index)}
            />
          ))}

          <Button
            type="button"
            onClick={addItinerary}
            className="flex items-center mt-4"
          >
            Add New Itinerary
          </Button>
        </div>

        {/* FAQ */}
        <div className="mt-5">
          <h1 className="mb-4 text-2xl font-bold">FAQs</h1>

          {faqs.map((faq, index) => (
            <FAQForm
              key={index}
              index={index}
              faq={faq}
              updateFAQ={(updatedFAQ) => updateFAQ(index, updatedFAQ)}
              removeFAQ={() => removeFAQ(index)}
            />
          ))}

          <Button
            type="button"
            onClick={addFAQ}
            className="flex items-center mt-4"
          >
            Add New Question
          </Button>
        </div>

        <h1 className="text-red-600 text-2xl font-bold mt-10 mb-10 items-center flex justify-center">
          Part 3 (images & video)
        </h1>

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
        <div className="flex justify-center items-center mt-16 mb-16">
          <button
            type="submit"
            className="px-8 py-4 bg-primary text-white font-semibold rounded
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
