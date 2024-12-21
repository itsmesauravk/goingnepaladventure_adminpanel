"use client"

import React, { useState, useCallback, useEffect } from "react"

import { nanoid } from "nanoid"
import { useParams, useRouter } from "next/navigation"

import { Button } from "../ui/button"

import axios from "axios"
import { FaArrowLeft } from "react-icons/fa6"
import { Loader } from "../loading/Loader"
import NameInput from "../trekkings/addForm/NameInputForm"
import PriceInput from "../trekkings/addForm/PriceInputForm"
import CountrySelect from "../trekkings/addForm/CountrySelectForm"
import ThumbnailInput from "../trekkings/addForm/ThumbnailForm"
import BestSeasonsSelect from "../trekkings/addForm/SeasonsForm"
import LocationInput from "../trekkings/addForm/LocationForm"
import MealSelect from "../trekkings/addForm/MealsForm"
import TrekkingDaysInput from "../trekkings/TrekkingDaysForm"
import GroupSizeInput from "../trekkings/addForm/GroupSizeForm"
import StartingEndingPointInput from "../trekkings/addForm/StartEndPointForm"
import Accommodation from "../trekkings/addForm/AccommodationForm"
import OverviewForm from "../trekkings/addForm/OverviewForm"
import NoteForm from "../trekkings/addForm/NoteForm"
import HighlightForm from "../trekkings/addForm/HighlightsForm"
import ItineraryForm from "../trekkings/addForm/ItineraryForm"
import FAQForm from "../trekkings/addForm/FaqForm"
import InclusiveExclusiveServicesForm from "../trekkings/addForm/ServicesForm"

import ImageUpload from "../trekkings/addForm/ImagesForm"
import VideoUpload from "../trekkings/addForm/VideoForm"
import TripTypeForm from "./form/TripTypesFrom"
import MaxAltitude from "./form/MaxAltitude"
import TourLanguage from "./form/TourLanguage"
import SuitableAge from "./form/SuitableAge"
import ThingsToKnow from "./form/ThingsToKnow"
import ArrivalLocation from "./form/ArrivalLocation"

import { FaEye } from "react-icons/fa6"
import { json } from "stream/consumers"

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

const EditTourForm: React.FC = () => {
  const route = useRouter()
  // State management
  const [accommodations, setAccommodations] = useState<string[]>([""])
  const [thingsToKnow, setThingsToKnow] = useState<string[]>([""])
  const [name, setName] = useState("")
  const [maxAltitude, setMaxAltitude] = useState<number>(0)
  const [tourLanguage, setTourLanguage] = useState<string>("")
  const [suitableAge, setSuitableAge] = useState<string>("")
  const [price, setPrice] = useState<number>(0)
  const [thumbnail, setThumbnail] = useState<string | File>("")
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [country, setCountry] = useState("")
  const [minDays, setMinDays] = useState<number>(1)
  const [maxDays, setMaxDays] = useState<number>(1)
  const [location, setLocation] = useState<string>("")
  const [arrivalLocation, setArrivalLocation] = useState<string>("")
  const [departureLocation, setDepartureLocation] = useState<string>("")
  const [selectedTripType, setSelectedTripType] = useState({
    id: "",
    title: "",
  })
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

  //note
  const [note, setNote] = useState<string>("")

  const [loading, setLoading] = useState(false)
  const [tourViews, setTourViews] = useState<number>(0)

  //slug
  const slugId = useParams()
  const slug = slugId.slug

  // Event handlers

  // name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  // max altitude
  const handleAltidueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxAltitude(Number(e.target.value))
  }
  // tour language
  const handleTourLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTourLanguage(e.target.value)
  }
  // suitable age
  const suitableAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuitableAge(e.target.value)
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
  //things to know
  const handleThingsToKnowChange = (index: number, value: string) => {
    const updatedThingsToKnow = [...thingsToKnow]
    updatedThingsToKnow[index] = value
    setThingsToKnow(updatedThingsToKnow)
  }
  const handleAddThingsToKnow = () => {
    setThingsToKnow([...thingsToKnow, ""])
  }
  const handleRemoveThingsToKnow = (index: number) => {
    setThingsToKnow(thingsToKnow.filter((_, i) => i !== index))
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
  // arrival location
  const handleArrivalLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setArrivalLocation(event.target.value)
  }
  const handleDepartureLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDepartureLocation(event.target.value)
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

  const handleSeasonChange = (season: string) => {
    setSelectedSeasons(
      (prev) =>
        prev.includes(season)
          ? prev.filter((s) => s !== season) // Remove if already selected
          : [...prev, season] // Add if not selected
    )
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

  // get form
  const handleGetTourData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/tour/get-tour/${slug}`
      )
      if (response.data.success) {
        setLoading(false)
        const trekData = response.data.data
        setTourViews(trekData.viewsCount)
        setName(trekData.name)
        setPrice(trekData.price)
        setThumbnailPreview(trekData.thumbnail)
        setCountry(trekData.country)
        setMinDays(trekData.days.min)
        setMaxDays(trekData.days.max)
        setMaxAltitude(trekData.maxAltitude)
        setTourLanguage(trekData.language)
        setSuitableAge(trekData.suitableAge)
        setLocation(trekData.location)
        setArrivalLocation(trekData.arrivalLocation)
        setDepartureLocation(trekData.departureLocation)
        setSelectedTripType(trekData.tripType)
        setMinGroupSize(trekData.groupSize.min)
        setMaxGroupSize(trekData.groupSize.max)
        setMeal(trekData.meal)
        setStartingPoint(trekData.startingPoint)
        setEndingPoint(trekData.endingPoint)
        setSelectedSeasons(trekData.bestSeason)
        setOverview(trekData.overview)
        setHighlights(trekData.highlights)
        setAccommodations(trekData.accommodation)
        setThingsToKnow(trekData.thingsToKnow)
        setItineraries(trekData.itinerary)
        setInclusives(trekData.servicesCostIncludes)
        setExclusives(trekData.servicesCostExcludes)
        setFaqs(trekData.faq)
        setNote(trekData.note)
        // setImages(trekData.images)
        setPreviews(trekData.images)
        // if (trekData.video) {
        //   setVideo(trekData.video)
        // }
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetTourData()
  }, [])

  // function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()

    formData.append("name", name)
    formData.append("maxAltitude", maxAltitude.toString())
    formData.append("tourLanguage", tourLanguage)
    formData.append("suitableAge", suitableAge)
    formData.append("price", price.toString())
    formData.append("thumbnail", thumbnail as File)
    formData.append("country", country)
    formData.append("location", location)
    formData.append("arrivalLocation", arrivalLocation)
    formData.append("departureLocation", departureLocation)
    formData.append("tripType", JSON.stringify(selectedTripType))
    formData.append("minDays", minDays.toString())
    formData.append("maxDays", maxDays.toString())
    formData.append("groupSizeMin", minGroupSize.toString())
    formData.append("groupSizeMax", maxGroupSize.toString())
    formData.append("startingPoint", startingPoint)
    formData.append("endingPoint", endingPoint)
    formData.append("accommodation", JSON.stringify(accommodations))
    formData.append("thingsToKnow", JSON.stringify(thingsToKnow))
    formData.append("meal", meal)
    formData.append("bestSeason", JSON.stringify(selectedSeasons))
    formData.append("overview", overview)
    formData.append("highlights", JSON.stringify(highlights))
    formData.append("itinerary", JSON.stringify(itineraries))
    formData.append("servicesCostIncludes", JSON.stringify(inclusives))
    formData.append("servicesCostExcludes", JSON.stringify(exclusives))

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
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/tour/add-tour`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (response.data.success) {
        alert(response.data.message)
        setLoading(false)
        route.push("/tours")
      } else {
        alert(response.data.message)
        setLoading(false)
      }
    } catch (error) {
      alert("Error occurred while submitting the form.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-full">
      <div className="max-w-full mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white p-6 flex items-center justify-between">
          <div className="flex w-full items-center justify-between ">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => route.back()}
                className="hover:bg-opacity-80 p-2 rounded-full transition-colors"
              >
                <FaArrowLeft size={24} />
              </button>
              <h1 className="text-3xl font-bold">Edit Tour - {name}</h1>
            </div>
            <div className="flex items-center space-x-2 text-lg ">
              <FaEye />
              <span>{tourViews} views</span>
            </div>
          </div>
        </div>

        <form
          typeof="multipart/form-data"
          onSubmit={handleSubmit}
          className="p-8 space-y-8"
        >
          {/* Basic Information Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-tourPrimary mb-6 border-b pb-3">
              Part 1: Basic Information
            </h2>

            <div className="space-y-6">
              <NameInput value={name} onChange={handleNameChange} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PriceInput value={price} onChange={handlePriceChange} />
                <CountrySelect
                  country={country}
                  handleCountryChange={handleCountryChange}
                />
                <TripTypeForm
                  tripType={selectedTripType}
                  handleTripTypeChange={(selected) =>
                    setSelectedTripType(selected)
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MaxAltitude
                  value={maxAltitude}
                  onChange={handleAltidueChange}
                />
                <TourLanguage
                  value={tourLanguage}
                  onChange={handleTourLanguageChange}
                />
                <SuitableAge value={suitableAge} onChange={suitableAgeChange} />
              </div>

              <div className="mt-6">
                <ThumbnailInput
                  preview={thumbnailPreview}
                  handleImageChange={handleThumbnailChange}
                />
              </div>
            </div>
          </div>

          {/* Tour Details Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-tourPrimary mb-6 border-b pb-3">
              Tour Details
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BestSeasonsSelect
                  selectedSeasons={selectedSeasons}
                  handleSeasonChange={handleSeasonChange}
                />
                <LocationInput
                  location={location}
                  handleLocationChange={handleLocationChange}
                />
                <MealSelect meal={meal} handleMealChange={handleMealChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TrekkingDaysInput
                  minDays={minDays}
                  maxDays={maxDays}
                  handleMinDaysChange={handleMinDaysChange}
                  handleMaxDaysChange={handleMaxDaysChange}
                />
                <GroupSizeInput
                  minGroupSize={minGroupSize}
                  maxGroupSize={maxGroupSize}
                  handleMinChange={handleMinChange}
                  handleMaxChange={handleMaxChange}
                />
              </div>
            </div>
          </div>

          {/* Location Details Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-tourPrimary mb-6 border-b pb-3">
              Location Details
            </h2>
            <div className="space-y-6">
              <ArrivalLocation
                arrivalLocation={arrivalLocation}
                departureLocation={departureLocation}
                handleArrivalLocationChange={handleArrivalLocationChange}
                handleDepartureLocationChange={handleDepartureLocationChange}
              />
              <StartingEndingPointInput
                startingPoint={startingPoint}
                endingPoint={endingPoint}
                handleStartingPointChange={handleStartingPointChange}
                handleEndingPointChange={handleEndingPointChange}
              />
            </div>
          </div>

          {/* Accommodation Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-tourPrimary mb-6 border-b pb-3">
              Accommodation
            </h2>
            <Accommodation
              accommodations={accommodations}
              handleAccommodationChange={handleAccommodationChange}
              handleAddAccommodation={handleAddAccommodation}
              handleRemoveAccommodation={handleRemoveAccommodation}
            />
          </div>

          {/* Description Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-tourPrimary mb-6 border-b pb-3">
              Description
            </h2>
            <div className="space-y-6">
              <OverviewForm value={overview} onChange={handleOverviewChange} />
              <NoteForm value={note} onChange={setNote} />
              <ThingsToKnow
                thingsToKnow={thingsToKnow}
                handleThingsToKnowChange={handleThingsToKnowChange}
                handleAddThingsToKnow={handleAddThingsToKnow}
                handleRemoveThingsToKnow={handleRemoveThingsToKnow}
              />
            </div>
          </div>

          {/* Highlights Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-semibold text-tourPrimary">
                Highlights
              </h2>
              <Button
                type="button"
                onClick={addHighlight}
                className="bg-tourPrimary hover:bg-opacity-90 text-white"
              >
                Add Highlight
              </Button>
            </div>
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
          </div>

          {/* Itineraries Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-semibold text-tourPrimary">
                Itineraries
              </h2>
              <Button
                type="button"
                onClick={addItinerary}
                className="bg-tourPrimary hover:bg-opacity-90 text-white"
              >
                Add Itinerary
              </Button>
            </div>
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
          </div>

          {/* FAQs Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-semibold text-tourPrimary">FAQs</h2>
              <Button
                type="button"
                onClick={addFAQ}
                className="bg-tourPrimary hover:bg-opacity-90 text-white"
              >
                Add FAQ
              </Button>
            </div>
            {faqs.map((faq, index) => (
              <FAQForm
                key={index}
                index={index}
                faq={faq}
                updateFAQ={(updatedFAQ) => updateFAQ(index, updatedFAQ)}
                removeFAQ={() => removeFAQ(index)}
              />
            ))}
          </div>

          {/* Services Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-tourPrimary mb-6 border-b pb-3">
              Services
            </h2>
            <InclusiveExclusiveServicesForm
              inclusives={inclusives}
              exclusives={exclusives}
              onUpdateInclusives={setInclusives}
              onUpdateExclusives={setExclusives}
            />
          </div>

          {/* Media Upload Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-tourPrimary mb-6 border-b pb-3">
              Media Upload
            </h2>
            <div className="space-y-6">
              <ImageUpload
                images={images}
                previews={previews}
                handleImageChange={handleImageChange}
                removeImage={removeImage}
              />
              <VideoUpload
                video={video}
                handleVideoChange={handleVideoChange}
                removeVideo={removeVideo}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-12">
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-tourPrimary to-tourPrimary/80 
                text-white font-bold rounded-lg shadow-lg hover:opacity-90 
                transition-all duration-300 focus:outline-none focus:ring-4 
                focus:ring-tourPrimary/30 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-3">
                  <Loader height="24px" width="24px" />
                  <p>Updating Tour Details...</p>
                </div>
              ) : (
                "Update Tour Information"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTourForm
