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
import OverviewForm from "./addForm/OverviewForm"
import InclusiveExclusiveServicesForm from "./addForm/ServicesForm"
import PackagingForm from "./addForm/PackagingForm"
import NoteForm from "./addForm/NoteForm"
import axios from "axios"

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
    setPrice(1499)
    setCountry("Nepal")
    setLocation("Khumbu Region")
    setDifficulty("Moderate")
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
          { text: "Base Camp Details", url: "https://example.com/base-camp" },
        ],
      },
      {
        content: "Visit the historic Tengboche Monastery",
        links: [
          { text: "Monastery Info", url: "https://example.com/tengboche" },
        ],
      },
      {
        content: "Spectacular sunrise view from Kala Patthar",
        links: [
          { text: "View Point", url: "https://example.com/kala-patthar" },
        ],
      },
    ])

    // Itineraries
    setItineraries([
      {
        day: 1,
        title: "Arrival in Kathmandu",
        details: "Welcome meeting and trek briefing",
        accommodations: "5-star hotel",
        meals: "Welcome dinner",
        links: [
          { text: "Kathmandu Guide", url: "https://example.com/kathmandu" },
        ],
      },
      {
        day: 2,
        title: "Fly to Lukla, Trek to Phakding",
        details: "Scenic mountain flight and easy trek",
        accommodations: "Tea house",
        meals: "Breakfast, lunch, dinner",
        links: [{ text: "Lukla Info", url: "https://example.com/lukla" }],
      },
      {
        day: 3,
        title: "Trek to Namche Bazaar",
        details: "Challenging ascent to Sherpa capital",
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

    // Packaging Lists
    setGeneral([
      "Backpack (40-60L)",
      "Daypack (20-30L)",
      "Sleeping bag (-20°C rated)",
      "Trekking poles",
    ])

    setClothes([
      "Down jacket",
      "Waterproof jacket and pants",
      "Thermal base layers",
      "Trekking pants",
      "Hiking boots",
    ])

    setFirstAid([
      "Altitude sickness medication",
      "Basic first aid kit",
      "Personal medications",
      "Bandages and antiseptic wipes",
    ])

    setOtherEssentials([
      "Headlamp with spare batteries",
      "Water purification tablets",
      "Sun protection (hat, sunscreen, sunglasses)",
      "Camera with extra batteries",
    ])
  }

  // function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = {
      name,
      price,
      country,
      minDays,
      maxDays,
      location,
      difficulty,
      thumbnail: thumbnailPreview,
      groupSizeMin: minGroupSize,
      groupSizeMax: maxGroupSize,
      startingPoint,
      endingPoint,
      accommodation: accommodations.filter((acc) => acc.trim() !== ""),
      meal,
      bestSeason: selectedSeasons,
      overview,
      note,
      trekHighlights: highlights.map((highlight) => ({
        content: highlight.content,
        links: highlight.links.filter((link) => link.text && link.url),
      })),
      itinerary: itineraries.map((itinerary) => ({
        day: itinerary.day,
        title: itinerary.title,
        details: itinerary.details,
        accommodations: itinerary.accommodations,
        meals: itinerary.meals,
        links: itinerary.links.filter((link) => link.text && link.url),
      })),
      servicesCostIncludes: inclusives,
      servicesCostExcludes: exclusives,
      faq: faqs.filter((faq) => faq.question && faq.answer),

      packingList: {
        general,
        clothes,
        firstAid,
        otherEssentials,
      },

      images: previews,
      video: video
        ? {
            name: video.name,
            size: `${(video.size / 1024 / 1024).toFixed(2)}MB`,
            type: video.type,
          }
        : null,
    }
    console.log("Form data:", formData)

    try {
      // fetch api
      const data = await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/trekking/add-trek`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .catch((error) => {
          console.error("Error:", error)
        })
      console.log(data)
    } catch (error) {
      console.log("Error:", error)
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
