"use client"

import React, { useState, useCallback, useEffect } from "react"

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
import { useParams, useRouter } from "next/navigation"

import { Button } from "../ui/button"
import HighlightForm from "./addForm/HighlightsForm"
import ItineraryForm from "./addForm/ItineraryForm"
import FAQForm from "./addForm/FaqForm"
import OverviewForm from "./addForm/OverviewForm"
import InclusiveExclusiveServicesForm from "./addForm/ServicesForm"
import PackagingForm from "./addForm/PackagingForm"
import NoteForm from "./addForm/NoteForm"
import axios from "axios"
import { FaArrowLeft } from "react-icons/fa6"

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
  accommodations: string
  meals: string
  links: Link[]
}

interface Itinerary {
  day: number
  title: string
  details: string
  links: Link[]
}

const EditTrekForm: React.FC = () => {
  const route = useRouter()
  // State management
  const [accommodations, setAccommodations] = useState<string[]>([""])
  const [name, setName] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [thumbnail, setThumbnail] = useState<string | File>("")
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
  const [images, setImages] = useState<(string | File)[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [video, setVideo] = useState<File | null>(null)
  const [faqs, setFaqs] = useState<FAQ[]>([{ question: "", answer: "" }])
  const [highlights, setHighlights] = useState<Highlight[]>([
    { content: "", links: [{ text: "", url: "" }] },
  ])
  const [itineraries, setItineraries] = useState<Itinerary[]>([
    {
      day: 1,
      title: "",
      details: "",
      accommodations: "",
      meals: "",
      links: [{ text: "", url: "" }],
    },
  ])
  const [overview, setOverview] = useState("")
  // services
  const [inclusives, setInclusives] = useState<string[]>([])
  const [exclusives, setExclusives] = useState<string[]>([])
  // packaging
  const [general, setGeneral] = useState<string[]>([])
  const [clothes, setClothes] = useState<string[]>([])
  const [firstAid, setFirstAid] = useState<string[]>([])
  const [otherEssentials, setOtherEssentials] = useState<string[]>([])
  //note
  const [note, setNote] = useState<string>("")

  const [loading, setLoading] = useState(false)

  const slugId = useParams()
  const slug = slugId.slug

  // Event handlers

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
      setThumbnailPreview(URL.createObjectURL(file))
      setThumbnail(file)
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

        setImages((prevImages) => [...prevImages, ...allowedFiles]) // Store File objects
        setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]) // Store preview URLs
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
        accommodations: "",
        meals: "",
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

  // overview
  const handleOverviewChange = (newValue: string) => {
    setOverview(newValue)
  }

  //   const trekSlug = "everest-base-camp-trek-6738c8b330898dabe45628c7"

  //getting the data of trekking
  const handleGetTrekData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/trekking/trek/slug/${slug}`
      )
      console.log("Response:", response.data)
      if (response.data.success) {
        const trekData = response.data.data
        setName(trekData.name)
        setPrice(trekData.price)
        setThumbnailPreview(trekData.thumbnail)
        setCountry(trekData.country)
        setMinDays(trekData.days.min)
        setMaxDays(trekData.days.max)
        setLocation(trekData.location)
        setDifficulty(trekData.difficulty)
        setMinGroupSize(trekData.groupSize.min)
        setMaxGroupSize(trekData.groupSize.max)
        setMeal(trekData.meal)
        setStartingPoint(trekData.startingPoint)
        setEndingPoint(trekData.endingPoint)
        setSelectedSeasons(trekData.bestSeason)
        setOverview(trekData.overview)
        setHighlights(trekData.trekHighlights)
        setItineraries(trekData.itinerary)
        setInclusives(trekData.servicesCostIncludes)
        setExclusives(trekData.servicesCostExcludes)
        setGeneral(trekData.packingList.general)
        setClothes(trekData.packingList.clothes)
        setFirstAid(trekData.packingList.firstAid)
        setOtherEssentials(trekData.packingList.otherEssentials)
        setFaqs(trekData.faq)
        setNote(trekData.note)
        // setImages(trekData.images)
        setPreviews(trekData.images)
        // if (trekData.video) {
        //   setVideo(trekData.video)
        // }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetTrekData()
  }, [])

  // function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()

    formData.append("name", name)
    formData.append("price", price.toString())
    formData.append("thumbnail", thumbnail as File)
    formData.append("country", country)
    formData.append("location", location)
    formData.append("difficulty", difficulty)
    formData.append("minDays", minDays.toString())
    formData.append("maxDays", maxDays.toString())
    formData.append("groupSizeMin", minGroupSize.toString())
    formData.append("groupSizeMax", maxGroupSize.toString())
    formData.append("startingPoint", startingPoint)
    formData.append("endingPoint", endingPoint)
    formData.append("accommodation", JSON.stringify(accommodations))
    formData.append("meal", meal)
    formData.append("bestSeason", JSON.stringify(selectedSeasons))
    formData.append("overview", overview)
    formData.append("trekHighlights", JSON.stringify(highlights))
    formData.append("itinerary", JSON.stringify(itineraries))
    formData.append("servicesCostIncludes", JSON.stringify(inclusives))
    formData.append("servicesCostExcludes", JSON.stringify(exclusives))
    formData.append(
      "packingList",
      JSON.stringify({ general, clothes, firstAid, otherEssentials })
    )
    formData.append("faq", JSON.stringify(faqs))
    formData.append("note", note)

    previews.forEach(
      (_, index) => formData.append("images", images[index]) // Attach image files
    )

    if (video) {
      formData.append("video", video) // Attach video file
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/trekking/add-trek`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      console.log("Response:", response.data)
      if (response.data.success) {
        alert(response.data.message)
        setLoading(false)
        route.push("/trekking")
      } else {
        alert(response.data.message)
        setLoading(false)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error occurred while submitting the form.")
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 ">
      <div className="flex items-center   gap-4 mb-4 pb-4 pt-4 ">
        {/* Back Button */}
        <div
          onClick={() => route.back()}
          className=" font-bold py-2 px-4 rounded cursor-pointer"
        >
          <FaArrowLeft size={24} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold bg-secondary text-white text-center flex-1  px-12 py-2 ">
          Edit Trek
        </h1>
      </div>
      {/* Separator */}
      <hr className="border-gray-300 mb-6" />

      <form
        typeof="multipart/form-data"
        onSubmit={handleSubmit}
        className=" items-center px-10"
      >
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

        <OverviewForm value={overview} onChange={handleOverviewChange} />

        <NoteForm value={note} onChange={setNote} />

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
            className="flex items-center text-white"
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
            className="flex items-center mt-4 text-white"
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
            className="flex items-center mt-4 text-white"
          >
            Add New Question
          </Button>
        </div>

        {/* Services  */}
        <InclusiveExclusiveServicesForm
          inclusives={inclusives}
          exclusives={exclusives}
          onUpdateInclusives={setInclusives}
          onUpdateExclusives={setExclusives}
        />

        <PackagingForm
          general={general}
          clothes={clothes}
          firstAid={firstAid}
          otherEssentials={otherEssentials}
          onUpdateGeneral={setGeneral}
          onUpdateClothes={setClothes}
          onUpdateFirstAid={setFirstAid}
          onUpdateOtherEssentials={setOtherEssentials}
        />

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
            disabled={loading}
            className="px-8 py-4 bg-primary text-white font-semibold rounded
                     hover:bg-primary transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
          >
            {loading ? "Updating Your Trek, Please Wait..." : "Update Details"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditTrekForm
