"use client"

import React, { useState, useCallback } from "react"

import { nanoid } from "nanoid"
import { useRouter } from "next/navigation"

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

import TourLanguage from "../tours/form/TourLanguage"
import SuitableAge from "../tours/form/SuitableAge"
import ThingsToKnow from "../tours/form/ThingsToKnow"
import ArrivalLocation from "../tours/form/ArrivalLocation"
import ClothesType from "./form/ClothesType"

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

const AddWellnessForm: React.FC = () => {
  const route = useRouter()
  // State management
  const [accommodations, setAccommodations] = useState<string[]>([""])
  const [thingsToKnow, setThingsToKnow] = useState<string[]>([""])
  const [name, setName] = useState("")
  const [maxAltitude, setMaxAltitude] = useState<number>(0)
  const [tourLanguage, setTourLanguage] = useState<string>("")
  const [clothesType, setClothesType] = useState<string>("")
  const [suitableAge, setSuitableAge] = useState<string>("")
  const [price, setPrice] = useState<number>(0)
  const [thumbnail, setThumbnail] = useState<string | File>("")
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [country, setCountry] = useState("")
  const [minDays, setMinDays] = useState<number>(1)
  const [maxDays, setMaxDays] = useState<number>(1)
  const [location, setLocation] = useState<string>("")
  const [arrivalLocation, setArrivalLocation] = useState<string>("")
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
  // clothes type
  const handleClothesTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setClothesType(event.target.value)
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

  //autofill function
  const autoFillHandler = () => {
    // Basic Information
    setName("Everest Base Camp Trek")
    setMaxAltitude(5364)
    setTourLanguage("English")
    setClothesType("Casual")
    setSuitableAge("+16")
    setPrice(1499)
    setCountry("Nepal")
    setLocation("Khumbu Region")
    setArrivalLocation("Kathmandu")
    setMinDays(12)
    setMaxDays(14)
    setMinGroupSize(2)
    setMaxGroupSize(16)
    setStartingPoint("Kathmandu")
    setEndingPoint("Lukla")
    setMeal("Inclusive")
    setSelectedSeasons(["Spring", "Autumn"])

    // Accommodations
    setAccommodations([
      "Luxury Hotel in Kathmandu",
      "Tea House Lodge in Namche",
      "Mountain Lodge in Dingboche",
      "Basic Guesthouse in Gorak Shep",
    ])

    // things to know
    setThingsToKnow([
      "You must have a valid passport with at least 6 months validity.",
      "You must have a valid visa to enter Nepal.",
      "You must have travel insurance that covers trekking up to 6000m.",
    ])

    // Overview
    setOverview(
      `Experience the adventure of a lifetime on our Everest Base Camp Trek. This iconic journey takes you through the stunning Khumbu region, past charming Sherpa villages, and into the heart of the Himalayas. Witness breathtaking mountain views, experience rich local culture, and achieve your dreams of reaching the base of the world's highest peak.`
    )

    // Note
    setNote(
      "Please ensure you have adequate travel insurance and are physically prepared for high-altitude trekking."
    )

    // Highlights
    setHighlights([
      {
        content: "Stand at Everest Base Camp (5,364m)",
        links: [
          { text: "Everest Base Camp", url: "https://example.com/base-camp" },
        ],
      },
      {
        content: "Visit the historic Tengboche Monastery",
        links: [
          { text: "Tengboche Monastery", url: "https://example.com/tengboche" },
        ],
      },
      {
        content: "Spectacular sunrise view from Kala Patthar view point",
        links: [
          { text: "Kala Patthar", url: "https://example.com/kala-patthar" },
        ],
      },
    ])

    // Itineraries
    setItineraries([
      {
        day: 1,
        title: "Arrival in Kathmandu",
        details:
          "Welcome meeting and trek briefing on Thangaland Restro and stay there.",
        accommodations: "5-star hotel",
        meals: "Welcome dinner",
        links: [
          { text: "Thangaland Restro", url: "https://example.com/kathmandu" },
        ],
      },
      {
        day: 2,
        title: "Fly to Lukla, Trek to Phakding",
        details: "Scenic mountain flight and easy trek and stay as Hotel Taj.",
        accommodations: "Tea house",
        meals: "Breakfast, lunch, dinner",
        links: [{ text: "Hotel Taj", url: "https://example.com/lukla" }],
      },
      {
        day: 3,
        title: "Trek to Namche Bazaar",
        details:
          "Challenging ascent to Sherpa capital with Namche Guide helping you.",
        accommodations: "Mountain lodge",
        meals: "All meals included",
        links: [{ text: "Namche Guide", url: "https://example.com/namche" }],
      },
    ])

    // FAQs
    setFaqs([
      {
        question: "What is the best time to trek?",
        answer:
          "March to May and September to November offer the best weather conditions.",
      },
      {
        question: "Do I need prior trekking experience?",
        answer:
          "While prior experience is beneficial, this trek is suitable for beginners with good fitness levels.",
      },
      {
        question: "What about altitude sickness?",
        answer:
          "Our itinerary includes proper acclimatization days to minimize the risk of altitude sickness.",
      },
    ])

    // Services
    setInclusives([
      "All domestic flights",
      "Professional licensed guide",
      "Porters (1 porter for 2 trekkers)",
      "All permits and fees",
      "All accommodations during trek",
      "Three meals per day during trek",
    ])

    setExclusives([
      "International flights",
      "Travel insurance",
      "Personal trekking gear",
      "Tips for guides and porters",
      "Personal expenses",
      "Alcoholic beverages",
    ])
  }

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
    formData.append("clothesType", clothesType)
    formData.append("arrivalLocation", arrivalLocation)
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
    formData.append("trekHighlights", JSON.stringify(highlights))
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
    <div className="container mx-auto p-6">
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
          Add New Wellness
        </h1>
      </div>
      {/* Separator */}
      <hr className="border-gray-300 mb-6" />

      <Button
        type="button"
        onClick={autoFillHandler}
        className="bg-green-500 text-white"
      >
        Auto Fill Form (Debug)
      </Button>

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
        </div>
        {/* third compartment */}
        <div className="flex justify-between">
          {/* Tour Language */}
          <TourLanguage
            value={tourLanguage}
            onChange={handleTourLanguageChange}
          />

          {/* Clothes Type */}
          <ClothesType value={clothesType} onChange={handleClothesTypeChange} />

          {/* suitable age  */}
          <SuitableAge value={suitableAge} onChange={suitableAgeChange} />
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
        {/* Arrival Location */}
        <ArrivalLocation
          arrivalLocation={arrivalLocation}
          handleArrivalLocationChange={handleArrivalLocationChange}
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

        {/* Overview */}

        <OverviewForm value={overview} onChange={handleOverviewChange} />

        <NoteForm value={note} onChange={setNote} />

        {/* Things To Know */}
        <ThingsToKnow
          thingsToKnow={thingsToKnow}
          handleThingsToKnowChange={handleThingsToKnowChange}
          handleAddThingsToKnow={handleAddThingsToKnow}
          handleRemoveThingsToKnow={handleRemoveThingsToKnow}
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
            {loading ? (
              <div className="flex gap-2">
                <p>Uploading Your Tour, Please Wait...</p>
                <Loader height="20px" width="20px" />
              </div>
            ) : (
              "Submit Details"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddWellnessForm
